import {Duplex} from 'stream'

// A mock socket is two duplex HalfSockets, each of which is connected to the
// other with a crossover cable.
const WRITTEN_EVENT = 'written'

export class HalfSocket extends Duplex {
  constructor(name, opts) {
    super(opts)
    this.name = name
  }

  _write(chunk, encoding, cb) {
    // De-couple the halves
    this.emit(WRITTEN_EVENT, chunk, encoding)
    cb()
  }

  // eslint-disable-next-line class-methods-use-this, no-empty-function
  _read(sz) {
  }
}

export class MockSocket extends Duplex {
  constructor(opts) {
    super(opts)
    this.clientSocket = new HalfSocket('cli')
    this.serverSocket = new HalfSocket('srv')

    this.clientSocket.on(WRITTEN_EVENT, (chunk, encoding) => {
      this.serverSocket.push(chunk)
    })
    this.serverSocket.on(WRITTEN_EVENT, (chunk, encoding) => {
      this.clientSocket.push(chunk)
    })
  }
}
