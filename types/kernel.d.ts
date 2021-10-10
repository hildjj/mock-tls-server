/**
 * Simulate the bit of the OS kernel that uses port numbers to make endpoints.
 */
export class Kernel {
    /** @type {Object.<number, EventEmitter>} */
    ports: {
        [x: number]: EventEmitter;
    };
    /** @type {any} */
    timer: any;
    count: number;
    /**
     * Store the Server associated with a given port number in the kernel.
     *
     * @param {number} port The port number.  If null or 0, find the next unused
     *   port number starting with 1024.
     * @param {EventEmitter} server The server to store.  Must support the
     *   'close' event.
     * @returns {number} The selected port.
     * @throws {Error} Address already in use for the given port.
     */
    open(port: number, server: EventEmitter): number;
    /**
     * Find the server instance for the given port.
     *
     * @param {number} port The port number.
     * @returns {EventEmitter} The server, or null if not found.
     */
    lookup(port: number): EventEmitter;
}
export const globalKernel: Kernel;
import { EventEmitter } from "events";
