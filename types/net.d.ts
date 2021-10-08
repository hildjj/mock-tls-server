/// <reference types="node" />
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
     * @param {ServerOpts|SocketCallback} [opts] Options for the server.
     * @param {SocketCallback} [connectionListener] Register this as the event
     *   listener for the 'listening' event, if provided.
     */
    constructor(opts?: ServerOpts | SocketCallback, connectionListener?: SocketCallback);
    opts: ServerOpts;
    clients: any[];
    port: any;
    listening: boolean;
    closing: boolean;
    address(): string;
    listen(port: any, cb: any): Server;
    _addClient(ms: any): Server;
    _checkClosed(): void;
    close(cb: any): Server;
    getConnections(cb: any): Server;
}
declare namespace _default {
    export { connect };
    export { createServer };
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
