/// <reference types="node" />
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
    constructor(name: string, opts: stream.DuplexOptions);
    name: string;
    [util.inspect.custom](): string;
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
    constructor(opts: stream.DuplexOptions);
    clientSocket: HalfSocket;
    serverSocket: HalfSocket;
}
import stream from "stream";
import util from "util";
