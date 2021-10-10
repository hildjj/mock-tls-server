import {log} from './utils.js'
import stream from 'stream'
import util from 'util'

// A mock socket is two duplex HalfSockets, each of which is connected to the
// other with a crossover cable.

// Summary of node stream events:
// end() => 'finish' (the send side)
// push(null) => 'end' (the receive side)
// 'finish' + 'end' => 'close'

/**
 * Data was written to a HalfSocket.
 *
 * @event HalfSocket#written
 * @param {Buffer|string} data The data that was written.
 * @param {string} encoding The encoding for the data.
 */
const WRITTEN_EVENT = 'written'

/**
 * One end of a socket, either client or server.  Serves as a pass-through to
 * the other side.
 *
 * @fires {HalfSocket#written} When data is written to this side of the socket
 *   to be sent.
 */
export class HalfSocket extends stream.Duplex {
  /**
   * Creates an instance of HalfSocket.
   *
   * @param {string} name The name of this socket end, for debugging.
   * @param {stream.DuplexOptions} opts Options for the socket end.
   */
  constructor(name, opts) {
    opts = {
      // These have slightly different values between Duplex and Socket
      // on node 12 and 16.
      allowHalfOpen: false,
      autoDestroy: true,
      emitClose: true,
      ...opts,
    }
    super(opts)
    this.name = name
  }

  /**
   * Add debug logging to EventEmitter.  Start with NODE_DEBUG=mock-tls-server
   * to see all events.
   *
   * @param {string} eventName The name of the event.
   * @param {any[]} args The arguments to be passed to listeners.
   * @returns {boolean} Returns `true` if the event had listeners, `false`
   *   otherwise.
   */
  emit(eventName, ...args) {
    log(this.name, eventName, ...args)
    return super.emit(eventName, ...args)
  }

  _write(chunk, encoding, cb) {
    // De-couple the halves
    this.emit(WRITTEN_EVENT, chunk, encoding)
    cb()
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function
  _read(sz) {
  }

  [util.inspect.custom]() {
    return `[HalfSocket "${this.name}"]`
  }
}

/**
 * A double-ended mock socket, for use in testing.  No actual network
 * connections are created, so this can be used for testing no matter what
 * permissions you have in your CI system.
 */
export class MockSocket extends stream.Duplex {
  /**
   * Creates an instance of MockSocket.
   *
   * @param {stream.DuplexOptions} opts Options for both server and client
   *   sides.
   */
  constructor(opts) {
    super(opts)
    this.clientSocket = new HalfSocket('cli', opts)
    this.serverSocket = new HalfSocket('srv', opts)

    // Simulate the TCP flavor of the Internet.
    // If we were going to add delays, throttling, or Nagel-like coalescing,
    // this would be the place to do it.
    this.clientSocket.on(WRITTEN_EVENT, (chunk, encoding) => {
      this.serverSocket.push(chunk)
    })
    this.serverSocket.on(WRITTEN_EVENT, (chunk, encoding) => {
      this.clientSocket.push(chunk)
    })

    // This is from the song by Jimmy Buffer:
    // FINs to the left.
    this.clientSocket.on('finish', () => {
      this.serverSocket.push(null)
    })
    // FINs to the right.
    this.serverSocket.on('finish', () => {
      this.clientSocket.push(null)
    })
  }
}
