import {MockTLSServer, connect} from '../lib/index.js'

// Expected output: "Welcome!\nexample\n"

const server = new MockTLSServer()
server.listen(4000, sock => {
  sock.write('Welcome!\n')
  sock.pipe(sock)
})

const cli = connect(4000, () => {
  // Send a string, and end the write side of the socket
  // allowHalfOpen is false on both sides by default, so the
  // server will close it's write side in resonse, leading the
  // client to go to the 'closed' state.
  cli.end('example\n')
})
  .on('data', chunk => process.stdout.write(chunk.toString()))
  .on('close', () => server.close())
