import {log, normalizeArgs, select} from './utils.js'
import {CertificateAuthority} from './ca.js'
import net from './net.js'
import tls from 'tls'

const PRIVATE = new WeakMap()

/**
 * @callback SecureConnectionCallback
 * @param {tls.TLSSocket} sock The server side of the socket that was connected.
 * @returns {void}
 */

/**
 * @typedef {object} ServerOpts
 * @property {CertificateAuthority} [ca] A CA instance to use.  If you are
 *   creating lots of servers, create one CA to pass into each of them, so
 *   that certs don't need to be created from scratch for each.
 * @property {SecureConnectionCallback} [secureConnectionListener] Installed
 *   as a listener for the 'secureConnection' event.
 * @property {Date} [notafter='Now + 5m'] Certificate not valid after this
 *   date.
 * @property {Date} [notbefore='Now - 1s'] Certificate not valid before this
 *   date.
 * @property {string} [subject] Subject Distinguished Name (DN).
 * @property {string[]} [names=['localhost']] DNS Subject Alternative Names
 *   for the cert.  Ignored for the CA cert.
 * @property {boolean} [allowHalfOpen=false] If set to false, then the
 *   socket will automatically end the writable side when the readable side
 *   ends.
 */

/**
 * A TLS server that mocks the network, but all of the crypto code is real.
 */
export class MockTLSServer extends net.Server {
  /**
   * Create a MockTLSServer instance.
   *
   * @param {ServerOpts|SecureConnectionCallback} [options] Server options.
   * @param {SecureConnectionCallback} [secureConnectionListener] Installed as
   *   a listener for the 'secureConnection' event.
   */
  constructor(options, secureConnectionListener) {
    const opts = normalizeArgs(options, {secureConnectionListener})
    const [local_opts, cert_opts, socket_opts] = select(
      opts,
      ['ca', 'secureConnectionListener'],
      ['notafter', 'notbefore', 'subject', 'names']
    )

    super(socket_opts, sock => {
      // Turn connection into TLS sock and call secureConnectionListener
      // @ts-ignore TS2345: Duplex should be allowed.
      const tsock = new tls.TLSSocket(sock, {
        isServer: true,
        requestCert: false,
        cert: this.cert,
        key: PRIVATE.get(this),
      })
      const temit = tsock.emit
      tsock.emit = (eventName, ...args) => {
        log('tls', eventName, ...args.map(
          o => ((typeof o === 'object') ? o.constructor.name || o.toString() : o)
        ))
        return temit.call(tsock, eventName, ...args)
      }
      tsock.on('secure', () => {
        process.nextTick(() => this.emit('secureConnection', tsock))
      })
    })

    /** @type {CertificateAuthority} */
    this.ca = local_opts.ca || new CertificateAuthority()
    const serverProps = this.ca.issue(cert_opts)

    /** @type {string} */
    this.cert = serverProps.cert
    PRIVATE.set(this, serverProps.key)

    if (local_opts.secureConnectionListener) {
      this.on('secureConnection', local_opts.secureConnectionListener)
    }
    // Create a real TLSSocket for each connection.
  }

  /**
   * @typedef {object} ListenOptions
   * @property {number} port The port to listen on.
   * @property {Function} secureConnectionListener If it exists, installed as
   *   a listener for the 'secureConnection' event.
   */

  /**
   * Listen for incoming connections.  Whenever `connect` is called on this
   * server's port, create a mock socket wrapped in a TLSSocket.
   *
   * @param {number|ListenOptions} [options] Port number or options object.
   * @param {Function} [secureConnectionListener] If it exists, installed as
   *   a listener for the 'secureConnection' event.
   * @returns {MockTLSServer} This.
   */
  // @ts-ignore TS2416: This is compatible-enough with the base class.
  listen(options, secureConnectionListener) {
    const opts = normalizeArgs(options, {secureConnectionListener})

    if (opts.secureConnectionListener) {
      this.on('secureConnection', opts.secureConnectionListener)
    }
    super.listen(opts.port)
    return this
  }
}

/**
 * @typedef {object} SocketConnectOpts
 * @property {number} port Listening server port to connect to.
 * @property {boolean} [allowHalfOpen=false] If set to false, then the
 *   socket will automatically end the writable side when the readable side
 *   ends.
 */

/**
 * Create a client connection to a listening server.
 *
 * @param {SocketConnectOpts|number} options Port to connect to.
 * @param {Function} [secureConnectListener] If specified, function is
 *   registered for the 'secureConnect'.
 * @returns {tls.TLSSocket} Socket.
 */
export function connect(options, secureConnectListener) {
  const {port, secureConnectListener: scl, ...opts} =
    normalizeArgs(options, {secureConnectListener})

  opts.socket = net.connect(port) // Emits error if connection failed
  const srv = net.getServer(port)
  if (srv && (srv instanceof MockTLSServer)) {
    opts.ca = srv.ca.cert_pem
  }

  const secureSocket = tls.connect(opts)
  if (scl) {
    secureSocket.on('secure', scl)
  }
  return secureSocket
}

export const plainConnect = net.connect
export default {
  MockTLSServer,
  connect,
  plainConnect,
}
