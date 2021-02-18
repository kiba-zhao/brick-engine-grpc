export = GrpcServer;
declare class GrpcServer {
    constructor(opts: any);
    get server(): grpc.Server;
    get grpc(): any;
    init(): void;
    [SERVER]: grpc.Server;
    [OPTIONS]: any;
}
import grpc = require("@grpc/grpc-js");
declare const SERVER: unique symbol;
declare const OPTIONS: unique symbol;
