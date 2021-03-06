/// <reference types="node" />
/**
 * All of the options that can be passed in to connect(), with text copied
 * from the Node docs.
 *
 * @typedef {object} SocketConnectOpts
 * @property {number} port Listening server port to connect to.
 * @property {boolean} [allowHalfOpen=false] If set to false, then the socket
 *   will automatically end the writable side when the readable side ends.
 * @property {boolean} [rejectUnauthorized=true] If not false, the server
 *   certificate is verified against the list of supplied CAs. An 'error'
 *   event is emitted if verification fails; err.code contains the OpenSSL
 *   error code.
 * @property {PSKCallback} [pskCallback] When negotiating TLS-PSK (pre-shared
 *   keys), this function is called with optional identity hint provided by
 *   the server or null in case of TLS 1.3 where hint was removed. It will be
 *   necessary to provide a custom tls.checkServerIdentity() for the
 *   connection as the default one will try to check host name/IP of the
 *   server against the certificate but that's not applicable for PSK because
 *   there won't be a certificate present. More information can be found in
 *   the RFC 4279.
 * @property {string[]|Buffer[]|DataView[]|Buffer|DataView} [ALPNProtocols] An
 *   array of strings, Buffers or DataViews, or a single Buffer or DataView
 *   containing the supported ALPN protocols. Buffers should have the format
 *   [len][name][len][name]... E.g. '\x08http/1.1\x08http/1.0', where the len
 *   byte is the length of the next protocol name. Passing an array is usually
 *   much simpler, e.g. ['http/1.1', 'http/1.0']. Protocols earlier in the
 *   list have higher preference than those later.
 * @property {string} [servername] Server name for the SNI (Server Name
 *   Indication) TLS extension. It is the name of the host being connected to,
 *   and must be a host name, and not an IP address. It can be used by a
 *   multi-homed server to choose the correct certificate to present to the
 *   client, see the SNICallback option to tls.createServer().
 * @property {tls.checkServerIdentity} [checkServerIdentity] A callback
 *   function to be used (instead of the builtin tls.checkServerIdentity()
 *   function) when checking the server's host name (or the provided
 *   servername when explicitly set) against the certificate. This should
 *   return an <Error> if verification fails. The method should return
 *   undefined if the servername and cert are verified.
 * @property {Buffer} [session] A Buffer instance, containing TLS session.
 * @property {number} [minDHSize=1024] Minimum size of the DH parameter in
 *   bits to accept a TLS connection. When a server offers a DH parameter with
 *   a size less than minDHSize, the TLS connection is destroyed and an error
 *   is thrown.
 * @property {number} [highWaterMark=16 * 1024] Consistent with the readable
 *   stream highWaterMark parameter.
 * @property {tls.SecureContext} [secureContext] TLS context object created
 *   with tls.createSecureContext(). If a secureContext is not provided, one
 *   will be created by passing the entire options object to
 *   tls.createSecureContext().
 * @property {string[]|string|Buffer[]|Buffer} [ca] Optionally override the
 *   trusted CA certificates. Default is to trust the well-known CAs curated
 *   by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly
 *   specified using this option.
 * @property {string[]|string|Buffer[]|Buffer} [cert] Cert chains in PEM
 *   format. One cert chain should be provided per private key. Each cert
 *   chain should consist of the PEM formatted certificate for a provided
 *   private key, followed by the PEM formatted intermediate certificates (if
 *   any), in order, and not including the root CA (the root CA must be
 *   pre-known to the peer, see ca). When providing multiple cert chains, they
 *   do not have to be in the same order as their private keys in key. If the
 *   intermediate certificates are not provided, the peer will not be able to
 *   validate the certificate, and the handshake will fail.
 * @property {string} [sigalgs] Colon-separated list of supported signature
 *   algorithms. The list can contain digest algorithms (SHA256, MD5 etc.),
 *   public key algorithms (RSA-PSS, ECDSA etc.), combination of both
 *   ('RSA+SHA384') or TLS v1.3 scheme names (rsa_pss_pss_sha512). See OpenSSL
 *   man pages for more info.
 * @property {string} [ciphers] Cipher suite specification, replacing the
 *   default. Cipher names are separated by colons, and must be uppercased in
 *   order for OpenSSL to accept them.
 * @property {string} [clientCertEngine] Name of an OpenSSL engine which can
 *   provide the client certificate.
 * @property {string|string[]|Buffer|Buffer[]} [crl] PEM formatted CRLs
 *   (Certificate Revocation Lists).
 * @property {string|Buffer} [dhparam] Diffie-Hellman parameters, required for
 *   perfect forward secrecy. Use openssl dhparam to create the parameters.
 *   The key length must be greater than or equal to 1024 bits or else an
 *   error will be thrown. Although 1024 bits is permissible, use 2048 bits or
 *   larger for stronger security. If omitted or invalid, the parameters are
 *   silently discarded and DHE ciphers will not be available.
 * @property {string} [ecdhCurve] A string describing a named curve or a colon
 *   separated list of curve NIDs or names, for example P-521:P-384:P-256, to
 *   use for ECDH key agreement. Set to auto to select the curve
 *   automatically. Use crypto.getCurves() to obtain a list of available curve
 *   names. On recent releases, openssl ecparam -list_curves will also display
 *   the name and description of each available elliptic curve. Default:
 *   tls.DEFAULT_ECDH_CURVE.
 * @property {boolean} [honorCipherOrder] Attempt to use the server's cipher
 *   suite preferences instead of the client's. When true, causes
 *   SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL
 *   Options for more information.
 * @property {string|string[]|Buffer|Buffer[]|object[]} [key] Private keys in
 *   PEM format. PEM allows the option of private keys being encrypted.
 *   Encrypted keys will be decrypted with options.passphrase. Multiple keys
 *   using different algorithms can be provided either as an array of
 *   unencrypted key strings or buffers, or an array of objects in the form
 *   {pem:string|buffer[, passphrase: string]}. The object form can only occur
 *   in an array. Passphrase is optional. Encrypted keys will be decrypted
 *   with object.passphrase if provided, or options.passphrase if it is not.
 * @property {string} [privateKeyEngine] Name of an OpenSSL engine to get
 *   private key from. Should be used together with privateKeyIdentifier.
 * @property {string} [privateKeyIdentifier] Identifier of a private key
 *   managed by an OpenSSL engine. Should be used together with
 *   privateKeyEngine. Should not be set together with key, because both
 *   options define a private key in different ways.
 * @property {string} [maxVersion=tls.DEFAULT_MAX_VERSION] Optionally set the
 *   maximum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
 *   'TLSv1'. Cannot be specified along with the secureProtocol option; use
 *   one or the other.
 * @property {string} [minVersion=tls.DEFAULT_MIN_VERSION] Optionally set the
 *   minimum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
 *   'TLSv1'. Cannot be specified along with the secureProtocol option; use
 *   one or the other. Avoid setting to less than TLSv1.2, but it may be
 *   required for interoperability.
 * @property {string} [passphrase] Shared passphrase used for a single private
 *   key and/or a PFX.
 * @property {string|string[]|Buffer|Buffer[]|object[]} [pfx] PFX or PKCS12
 *   encoded private key and certificate chain. PFX is an alternative to
 *   providing key and cert individually. PFX is usually encrypted, if it is,
 *   passphrase will be used to decrypt it.
 * @property {number} [secureOptions] Optionally affect the OpenSSL protocol
 *   behavior, which is not usually necessary. This should be used carefully
 *   if at all! Value is a numeric bitmask of the SSL_OP_* options from
 *   OpenSSL Options.
 * @property {string} [secureProtocol] Legacy mechanism to select the TLS
 *   protocol version to use, it does not support independent control of the
 *   minimum and maximum version, and does not support limiting the protocol
 *   to TLSv1.3. Use minVersion and maxVersion instead. The possible values
 *   are listed as SSL_METHODS, use the function names as strings. For
 *   example, use 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method'
 *   to allow any TLS protocol version up to TLSv1.3. It is not recommended to
 *   use TLS versions less than 1.2, but it may be required for
 *   interoperability. Default: none, see minVersion.
 * @property {string} [sessionIdContext] Opaque identifier used by servers to
 *   ensure session state is not shared between applications. Unused by
 *   clients.
 * @property {Buffer} [ticketKeys] 48-bytes of cryptographically strong
 *   pseudorandom data. See Session Resumption for more information.
 * @property {number} [sessionTimeout=300] The number of seconds after which a
 *   TLS session created by the server will no longer be resumable. See
 *   Session Resumption for more information.
 */
