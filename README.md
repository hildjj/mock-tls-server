# mock-tls-server

Mock up a plain or TLS-encrypted TCP connection without using any actual
network facilities or needing any permissions.  This is useful for testing,
particularly playing around with different TLS failure modes.

**WARNING**: this package is intended to only be used for testing.  It should not
be used in any sort of production or Internet-connected setting.  In
particular, the included Certificate Authority should NEVER be trusted further
than individual tests.

## Installation

```bash
$ npm install --save-dev mock-tls-server
```

## API Documentation

The intent is that the API is similar to that found in Node's
[net](https://nodejs.org/api/net.html) and
[tls](https://nodejs.org/api/tls.html) packages. See full docs
[here](http://hildjj.github.io/mock-tls-server/).

## Example:

```js
import {MockTLSServer, connect} from 'mock-tls-server'

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
```

## Always close the server

The server, like a TCP server, will keep the node process from shutting down
while it is listening.  Make sure to call `close()` when you are done with it.

If this turns out to be a problem for folks, I'll change it -- please file an
issue with ideas.

## Use in tests

I use [p-event](https://github.com/sindresorhus/p-event#readme) to wait for
individual events in async functions:

```js
import pEvent from 'p-event'

await pEvent(client, 'secureConnection')
```

You can call `plainConnect` to get a client socket that hasn't been connected
with TLS yet, then pass that socket to existing code as a part of its
parameters for
[`tls.connect`](https://nodejs.org/api/tls.html#tls_tls_connect_options_callback).

```js
import {plainConnect, MockTLSServer} from 'mock-tls-server'
import tls from 'tls'

const server = new MockTLSServer({
  notBefore: new Date(new Date().getTime() + 10000) // Invalid because of time
})
server.listen()
await pEvent(server, 'listening')
const socket = plainConnect(server.port)
tls.connect({
  socket,
  host: 'localhost', // Alter this to test name mismatches
  ca: server.ca., // Alter this to test signing failures
})
```

See the tests in this package for more ideas.

## Logging

While you're testing, you'll wonder if anything is actually happening.  All of
the events that are flowing through the system can be logged by using the
NODE_DEBUG environment variable and including `mock-tls-server`:

```bash
NODE_DEBUG=mock-tls-server node examples/echo.js
```

[![Tests](https://github.com/hildjj/mock-tls-server/actions/workflows/node.js.yml/badge.svg)](https://github.com/hildjj/mock-tls-server/actions/workflows/node.js.yml)
[![codecov](https://codecov.io/gh/hildjj/mock-tls-server/branch/main/graph/badge.svg?token=86PXRWEHKH)](https://codecov.io/gh/hildjj/mock-tls-server)
