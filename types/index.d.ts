/// <reference types="node" />
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
export function connect(options: SocketConnectOpts | number, secureConnectListener?: Function): tls.TLSSocket;
declare const MockTLSServer_base: typeof import("./net.js").Server;
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
export class MockTLSServer extends MockTLSServer_base {
    /**
     * Create a MockTLSServer instance.
     *
     * @param {ServerOpts|SecureConnectionCallback} [options] Server options.
     * @param {SecureConnectionCallback} [secureConnectionListener] Installed as
     *   a listener for the 'secureConnection' event.
     */
    constructor(options?: ServerOpts | SecureConnectionCallback, secureConnectionListener?: SecureConnectionCallback);
    /** @type {CertificateAuthority} */
    ca: CertificateAuthority;
    /** @type {string} */
    cert: string;
}
export const plainConnect: typeof import("./net.js").connect;
declare namespace _default {
    export { MockTLSServer };
    export { connect };
    export { plainConnect };
}
export default _default;
export type SocketConnectOpts = {
    /**
     * Listening server port to connect to.
     */
    port: number;
    /**
     * If set to false, then the
     * socket will automatically end the writable side when the readable side
     * ends.
     */
    allowHalfOpen?: boolean;
};
export type SecureConnectionCallback = (sock: tls.TLSSocket) => void;
export type ServerOpts = {
    /**
     * A CA instance to use.  If you are
     * creating lots of servers, create one CA to pass into each of them, so
     * that certs don't need to be created from scratch for each.
     */
    ca?: CertificateAuthority;
    /**
     * Installed
     * as a listener for the 'secureConnection' event.
     */
    secureConnectionListener?: SecureConnectionCallback;
    /**
     * Certificate not valid after this
     * date.
     */
    notafter?: Date;
    /**
     * Certificate not valid before this
     * date.
     */
    notbefore?: Date;
    /**
     * Subject Distinguished Name (DN).
     */
    subject?: string;
    /**
     * DNS Subject Alternative Names
     * for the cert.  Ignored for the CA cert.
     */
    names?: string[];
    /**
     * If set to false, then the
     * socket will automatically end the writable side when the readable side
     * ends.
     */
    allowHalfOpen?: boolean;
};
import tls from "tls";
import { CertificateAuthority } from "./ca.js";