/**
 * Create a client connection to a listening server.
 *
 * @param {SocketConnectOpts|number} options Port to connect to.
 * @param {Function} [secureListener] If specified, function is
 *   registered for the 'secure' event.
 * @returns {tls.TLSSocket} Socket.
 */
export function connect(options: SocketConnectOpts | number, secureListener?: Function): tls.TLSSocket;
declare const MockTLSServer_base: typeof import("./net.js").Server;
/**
 * @callback SecureConnectionCallback
 * @param {tls.TLSSocket} sock The server side of the socket that was connected.
 * @returns {void}
 */
/**
 * @callback PSKCallback
 * @param {string} [hint] Optional message sent from the server to help client
 *   decide which identity to use during negotiation. Always null if TLS 1.3
 *   is used.
 * @returns {tls.PSKCallbackNegotation|null} Or null to stop the
 *   negotiation process. PSK must be compatible with the selected cipher's
 *   digest.
 */
/**
 * @callback SecureContextCallback
 * @param {Error} [error] An error ocurred.
 * @param {tls.SecureContext} [context] The context to use, if desired.
 * @returns {void}
 */
/**
 * @callback SNICallback
 * @param {string} serverName The name passed by the client.
 * @param {SecureContextCallback} callback Choose a security context
 *   for this connection.
 * @returns {void}
 */
