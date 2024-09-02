import {MockTLSServer, plainConnect} from '../lib/index.js';
import tls from 'node:tls';

// Expected output: "Welcome!\nplain example\n"

const server = new MockTLSServer();
server.listen(4000, sock => {
  sock.write('Welcome!\n');
  sock.pipe(sock);
});

const clientSock = plainConnect({
  port: 4000,
});
const client = tls.connect({
  socket: clientSock,
  ca: server.ca.cert_pem,
  host: 'foo',
  checkServerIdentity(_servername, cert) {
    console.log(cert);
  },
}, () => {
  client.end('plain example\n');
})
  .on('data', chunk => process.stdout.write(chunk.toString()))
  .on('close', () => server.close())
  .on('error', er => {
    console.error(er);
  });
