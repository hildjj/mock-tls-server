import {HalfSocket, MockSocket} from '../lib/socket.js'
import test from 'ava'

test('HalfSocket', t => {
  const hs = new HalfSocket('foo')
  t.is(hs.name, 'foo')
})