/**
 * @typedef {object} ServerOpts
 * @property {CertificateAuthority} [authority] A CA instance to use.  If you
 *   are creating lots of servers, create one CA to pass into each of them, so
 *   that certs don't need to be created from scratch for each.
 * @property {SecureConnectionCallback} [secureConnectionListener] Installed
 *   as a listener for the 'secureConnection' event.
 * @property {Date} [notafter='Now + 5m'] Certificate not valid after this
 *   date.
 * @property {Date} [notbefore='Now - 1s'] Certificate not valid before this
 *   date.
 * @property {string} [subject] Subject Distinguished Name (DN).
 * @property {string[]} [names=['localhost']] DNS Subject Alternative Names
 *   for the cert.  Ignored for the CA cert.
 * @property {boolean} [allowHalfOpen=false] If set to false, then the socket
 *   will automatically end the writable side when the readable side ends.
 * @property {boolean} requestCert Whether to authenticate the remote peer by
 *   requesting a certificate. Clients always request a server certificate.
 *   Servers (isServer is true) may set requestCert to true to request a
 *   client certificate.
 * @property {boolean} rejectUnauthorized See tls.createServer().
 * @property {string[]|Buffer[]|DataView[]|Buffer|DataView} [ALPNProtocols] An
 *   array of strings, Buffers or DataViews, or a single Buffer or DataView
 *   containing the supported ALPN protocols. Buffers should have the format
 *   [len][name][len][name]... E.g. '\x08http/1.1\x08http/1.0', where the len
 *   byte is the length of the next protocol name. Passing an array is usually
 *   much simpler, e.g. ['http/1.1', 'http/1.0']. Protocols earlier in the
 *   list have higher preference than those later.
 * @property {SNICallback} SNICallback See tls.createServer().
 * @property {Buffer} [session] A Buffer instance, containing TLS session.
 * @property {boolean} requestOCSP If true, specifies that the OCSP status
 *   request extension will be added to the client hello and an 'OCSPResponse'
 *   event will be emitted on the socket before establishing a secure
 *   communication.
 * @property {tls.SecureContext} [secureContext] TLS context object created
 *   with tls.createSecureContext(). If a secureContext is not provided, one
 *   will be created by passing the entire options object to
 *   tls.createSecureContext().
 * @property {string[]|string|Buffer[]|Buffer} [ca] Optionally override the
 *   trusted CA certificates. Default is to trust the well-known CAs curated
 *   by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly
 *   specified using this option.
 * @property {string[]|string|Buffer[]|Buffer} [cert] Cert chains in PEM
 *   format. One cert chain should be provided per private key. Each cert
 *   chain should consist of the PEM formatted certificate for a provided
 *   private key, followed by the PEM formatted intermediate certificates (if
 *   any), in order, and not including the root CA (the root CA must be
 *   pre-known to the peer, see ca). When providing multiple cert chains, they
 *   do not have to be in the same order as their private keys in key. If the
 *   intermediate certificates are not provided, the peer will not be able to
 *   validate the certificate, and the handshake will fail.
 * @property {string} [sigalgs] Colon-separated list of supported signature
 *   algorithms. The list can contain digest algorithms (SHA256, MD5 etc.),
 *   public key algorithms (RSA-PSS, ECDSA etc.), combination of both
 *   ('RSA+SHA384') or TLS v1.3 scheme names (rsa_pss_pss_sha512). See OpenSSL
 *   man pages for more info.
 * @property {string} [ciphers] Cipher suite specification, replacing the
 *   default. Cipher names are separated by colons, and must be uppercased in
 *   order for OpenSSL to accept them.
 * @property {string} [clientCertEngine] Name of an OpenSSL engine which can
 *   provide the client certificate.
 * @property {string|string[]|Buffer|Buffer[]} [crl] PEM formatted CRLs
 *   (Certificate Revocation Lists).
 * @property {string|Buffer} [dhparam] Diffie-Hellman parameters, required for
 *   perfect forward secrecy. Use openssl dhparam to create the parameters.
 *   The key length must be greater than or equal to 1024 bits or else an
 *   error will be thrown. Although 1024 bits is permissible, use 2048 bits or
 *   larger for stronger security. If omitted or invalid, the parameters are
 *   silently discarded and DHE ciphers will not be available.
 * @property {string} [ecdhCurve] A string describing a named curve or a colon
 *   separated list of curve NIDs or names, for example P-521:P-384:P-256, to
 *   use for ECDH key agreement. Set to auto to select the curve
 *   automatically. Use crypto.getCurves() to obtain a list of available curve
 *   names. On recent releases, openssl ecparam -list_curves will also display
 *   the name and description of each available elliptic curve. Default:
 *   tls.DEFAULT_ECDH_CURVE.
 * @property {boolean} [honorCipherOrder] Attempt to use the server's cipher
 *   suite preferences instead of the client's. When true, causes
 *   SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL
 *   Options for more information.
 * @property {string|string[]|Buffer|Buffer[]|object[]} [key] Private keys in
 *   PEM format. PEM allows the option of private keys being encrypted.
 *   Encrypted keys will be decrypted with options.passphrase. Multiple keys
 *   using different algorithms can be provided either as an array of
 *   unencrypted key strings or buffers, or an array of objects in the form
 *   {pem:string|buffer[, passphrase: string]}. The object form can only occur
 *   in an array. Passphrase is optional. Encrypted keys will be decrypted
 *   with object.passphrase if provided, or options.passphrase if it is not.
 * @property {string} [privateKeyEngine] Name of an OpenSSL engine to get
 *   private key from. Should be used together with privateKeyIdentifier.
 * @property {string} [privateKeyIdentifier] Identifier of a private key
 *   managed by an OpenSSL engine. Should be used together with
 *   privateKeyEngine. Should not be set together with key, because both
 *   options define a private key in different ways.
 * @property {string} [maxVersion=tls.DEFAULT_MAX_VERSION] Optionally set the
 *   maximum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
 *   'TLSv1'. Cannot be specified along with the secureProtocol option; use
 *   one or the other.
 * @property {string} [minVersion=tls.DEFAULT_MIN_VERSION] Optionally set the
 *   minimum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
 *   'TLSv1'. Cannot be specified along with the secureProtocol option; use
 *   one or the other. Avoid setting to less than TLSv1.2, but it may be
 *   required for interoperability.
 * @property {string} [passphrase] Shared passphrase used for a single private
 *   key and/or a PFX.
 * @property {string|string[]|Buffer|Buffer[]|object[]} [pfx] PFX or PKCS12
 *   encoded private key and certificate chain. PFX is an alternative to
 *   providing key and cert individually. PFX is usually encrypted, if it is,
 *   passphrase will be used to decrypt it.
 * @property {number} [secureOptions] Optionally affect the OpenSSL protocol
 *   behavior, which is not usually necessary. This should be used carefully
 *   if at all! Value is a numeric bitmask of the SSL_OP_* options from
 *   OpenSSL Options.
 * @property {string} [secureProtocol] Legacy mechanism to select the TLS
 *   protocol version to use, it does not support independent control of the
 *   minimum and maximum version, and does not support limiting the protocol
 *   to TLSv1.3. Use minVersion and maxVersion instead. The possible values
 *   are listed as SSL_METHODS, use the function names as strings. For
 *   example, use 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method'
 *   to allow any TLS protocol version up to TLSv1.3. It is not recommended to
 *   use TLS versions less than 1.2, but it may be required for
 *   interoperability. Default: none, see minVersion.
 * @property {string} [sessionIdContext] Opaque identifier used by servers to
 *   ensure session state is not shared between applications. Unused by
 *   clients.
 * @property {Buffer} [ticketKeys] 48-bytes of cryptographically strong
 *   pseudorandom data. See Session Resumption for more information.
 * @property {number} [sessionTimeout=300] The number of seconds after which a
 *   TLS session created by the server will no longer be resumable. See
 *   Session Resumption for more information.
 */
