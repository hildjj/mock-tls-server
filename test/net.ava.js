import {Buffer} from 'buffer'
import net from '../lib/net.js'
import {pEvent} from 'p-event'
import {promisify} from 'util'
import test from 'ava'

async function emitsError(t, fun, code) {
  const o = fun()
  const err = await pEvent(o, 'error')
  t.true(err instanceof Error)
  if (code) {
    t.is(err.code, code)
  }
}

test('echo server', async t => {
  const srv = net.createServer(s => {
    s.write('Echo\n')
    s.pipe(s) // Includes end()
  })

  t.throws(() => srv.listen(Symbol('bad')))
  srv.listen(8000)
  await pEvent(srv, 'listening')
  t.is(srv.port, 8000)
  t.is(srv.address(), 'mock:8000')

  await emitsError(t, () => srv.listen(null), 'ERR_SERVER_ALREADY_LISTEN')

  const srv2 = net.createServer(null, s => s.end())
  await emitsError(t, () => srv2.listen(8000), 'EADDRINUSE')

  t.is(net.getServer(8000), srv)

  const cli = net.connect(8000, () => {
    cli.end('foo')
  })
  const bufs = []
  cli.on('data', chunk => bufs.push(chunk))
  await pEvent(cli, 'close')
  t.is(Buffer.concat(bufs).toString(), 'Echo\nfoo')
  t.is(srv.clients.size, 0)
  srv.close() // All clients already closed
  await pEvent(srv, 'close')
  t.is(srv.port, null)
  t.is(srv.address(), null)
})

test('bad inputs', async t => {
  t.throws(() => net.connect(Symbol('bad')))
  t.throws(() => net.connect(null))
  await emitsError(t, () => net.connect({port: 1}), 'ECONNREFUSED')
})

test('unused port', async t => {
  const srv = net.createServer()
  srv.listen({port: 1024})
  await pEvent(srv, 'listening')

  const srv2 = net.createServer()
  let listened = false
  srv2.listen(() => (listened = true))
  await pEvent(srv2, 'listening')
  t.is(srv2.port, 1025)
  t.true(listened)
  srv2.close()

  let closed = false
  srv.close(() => (closed = true))
  await pEvent(srv, 'close')
  t.true(closed)
})

test('close with active clients', async t => {
  const srv = net.createServer(s => {
    s.write('wait')
    s.on('data', () => ({})) // Drain data so 'finish' fires
  })
  srv.listen(8001)
  await pEvent(srv, 'listening')
  const cli = net.connect(8001)

  let cliClosed = false
  cli.on('data', () => ({})) // Drain data so 'finish' fires
  cli.on('close', () => (cliClosed = true))
  await pEvent(cli, 'connect')
  t.false(cliClosed)

  srv.close()
  await pEvent(srv, 'close')
  t.true(cliClosed)
})

test('not listening', t => {
  const srv = net.createServer(s => s.on('data', () => ({})))
  t.throws(() => srv._addClient())
})

test('getConnections', async t => {
  const srv = net.createServer()
  t.throws(() => srv.getConnections())
  const gc = promisify(srv.getConnections)
  await t.throwsAsync(() => gc.call(srv))

  srv.listen(8002)
  await pEvent(srv, 'listening')
  t.is(await gc.call(srv), 0)
  srv.close()
})

