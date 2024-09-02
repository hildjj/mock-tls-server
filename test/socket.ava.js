import {HalfSocket, MockSocket} from '../lib/socket.js';
import {Buffer} from 'node:buffer';
import {inspect} from 'node:util';
import {pEvent} from 'p-event';
import test from 'ava';

test('HalfSocket', async t => {
  const hs = new HalfSocket('foo');
  t.is(hs.name, 'foo');
  process.nextTick(() => hs.write('bar'));
  const written = await pEvent(hs, 'written');
  t.deepEqual(written, Buffer.from('bar'));
});

test('MockSocket', async t => {
  const ms = new MockSocket();
  t.truthy(ms);

  // Write on client comes out as data on server
  process.nextTick(() => ms.clientSocket.write('bar'));
  const s_recv = await pEvent(ms.serverSocket, 'data');
  t.deepEqual(s_recv, Buffer.from('bar'));

  // Write on server comes out as data on client
  process.nextTick(() => ms.serverSocket.write('baz'));
  const c_recv = await pEvent(ms.clientSocket, 'data');
  t.deepEqual(c_recv, Buffer.from('baz'));

  process.nextTick(() => ms.clientSocket.end());
  // Since allowHalfOpen is false.
  // cli.end => srv.'end' => srv.end => cli.'finish' => cli.'close'
  const c_close = await pEvent(ms.clientSocket, 'close');
  t.is(c_close, undefined);
});

test('inspect', t => {
  const hs = new HalfSocket('foo');
  t.is(inspect(hs), '[HalfSocket "foo"]');
});