/**
 * A TLS server that mocks the network, but all of the crypto code is real.
 */
export class MockTLSServer extends MockTLSServer_base {
    /**
     * Create a MockTLSServer instance.
     *
     * @param {ServerOpts|SecureConnectionCallback} [options] Server options.
     * @param {SecureConnectionCallback} [secureConnectionListener] Installed as
     *   a listener for the 'secureConnection' event.
     */
    constructor(options?: ServerOpts | SecureConnectionCallback, secureConnectionListener?: SecureConnectionCallback);
    cert: any;
    ca: any;
}
export const plainConnect: typeof import("./net.js").connect;
declare namespace _default {
    export { MockTLSServer };
    export { connect };
    export { plainConnect };
}
export default _default;
/**
 * All of the options that can be passed in to connect(), with text copied
 * from the Node docs.
 */
export type SocketConnectOpts = {
    /**
     * Listening server port to connect to.
     */
    port: number;
    /**
     * If set to false, then the socket
     * will automatically end the writable side when the readable side ends.
     */
    allowHalfOpen?: boolean;
    /**
     * If not false, the server
     * certificate is verified against the list of supplied CAs. An 'error'
     * event is emitted if verification fails; err.code contains the OpenSSL
     * error code.
     */
    rejectUnauthorized?: boolean;
    /**
     * When negotiating TLS-PSK (pre-shared
     * keys), this function is called with optional identity hint provided by
     * the server or null in case of TLS 1.3 where hint was removed. It will be
     * necessary to provide a custom tls.checkServerIdentity() for the
     * connection as the default one will try to check host name/IP of the
     * server against the certificate but that's not applicable for PSK because
     * there won't be a certificate present. More information can be found in
     * the RFC 4279.
     */
    pskCallback?: PSKCallback;
    /**
     * An
     * array of strings, Buffers or DataViews, or a single Buffer or DataView
     * containing the supported ALPN protocols. Buffers should have the format
     * [len][name][len][name]... E.g. '\x08http/1.1\x08http/1.0', where the len
     * byte is the length of the next protocol name. Passing an array is usually
     * much simpler, e.g. ['http/1.1', 'http/1.0']. Protocols earlier in the
     * list have higher preference than those later.
     */
    ALPNProtocols?: string[] | Buffer[] | DataView[] | Buffer | DataView;
    /**
     * Server name for the SNI (Server Name
     * Indication) TLS extension. It is the name of the host being connected to,
     * and must be a host name, and not an IP address. It can be used by a
     * multi-homed server to choose the correct certificate to present to the
     * client, see the SNICallback option to tls.createServer().
     */
    servername?: string;
    /**
     * A callback
     * function to be used (instead of the builtin tls.checkServerIdentity()
     * function) when checking the server's host name (or the provided
     * servername when explicitly set) against the certificate. This should
     * return an <Error> if verification fails. The method should return
     * undefined if the servername and cert are verified.
     */
    checkServerIdentity?: typeof tls.checkServerIdentity;
    /**
     * A Buffer instance, containing TLS session.
     */
    session?: Buffer;
    /**
     * Minimum size of the DH parameter in
     * bits to accept a TLS connection. When a server offers a DH parameter with
     * a size less than minDHSize, the TLS connection is destroyed and an error
     * is thrown.
     */
    minDHSize?: number;
    /**
     * Consistent with the readable
     * stream highWaterMark parameter.
     */
    highWaterMark?: number;
    /**
     * TLS context object created
     * with tls.createSecureContext(). If a secureContext is not provided, one
     * will be created by passing the entire options object to
     * tls.createSecureContext().
     */
    secureContext?: tls.SecureContext;
    /**
     * Optionally override the
     * trusted CA certificates. Default is to trust the well-known CAs curated
     * by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly
     * specified using this option.
     */
    ca?: string[] | string | Buffer[] | Buffer;
    /**
     * Cert chains in PEM
     * format. One cert chain should be provided per private key. Each cert
     * chain should consist of the PEM formatted certificate for a provided
     * private key, followed by the PEM formatted intermediate certificates (if
     * any), in order, and not including the root CA (the root CA must be
     * pre-known to the peer, see ca). When providing multiple cert chains, they
     * do not have to be in the same order as their private keys in key. If the
     * intermediate certificates are not provided, the peer will not be able to
     * validate the certificate, and the handshake will fail.
     */
    cert?: string[] | string | Buffer[] | Buffer;
    /**
     * Colon-separated list of supported signature
     * algorithms. The list can contain digest algorithms (SHA256, MD5 etc.),
     * public key algorithms (RSA-PSS, ECDSA etc.), combination of both
     * ('RSA+SHA384') or TLS v1.3 scheme names (rsa_pss_pss_sha512). See OpenSSL
     * man pages for more info.
     */
    sigalgs?: string;
    /**
     * Cipher suite specification, replacing the
     * default. Cipher names are separated by colons, and must be uppercased in
     * order for OpenSSL to accept them.
     */
    ciphers?: string;
    /**
     * Name of an OpenSSL engine which can
     * provide the client certificate.
     */
    clientCertEngine?: string;
    /**
     * PEM formatted CRLs
     * (Certificate Revocation Lists).
     */
    crl?: string | string[] | Buffer | Buffer[];
    /**
     * Diffie-Hellman parameters, required for
     * perfect forward secrecy. Use openssl dhparam to create the parameters.
     * The key length must be greater than or equal to 1024 bits or else an
     * error will be thrown. Although 1024 bits is permissible, use 2048 bits or
     * larger for stronger security. If omitted or invalid, the parameters are
     * silently discarded and DHE ciphers will not be available.
     */
    dhparam?: string | Buffer;
    /**
     * A string describing a named curve or a colon
     * separated list of curve NIDs or names, for example P-521:P-384:P-256, to
     * use for ECDH key agreement. Set to auto to select the curve
     * automatically. Use crypto.getCurves() to obtain a list of available curve
     * names. On recent releases, openssl ecparam -list_curves will also display
     * the name and description of each available elliptic curve. Default:
     * tls.DEFAULT_ECDH_CURVE.
     */
    ecdhCurve?: string;
    /**
     * Attempt to use the server's cipher
     * suite preferences instead of the client's. When true, causes
     * SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL
     * Options for more information.
     */
    honorCipherOrder?: boolean;
    /**
     * Private keys in
     * PEM format. PEM allows the option of private keys being encrypted.
     * Encrypted keys will be decrypted with options.passphrase. Multiple keys
     * using different algorithms can be provided either as an array of
     * unencrypted key strings or buffers, or an array of objects in the form
     * {pem:string|buffer[, passphrase: string]}. The object form can only occur
     * in an array. Passphrase is optional. Encrypted keys will be decrypted
     * with object.passphrase if provided, or options.passphrase if it is not.
     */
    key?: string | string[] | Buffer | Buffer[] | object[];
    /**
     * Name of an OpenSSL engine to get
     * private key from. Should be used together with privateKeyIdentifier.
     */
    privateKeyEngine?: string;
    /**
     * Identifier of a private key
     * managed by an OpenSSL engine. Should be used together with
     * privateKeyEngine. Should not be set together with key, because both
     * options define a private key in different ways.
     */
    privateKeyIdentifier?: string;
    /**
     * Optionally set the
     * maximum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
     * 'TLSv1'. Cannot be specified along with the secureProtocol option; use
     * one or the other.
     */
    maxVersion?: string;
    /**
     * Optionally set the
     * minimum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
     * 'TLSv1'. Cannot be specified along with the secureProtocol option; use
     * one or the other. Avoid setting to less than TLSv1.2, but it may be
     * required for interoperability.
     */
    minVersion?: string;
    /**
     * Shared passphrase used for a single private
     * key and/or a PFX.
     */
    passphrase?: string;
    /**
     * PFX or PKCS12
     * encoded private key and certificate chain. PFX is an alternative to
     * providing key and cert individually. PFX is usually encrypted, if it is,
     * passphrase will be used to decrypt it.
     */
    pfx?: string | string[] | Buffer | Buffer[] | object[];
    /**
     * Optionally affect the OpenSSL protocol
     * behavior, which is not usually necessary. This should be used carefully
     * if at all! Value is a numeric bitmask of the SSL_OP_* options from
     * OpenSSL Options.
     */
    secureOptions?: number;
    /**
     * Legacy mechanism to select the TLS
     * protocol version to use, it does not support independent control of the
     * minimum and maximum version, and does not support limiting the protocol
     * to TLSv1.3. Use minVersion and maxVersion instead. The possible values
     * are listed as SSL_METHODS, use the function names as strings. For
     * example, use 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method'
     * to allow any TLS protocol version up to TLSv1.3. It is not recommended to
     * use TLS versions less than 1.2, but it may be required for
     * interoperability. Default: none, see minVersion.
     */
    secureProtocol?: string;
    /**
     * Opaque identifier used by servers to
     * ensure session state is not shared between applications. Unused by
     * clients.
     */
    sessionIdContext?: string;
    /**
     * 48-bytes of cryptographically strong
     * pseudorandom data. See Session Resumption for more information.
     */
    ticketKeys?: Buffer;
    /**
     * The number of seconds after which a
     * TLS session created by the server will no longer be resumable. See
     * Session Resumption for more information.
     */
    sessionTimeout?: number;
};
export type SecureConnectionCallback = (sock: tls.TLSSocket) => void;
export type PSKCallback = (hint?: string) => tls.PSKCallbackNegotation | null;
export type SecureContextCallback = (error?: Error, context?: tls.SecureContext) => void;
export type SNICallback = (serverName: string, callback: SecureContextCallback) => void;
export type ServerOpts = {
    /**
     * A CA instance to use.  If you
     * are creating lots of servers, create one CA to pass into each of them, so
     * that certs don't need to be created from scratch for each.
     */
    authority?: CertificateAuthority;
    /**
     * Installed
     * as a listener for the 'secureConnection' event.
     */
    secureConnectionListener?: SecureConnectionCallback;
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
    /**
     * If set to false, then the socket
     * will automatically end the writable side when the readable side ends.
     */
    allowHalfOpen?: boolean;
    /**
     * Whether to authenticate the remote peer by
     * requesting a certificate. Clients always request a server certificate.
     * Servers (isServer is true) may set requestCert to true to request a
     * client certificate.
     */
    requestCert: boolean;
    /**
     * See tls.createServer().
     */
    rejectUnauthorized: boolean;
    /**
     * An
     * array of strings, Buffers or DataViews, or a single Buffer or DataView
     * containing the supported ALPN protocols. Buffers should have the format
     * [len][name][len][name]... E.g. '\x08http/1.1\x08http/1.0', where the len
     * byte is the length of the next protocol name. Passing an array is usually
     * much simpler, e.g. ['http/1.1', 'http/1.0']. Protocols earlier in the
     * list have higher preference than those later.
     */
    ALPNProtocols?: string[] | Buffer[] | DataView[] | Buffer | DataView;
    /**
     * See tls.createServer().
     */
    SNICallback: SNICallback;
    /**
     * A Buffer instance, containing TLS session.
     */
    session?: Buffer;
    /**
     * If true, specifies that the OCSP status
     * request extension will be added to the client hello and an 'OCSPResponse'
     * event will be emitted on the socket before establishing a secure
     * communication.
     */
    requestOCSP: boolean;
    /**
     * TLS context object created
     * with tls.createSecureContext(). If a secureContext is not provided, one
     * will be created by passing the entire options object to
     * tls.createSecureContext().
     */
    secureContext?: tls.SecureContext;
    /**
     * Optionally override the
     * trusted CA certificates. Default is to trust the well-known CAs curated
     * by Mozilla. Mozilla's CAs are completely replaced when CAs are explicitly
     * specified using this option.
     */
    ca?: string[] | string | Buffer[] | Buffer;
    /**
     * Cert chains in PEM
     * format. One cert chain should be provided per private key. Each cert
     * chain should consist of the PEM formatted certificate for a provided
     * private key, followed by the PEM formatted intermediate certificates (if
     * any), in order, and not including the root CA (the root CA must be
     * pre-known to the peer, see ca). When providing multiple cert chains, they
     * do not have to be in the same order as their private keys in key. If the
     * intermediate certificates are not provided, the peer will not be able to
     * validate the certificate, and the handshake will fail.
     */
    cert?: string[] | string | Buffer[] | Buffer;
    /**
     * Colon-separated list of supported signature
     * algorithms. The list can contain digest algorithms (SHA256, MD5 etc.),
     * public key algorithms (RSA-PSS, ECDSA etc.), combination of both
     * ('RSA+SHA384') or TLS v1.3 scheme names (rsa_pss_pss_sha512). See OpenSSL
     * man pages for more info.
     */
    sigalgs?: string;
    /**
     * Cipher suite specification, replacing the
     * default. Cipher names are separated by colons, and must be uppercased in
     * order for OpenSSL to accept them.
     */
    ciphers?: string;
    /**
     * Name of an OpenSSL engine which can
     * provide the client certificate.
     */
    clientCertEngine?: string;
    /**
     * PEM formatted CRLs
     * (Certificate Revocation Lists).
     */
    crl?: string | string[] | Buffer | Buffer[];
    /**
     * Diffie-Hellman parameters, required for
     * perfect forward secrecy. Use openssl dhparam to create the parameters.
     * The key length must be greater than or equal to 1024 bits or else an
     * error will be thrown. Although 1024 bits is permissible, use 2048 bits or
     * larger for stronger security. If omitted or invalid, the parameters are
     * silently discarded and DHE ciphers will not be available.
     */
    dhparam?: string | Buffer;
    /**
     * A string describing a named curve or a colon
     * separated list of curve NIDs or names, for example P-521:P-384:P-256, to
     * use for ECDH key agreement. Set to auto to select the curve
     * automatically. Use crypto.getCurves() to obtain a list of available curve
     * names. On recent releases, openssl ecparam -list_curves will also display
     * the name and description of each available elliptic curve. Default:
     * tls.DEFAULT_ECDH_CURVE.
     */
    ecdhCurve?: string;
    /**
     * Attempt to use the server's cipher
     * suite preferences instead of the client's. When true, causes
     * SSL_OP_CIPHER_SERVER_PREFERENCE to be set in secureOptions, see OpenSSL
     * Options for more information.
     */
    honorCipherOrder?: boolean;
    /**
     * Private keys in
     * PEM format. PEM allows the option of private keys being encrypted.
     * Encrypted keys will be decrypted with options.passphrase. Multiple keys
     * using different algorithms can be provided either as an array of
     * unencrypted key strings or buffers, or an array of objects in the form
     * {pem:string|buffer[, passphrase: string]}. The object form can only occur
     * in an array. Passphrase is optional. Encrypted keys will be decrypted
     * with object.passphrase if provided, or options.passphrase if it is not.
     */
    key?: string | string[] | Buffer | Buffer[] | object[];
    /**
     * Name of an OpenSSL engine to get
     * private key from. Should be used together with privateKeyIdentifier.
     */
    privateKeyEngine?: string;
    /**
     * Identifier of a private key
     * managed by an OpenSSL engine. Should be used together with
     * privateKeyEngine. Should not be set together with key, because both
     * options define a private key in different ways.
     */
    privateKeyIdentifier?: string;
    /**
     * Optionally set the
     * maximum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
     * 'TLSv1'. Cannot be specified along with the secureProtocol option; use
     * one or the other.
     */
    maxVersion?: string;
    /**
     * Optionally set the
     * minimum TLS version to allow. One of 'TLSv1.3', 'TLSv1.2', 'TLSv1.1', or
     * 'TLSv1'. Cannot be specified along with the secureProtocol option; use
     * one or the other. Avoid setting to less than TLSv1.2, but it may be
     * required for interoperability.
     */
    minVersion?: string;
    /**
     * Shared passphrase used for a single private
     * key and/or a PFX.
     */
    passphrase?: string;
    /**
     * PFX or PKCS12
     * encoded private key and certificate chain. PFX is an alternative to
     * providing key and cert individually. PFX is usually encrypted, if it is,
     * passphrase will be used to decrypt it.
     */
    pfx?: string | string[] | Buffer | Buffer[] | object[];
    /**
     * Optionally affect the OpenSSL protocol
     * behavior, which is not usually necessary. This should be used carefully
     * if at all! Value is a numeric bitmask of the SSL_OP_* options from
     * OpenSSL Options.
     */
    secureOptions?: number;
    /**
     * Legacy mechanism to select the TLS
     * protocol version to use, it does not support independent control of the
     * minimum and maximum version, and does not support limiting the protocol
     * to TLSv1.3. Use minVersion and maxVersion instead. The possible values
     * are listed as SSL_METHODS, use the function names as strings. For
     * example, use 'TLSv1_1_method' to force TLS version 1.1, or 'TLS_method'
     * to allow any TLS protocol version up to TLSv1.3. It is not recommended to
     * use TLS versions less than 1.2, but it may be required for
     * interoperability. Default: none, see minVersion.
     */
    secureProtocol?: string;
    /**
     * Opaque identifier used by servers to
     * ensure session state is not shared between applications. Unused by
     * clients.
     */
    sessionIdContext?: string;
    /**
     * 48-bytes of cryptographically strong
     * pseudorandom data. See Session Resumption for more information.
     */
    ticketKeys?: Buffer;
    /**
     * The number of seconds after which a
     * TLS session created by the server will no longer be resumable. See
     * Session Resumption for more information.
     */
    sessionTimeout?: number;
};
import tls from "tls";
import { CertificateAuthority } from "./ca.js";
