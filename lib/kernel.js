// eslint-disable-next-line no-unused-vars
import {EventEmitter} from 'events'
import {extendedError} from './utils.js'

const FIRST_PORT = 1024

/**
 * Simulate the bit of the OS kernel that uses port numbers to make endpoints.
 */
export class Kernel {
  /**
   * Creates an instance of Kernel.
   */
  constructor() {
    /** @type {Object.<number, EventEmitter>} */
    this.ports = {}

    /** @type {any} */
    this.timer = null
    this.count = 0
  }

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
  open(port, server) {
    if (!port) {
      // Find the next open port
      port = FIRST_PORT
      while (this.ports[port]) {
        port++
      }
    } else if (this.ports[port]) {
      throw extendedError('Address already in use', {
        code: 'EADDRINUSE',
      })
    }
    this.ports[port] = server
    this.count++
    if (!this.timer) {
      // Keep the process alive while we've got servers listening
      this.timer = setInterval(() => {
        /* c8 ignore next */
      }, 0x7fffffff)
    }
    server.on('close', () => {
      delete this.ports[port]
      this.count--
      if (this.count <= 0) {
        clearInterval(this.timer)
        this.timer = null
      }
    })
    return port
  }

  /**
   * Find the server instance for the given port.
   *
   * @param {number} port The port number.
   * @returns {EventEmitter} The server, or null if not found.
   */
  lookup(port) {
    return this.ports[port]
  }
}

export const globalKernel = new Kernel()
