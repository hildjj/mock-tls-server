import {MockTLSServer, connect} from '../lib/index.js';
import {Buffer} from 'node:buffer';
import {CertificateAuthority} from '../lib/ca.js';
import {pEvent} from 'p-event';
import test from 'ava';

test('PPP echo server', async t => {
  const s = new MockTLSServer();
  t.truthy(s);
  s.listen(sock => {
    sock.write('Hi\n');
    sock.pipe(sock);
  });
  await pEvent(s, 'listening');
  const cli = connect(s.port);
  const bufs = [];
  cli.on('data', chunk => {
    bufs.push(chunk);
  });
  await pEvent(cli, 'secureConnect');
  cli.end('foo');
  await pEvent(cli, 'close');
  t.is(Buffer.concat(bufs).toString(), 'Hi\nfoo');
  s.close();
});

test('echo server2', async t => {
  let gotSecureConnect = false;
  const s = new MockTLSServer({
    secureConnectionListener(sock) {
      gotSecureConnect = true;
      sock.write('Hi\n');
      sock.pipe(sock);
    },
  });
  t.truthy(s);
  s.listen();
  await pEvent(s, 'listening');
  let gotConnect = false;
  const cli = connect(s.port, () => (gotConnect = true));
  const bufs = [];
  cli.on('data', chunk => bufs.push(chunk));
  await pEvent(cli, 'secure');
  t.true(gotConnect);
  cli.end('foo');
  await pEvent(cli, 'close');
  t.true(gotSecureConnect);
  t.is(Buffer.concat(bufs).toString(), 'Hi\nfoo');
  s.close();
});

test('explicit cert and ca', async t => {
  const ca = new CertificateAuthority();
  const serverProps = ca.issue();
  const s = new MockTLSServer({
    ...serverProps,
  });
  s.listen();
  await pEvent(s, 'listening');
  // Extra steps to ensure node 18 doesn't deadlock.
  let res = null;
  const connected = new Promise(resolve => {
    res = resolve;
  });
  const cli = connect(s.port, res);
  await connected;
  const close = pEvent(cli, 'close');
  cli.end();
  await close;
  s.close();
  t.pass();
});
