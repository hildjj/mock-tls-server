/// <reference types="node" />
export class MockTLSserver {
    constructor(ServerInstanceClass: any, ...names: any[]);
    ServerInstanceClass: any;
    chain: {
        notafter: Date;
        notbefore: Date;
        ca_dn: string;
        ca_pem: any;
        srv_pem: any;
        srv_key: any;
    };
    instance(opts: any): any;
}
export class MockServerInstance extends MockSocket {
    constructor(chain: any, opts: any);
    chain: any;
    server: TLSSocket;
    _end(): void;
    _data(chunk: any, encoding: any): void;
    _finish(): void;
}
import { MockSocket } from "./socket.js";
import { TLSSocket } from "tls";
