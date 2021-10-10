import {extendedError, log, normalizeArgs} from './utils.js'
import {EventEmitter} from 'events'
import {MockSocket} from './socket.js'
import {globalKernel} from './kernel.js'
import stream from 'stream'

/**
 * @typedef {object} SocketConnectOpts
 * @property {number} port Listening server port to connect to.
 * @property {boolean} [allowHalfOpen=false] If set to false, then the
 *   socket will automatically end the writable side when the readable side
 *   ends.
 */

/**
 * @typedef {object} ServerOpts
 * @property {boolean} [allowHalfOpen=false] If set to false, then the
 *   socket will automatically end the writable side when the readable side
 *   ends.
 */

/**
 * Initiate a connection to a given server port.
 *
 * @param {number|SocketConnectOpts} options The server port to connect to.
 *   Must already be listening.
 * @param {SocketCallback} [connectListener] Event listener for the 'connect'
 *   event.
 * @returns {stream.Duplex} The client side HalfSocket.
 * @throws {TypeError} Invalid type for port.
 */
export function connect(options, connectListener) {
  const opts = normalizeArgs(options, {connectListener})
  const {port, connectListener: listener, ...rest} = opts

  if (typeof port !== 'number') {
    throw new TypeError('Invalid type for port')
  }
  const ms = new MockSocket(rest)
  const srv = /** @type {Server} */ (globalKernel.lookup(port))

  if (srv) {
    srv._addClient(ms)
    if (listener) {
      ms.clientSocket.on('connect', listener)
    }
    process.nextTick(() => ms.clientSocket.emit('connect'))
  } else {
    const er = extendedError(`Error: connect ECONNREFUSED ${port}`, {
      code: 'ECONNREFUSED',
      port,
    })
    process.nextTick(() => ms.clientSocket.emit('error', er))
  }

  return ms.clientSocket
}

/**
 * Get the Server associated with a port.
 *
 * @param {SocketConnectOpts|number} options Port to look up.
 * @returns {Server} The server that was found, or null if none found.
 */
export function getServer(options) {
  const opts = normalizeArgs(options)
  return /** @type {Server} */ (globalKernel.lookup(opts.port))
}

/**
 * @callback SocketCallback
 * @param {stream.Duplex} socket Server side of socket that was just connected.
 */

/**
 * A mock server socket, more-or-less like net.Server.
 */
export class Server extends EventEmitter {
  /**
   * Creates an instance of Server.
   *
   * @param {ServerOpts|SocketCallback} [options] Options for the server.
   * @param {SocketCallback} [connectionListener] Register this as the event
   *   listener for the 'listening' event, if provided.
   */
  constructor(options, connectionListener) {
    super()
    const opts = normalizeArgs(options, {connectionListener})

    this.clients = new Set()
    this.port = null
    this.listening = false
    this.closing = false

    if (opts.connectionListener) {
      this.on('connection', opts.connectionListener)
    }
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
    log(this.constructor.name, eventName, ...args.map(
      o => ((typeof o === 'object') ? o.constructor.name || o.toString() : o)
    ))
    return super.emit(eventName, ...args)
  }

  address() {
    return (this.port === null) ? null : `mock:${this.port}`
  }

  /**
   * @typedef {object} ListenOptions
   * @property {number} port The port to listen on.
   * @property {Function} listeningListener If it exists, installed as
   *   a listener for the 'listening' event.
   */

  /**
   * Listen for incoming connections.  Whenever `connect` is called on this
   * server's port, create a mock socket wrapped in a TLSSocket.
   *
   * @param {number|ListenOptions} [options] Port number or options object.
   * @param {Function} [listeningListener] If it exists, installed as
   *   a listener for the 'listening' event.
   * @returns {Server} This.
   */
  listen(options, listeningListener) {
    const opts = normalizeArgs(options, {listeningListener})

    if (this.listening) {
      const er = extendedError('Server already listening', {
        code: 'ERR_SERVER_ALREADY_LISTEN',
      })
      process.nextTick(() => this.emit('error', er))
      return this
    }

    try {
      this.port = globalKernel.open(opts.port, this)
    } catch (er) {
      process.nextTick(() => this.emit('error', er))
      return this
    }

    if (opts.listeningListener) {
      this.on('listening', opts.listeningListener)
    }

    this.listening = true
    process.nextTick(() => {
      this.emit('listening')
    })
    return this
  }

  /**
   * Add a client to this server.
   *
   * @param {MockSocket} ms The MockSocket to add.
   * @returns {Server} This.
   * @throws {Error} Server not listening.
   * @ignore
   */
  _addClient(ms) {
    if (!this.listening) {
      throw new Error('Server not listening')
    }

    this.clients.add(ms)
    ms.serverSocket.on('close', () => {
      this.clients.delete(ms)
      this._checkClosed()
    })
    this.emit('connection', ms.serverSocket)
    return this
  }

  /**
   * If all of the clients have closed, clean up and emit the 'close' event.
   */
  _checkClosed() {
    if (this.closing && (this.clients.size === 0)) {
      this.closing = false
      this.port = null
      process.nextTick(() => this.emit('close'))
    }
  }

  /**
   * @callback PlainCallback
   * @returns {void}
   */
  /**
   * Close down all of the clients, then the server.
   *
   * @param {PlainCallback} [cb] Registered as listener for the 'close' event.
   * @returns {Server} This.
   */
  close(cb) {
    if (cb) {
      this.on('close', cb)
    }
    this.listening = false
    this.closing = true
    for (const cli of this.clients) {
      cli.serverSocket.end()
    }
    this._checkClosed()
    return this
  }

  /**
   * @callback CountCallback
   * @param {Error} [err] If not null, an error occurred.
   * @param {number} [count] The number of connected clients.
   * @returns {void}
   */

  /**
   * Get the number of current clients.
   *
   * @param {CountCallback} cb Called with the current number of clients.
   * @returns {Server} This.
   * @throws {TypeError} Callback not a function.
   */
  getConnections(cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('Callback not a function')
    }
    process.nextTick(() => {
      if (this.listening) {
        cb(null, this.clients.size)
      } else {
        cb(new Error('Not listening'))
      }
    })
    return this
  }
}

/**
 * Creates an instance of Server.
 *
 * @param {ServerOpts|SocketCallback} [opts] Options for the server.
 * @param {SocketCallback} [connectionListener] Register this as the event
 *   listener for the 'listening' event, if provided.
 * @returns {Server} The created Server.
 */
export function createServer(opts, connectionListener) {
  return new Server(opts, connectionListener)
}

export default {
  connect,
  createServer,
  getServer,
  Server,
}
