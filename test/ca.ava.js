import {CertificateAuthority} from '../lib/ca.js';
import crypto from 'node:crypto';
import test from 'ava';

test('ca', t => {
  const ca = new CertificateAuthority();
  t.truthy(ca.cert_pem);
  const srv = ca.issue();
  t.truthy(srv.ca);
  t.truthy(srv.cert);
  t.truthy(srv.key);

  t.throws(() => ca.issue({names: []}));

  if (crypto.X509Certificate) {
    const x_ca = new crypto.X509Certificate(srv.ca);
    t.true(x_ca.ca);
    t.true(x_ca.checkIssued(x_ca)); // Self-signed

    const x_srv = new crypto.X509Certificate(srv.cert);
    t.false(x_srv.ca);
    t.is(x_srv.checkHost('localhost'), 'localhost');
    t.is(x_srv.checkHost('bad.invalud'), undefined);
    t.true(x_srv.checkIssued(x_ca));

    const k = crypto.createPrivateKey(srv.key);
    t.true(x_srv.checkPrivateKey(k));
  } else {
    // eslint-disable-next-line no-console
    console.error('skipping X509Certificate tests');
  }
});

