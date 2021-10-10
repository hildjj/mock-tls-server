/// <reference types="node" />
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
export function connect(options: number | SocketConnectOpts, connectListener?: SocketCallback): stream.Duplex;
/**
 * Get the Server associated with a port.
 *
 * @param {SocketConnectOpts|number} options Port to look up.
 * @returns {Server} The server that was found, or null if none found.
 */
export function getServer(options: SocketConnectOpts | number): Server;
/**
 * Creates an instance of Server.
 *
 * @param {ServerOpts|SocketCallback} [opts] Options for the server.
 * @param {SocketCallback} [connectionListener] Register this as the event
 *   listener for the 'listening' event, if provided.
 * @returns {Server} The created Server.
 */
export function createServer(opts?: ServerOpts | SocketCallback, connectionListener?: SocketCallback): Server;
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
    constructor(options?: ServerOpts | SocketCallback, connectionListener?: SocketCallback);
    clients: Set<any>;
    port: number;
    listening: boolean;
    closing: boolean;
    address(): string;
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
    listen(options?: number | {
        /**
         * The port to listen on.
         */
        port: number;
        /**
         * If it exists, installed as
         * a listener for the 'listening' event.
         */
        listeningListener: Function;
    }, listeningListener?: Function): Server;
    /**
     * Add a client to this server.
     *
     * @param {MockSocket} ms The MockSocket to add.
     * @returns {Server} This.
     * @throws {Error} Server not listening.
     * @ignore
     */
    _addClient(ms: MockSocket): Server;
    /**
     * If all of the clients have closed, clean up and emit the 'close' event.
     */
    _checkClosed(): void;
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
    close(cb?: () => void): Server;
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
    getConnections(cb: (err?: Error, count?: number) => void): Server;
}
declare namespace _default {
    export { connect };
    export { createServer };
    export { getServer };
    export { Server };
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
export type ServerOpts = {
    /**
     * If set to false, then the
     * socket will automatically end the writable side when the readable side
     * ends.
     */
    allowHalfOpen?: boolean;
};
export type SocketCallback = (socket: stream.Duplex) => any;
import stream from "stream";
import { EventEmitter } from "events";
import { MockSocket } from "./socket.js";
