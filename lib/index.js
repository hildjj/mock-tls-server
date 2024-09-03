import * as net from './net.js';
import {log, normalizeArgs, select} from './utils.js';
import {CertificateAuthority} from './ca.js';
import tls from 'node:tls';

/**
 * @typedef {(sock: tls.TLSSocket) => void} SecureConnectionCallback
 */

/**
 * @typedef {object} LocalOptions
 * @property {CertificateAuthority} [authority] A CA instance to use.  If you
 *   are creating lots of servers, create one CA to pass into each of them, so
 *   that certs don't need to be created from scratch for each.
 * @property {SecureConnectionCallback} [secureConnectionListener] Installed
 *   as a listener for the 'secureConnection' event.
 */

/**
* @typedef {LocalOptions &
*   tls.TLSSocketOptions &
*   import('./ca.js').CertOpts &
*   import('./net.js').ServerOpts
* } ServerOpts
*/

/**
 * @typedef {object} ListenOptions
 * @property {number} port The port to listen on.
 * @property {SecureConnectionCallback} [secureConnectionListener] If it exists,
 *   installed as a listener for the 'secureConnection' event.
 */

/**
 * A TLS server that mocks the network, but all of the crypto code is real.
 */
export class MockTLSServer extends net.Server {
  /** @type {string} */
  #key;

  /**
   * Create a MockTLSServer instance.
   *
   * @param {ServerOpts|SecureConnectionCallback} [options] Server options.
   * @param {SecureConnectionCallback} [secureConnectionListener] Installed as
   *   a listener for the 'secureConnection' event.
   */
  constructor(options, secureConnectionListener) {
    if (typeof options === 'function') {
      options = {secureConnectionListener: options};
    }
    const opts = normalizeArgs(options, {secureConnectionListener});
    const [local_opts, cert_opts, socket_opts, tls_opts] = select(
      opts,
      ['authority', 'secureConnectionListener'],
      ['notafter', 'notbefore', 'subject', 'names'],
      ['allowHalfOpen']
    );

    super(socket_opts, sock => {
      // Turn connection into TLS sock and call secureConnectionListener
      // @ts-ignore TS2345: Duplex should be allowed.
      const tsock = new tls.TLSSocket(sock, {
        isServer: true,
        cert: this.cert,
        key: this.#key,
        ...tls_opts,
      });
      const temit = tsock.emit;
      tsock.emit = (eventName, ...args) => {
        log('tls', eventName, ...args.map(
          o => ((typeof o === 'object') ? o.constructor.name || o.toString() : o)
        ));
        // @ts-ignore
        return temit.call(tsock, eventName, ...args);
      };
      tsock.on('secure', () => {
        process.nextTick(() => this.emit('secureConnection', tsock));
      });
    });

    if (opts.cert) {
      // User-supplied cert and key.  Don't spin up a CA instance.
      this.cert = tls_opts.cert;
      this.ca = tls_opts.ca;
      this.#key = tls_opts.key;
    } else {
      const authority = local_opts.authority || new CertificateAuthority();
      const serverProps = authority.issue(cert_opts);
      this.cert = serverProps.cert;
      this.ca = serverProps.ca;
      this.#key = serverProps.key;
    }

    if (local_opts.secureConnectionListener) {
      this.on('secureConnection', local_opts.secureConnectionListener);
    }
    // Create a real TLSSocket for each connection.
  }

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
    const {port, secureConnectionListener: onConnect} =
      normalizeArgs(options, {secureConnectionListener});

    if (onConnect) {
      this.on('secureConnection', onConnect);
    }
    super.listen(port);
    return this;
  }
}

/**
 * Create a client connection to a listening server.
 *
 * @param {tls.ConnectionOptions|number} options Port to connect to.
 * @param {() => void} [secureListener] If specified, function is
 *   registered for the 'secure' event.
 * @returns {tls.TLSSocket} Socket.
 */
export function connect(options, secureListener) {
  const {port, secureListener: listener, ...opts} =
    normalizeArgs(options, {secureListener});

  if (typeof port !== 'number') {
    throw new TypeError('Invalid type for port');
  }

  opts.socket = net.connect(port); // Emits error if connection failed
  if (!opts.ca) {
    const srv = net.getServer(port);
    if (srv && (srv instanceof MockTLSServer)) {
      opts.ca = srv.ca;
    }
  }

  const secureSocket = tls.connect(opts);

  // Force-close on error.
  secureSocket.on('error', () => opts.socket?.emit('close'));
  if (listener) {
    secureSocket.on('secure', listener);
  }
  return secureSocket;
}

export const plainConnect = net.connect;
export default {
  MockTLSServer,
  connect,
  plainConnect,
};
