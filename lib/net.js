import {EventEmitter} from 'events'
import {MockSocket} from './socket.js'
import stream from 'stream'

// The kernel
const ports = {}
let next_port = 1024

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

function extendedError(message, opts) {
  const er = new Error(message)
  Object.assign(er, opts)
  return er
}

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
  let opts = null
  switch (typeof options) {
    case 'object':
      opts = options || {}
      break
    case 'number':
      opts = {port: options}
      break
    default:
      throw new TypeError('Invalid type for options')
  }
  const {port, ...rest} = opts
  if (typeof port !== 'number') {
    throw new TypeError('Invalid type for port')
  }
  const ms = new MockSocket(rest)
  const srv = ports[port]

  if (srv) {
    srv._addClient(ms)
    if (connectListener) {
      ms.clientSocket.on('connect', connectListener)
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
   * @param {ServerOpts|SocketCallback} [opts] Options for the server.
   * @param {SocketCallback} [connectionListener] Register this as the event
   *   listener for the 'listening' event, if provided.
   */
  constructor(opts, connectionListener) {
    super()
    if (typeof opts === 'function') {
      connectionListener = opts
      this.opts = {}
    } else {
      this.opts = opts || {}
    }

    this.clients = []
    this.port = null
    this.listening = false
    this.closing = false

    if (connectionListener) {
      this.on('connection', connectionListener)
    }
  }

  address() {
    return (this.port === null) ? null : `mock:${this.port}`
  }

  listen(port, cb) {
    switch (typeof port) {
      case 'function':
        cb = port
        port = 0
        break
      case 'object':
        port = port ? port.port : 0
        break
      case 'number':
        break
      default:
        throw new TypeError('Invalid type for port')
    }

    if (this.listening) {
      const er = extendedError('Server already listening', {
        code: 'ERR_SERVER_ALREADY_LISTEN',
      })
      process.nextTick(() => this.emit('error', er))
      return this
    }

    if (ports[port]) {
      const er = extendedError('Address already in use', {
        code: 'EADDRINUSE',
      })
      process.nextTick(() => this.emit('error', er))
      return this
    }

    while (!port) {
      // Find the next open port
      port = next_port++
      if (ports[port]) {
        port = 0
      }
    }
    this.port = port
    ports[port] = this

    if (cb) {
      this.on('listening', cb)
    }
    this.on('close', () => delete ports[port])

    this.listening = true
    process.nextTick(() => {
      this.emit('listening')
    })
    return this
  }

  _addClient(ms) {
    if (!this.listening) {
      throw new Error('Server not listening')
    }

    this.clients.push(ms)
    ms.serverSocket.on('close', () => {
      this.clients.splice(this.clients.indexOf(ms), 1)
      this._checkClosed()
    })
    this.emit('connection', ms.serverSocket)
    return this
  }

  _checkClosed() {
    if (this.closing && (this.clients.length === 0)) {
      this.closing = false
      this.port = null
      process.nextTick(() => this.emit('close'))
    }
  }

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

  getConnections(cb) {
    if (typeof cb !== 'function') {
      throw new TypeError('Callback not a function')
    }
    process.nextTick(() => {
      if (this.listening) {
        cb(null, this.clients.length)
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
  Server,
}
