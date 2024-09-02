import rs from 'jsrsasign';

const MINS_5 = 5 * 60 * 1000;
const SECS_1 = 1000;

/**
 * @typedef {object} CertOpts
 * @property {Date} [notafter='Now + 5m'] Certificate not valid after this
 *   date.
 * @property {Date} [notbefore='Now - 1s'] Certificate not valid before this
 *   date.
 * @property {string} [subject] Subject Distinguished Name (DN).
 * @property {string[]} [names=['localhost']] DNS Subject Alternative Names
 *   for the cert.  Ignored for the CA cert.
 */

/**
 * @typedef {object} ServerProperties
 * @property {string} cert PEM-encoded server certificate.
 * @property {string} key PEM-encoded server private key.
 * @property {string} ca PEM-encoded CA certificate.
 */

/**
 * Very rudimentary Certificate Authority (CA).
 * Warning: DO NOT use this on the Internet.  It is only for testing purposes.
 */
export class CertificateAuthority {
  /** Private key */
  #key;

  /**
   * Creates an instance of CertificateAuthority.
   *
   * @param {CertOpts} [options={}] CA cert options.
   */
  constructor(options = {}) {
    const now = new Date().getTime();

    /** @type {Required<CertOpts>} */
    const opts = {
      notafter: new Date(now + MINS_5),
      notbefore: new Date(now - SECS_1),
      subject: 'C=US/ST=Colorado/L=Denver/CN=Example-Root-CA',
      names: ['localhost'],
      ...options,
    };

    this.subject = opts.subject;

    // Create a self-signed CA cert
    const ca_kp = rs.KEYUTIL.generateKeypair('RSA', 2048);
    this.#key = ca_kp.prvKeyObj;
    const pub = ca_kp.pubKeyObj;

    const ca_cert = new rs.KJUR.asn1.x509.Certificate({
      version: 3,
      serial: {int: now},
      issuer: {str: opts.subject},
      notbefore: rs.datetozulu(opts.notbefore, false, false),
      notafter: rs.datetozulu(opts.notafter, false, false),
      subject: {str: opts.subject},
      sbjpubkey: pub,
      ext: [
        {extname: 'basicConstraints', cA: true},
      ],
      sigalg: 'SHA256withRSA',
      cakey: this.#key,
    });

    /** @type {string} */
    this.cert_pem = ca_cert.getPEM();
  }

  /**
   * Creates and signs a server certificate.
   *
   * @param {CertOpts} [options={}] Server cert options.
   * @returns {ServerProperties} Information about the created certificate.
   * @throws {Error} No subject or names.
   */
  issue(options) {
    const now = new Date().getTime();

    /** @type {Required<CertOpts>} */
    const opts = {
      notafter: new Date(now + MINS_5),
      notbefore: new Date(now - SECS_1),
      subject: '',
      names: ['localhost'],
      ...options,
    };

    if (!opts.subject) {
      if (!opts.names?.length) {
        throw new Error('Must include subject or at least one name in opts');
      }
      opts.subject = `C=US/ST=Colorado/L=Denver/CN=${opts.names[0]}`;
    }

    const srv_kp = rs.KEYUTIL.generateKeypair('RSA', 2048);
    const srv_prv = srv_kp.prvKeyObj;
    const srv_pub = srv_kp.pubKeyObj;

    const srv = new rs.KJUR.asn1.x509.Certificate({
      version: 3,
      serial: {int: 2},
      issuer: {str: this.subject},
      notbefore: rs.datetozulu(opts.notbefore, false, false),
      notafter: rs.datetozulu(opts.notafter, false, false),
      subject: {str: opts.subject},
      sbjpubkey: srv_pub,
      ext: [
        {extname: 'authorityKeyIdentifier', kid: this.cert_pem},
        {extname: 'basicConstraints', cA: false},
        {
          extname: 'keyUsage',
          names: [
            'digitalSignature',
            'nonRepudiation',
            'keyEncipherment',
            'dataEncipherment',
          ],
        },
        {
          extname: 'subjectAltName',
          array: opts.names.map(n => ({dns: n})),
        },
      ],
      sigalg: 'SHA256withRSA',
      cakey: this.#key,
    });

    return {
      cert: srv.getPEM(),
      key: rs.KEYUTIL.getPEM(srv_prv, 'PKCS1PRV'),
      ca: this.cert_pem,
    };
  }
}
