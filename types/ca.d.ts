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
    /**
     * Creates an instance of CertificateAuthority.
     *
     * @param {CertOpts} [opts={}] CA cert options.
     */
    constructor(opts?: CertOpts);
    subject: string;
    /** @type {string} */
    cert_pem: string;
    /**
     * Creates and signs a server certificate.
     *
     * @param {CertOpts} [opts={}] Server cert options.
     * @returns {ServerProperties} Information about the created certificate.
     * @throws {Error} No subject or names.
     */
    issue(opts?: CertOpts): ServerProperties;
}
export type CertOpts = {
    /**
     * Certificate not valid after this
     * date.
     */
    notafter?: Date;
    /**
     * Certificate not valid before this
     * date.
     */
    notbefore?: Date;
    /**
     * Subject Distinguished Name (DN).
     */
    subject?: string;
    /**
     * DNS Subject Alternative Names
     * for the cert.  Ignored for the CA cert.
     */
    names?: string[];
};
export type ServerProperties = {
    /**
     * PEM-encoded server certificate.
     */
    cert: string;
    /**
     * PEM-encoded server private key.
     */
    key: string;
    /**
     * PEM-encoded CA certificate.
     */
    ca: string;
};
