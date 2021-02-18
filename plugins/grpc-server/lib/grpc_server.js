/**
 * @fileOverview grpc服务类
 * @name grpc_server.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const assert = require('assert');
const { isPlainObject, isString, isInteger, inRange } = require('lodash');
const grpc = require('@grpc/grpc-js');

const SERVER = Symbol('server');
const GRPC = Symbol('grpc');
const OPTIONS = Symbol('options');

const PORT_REGEX = /^([1-9]|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/;
class GrpcServer {
  constructor(opts) {

    assert(isPlainObject(opts), 'GrpcServer: wrong opts');
    assert(isString(opts.address) ? true : opts.address === undefined, 'GrpcServer: wrong opts.address');
    assert(isString(opts.host) ? true : opts.host === undefined, 'GrpcServer: wrong opts.host');
    assert(isString(opts.port) ? PORT_REGEX.test(opts.port) : (isInteger(opts.port) && inRange(opts.port, 65536)) || opts.port === undefined, 'GrpcServer: wrong opts.port');


    this[SERVER] = new grpc.Server();
    this[OPTIONS] = opts;
  }

  get server() {
    return this[SERVER];
  }

  get grpc() {
    return this[GRPC];
  }

  init() {
    const server = this[SERVER];
    const opts = this[OPTIONS];
    const self = this;
    server.bindAsync(opts.address ? opts.address : `${opts.host}:${opts.port}`, grpc.ServerCredentials.createInsecure(), startServer.bind(self, self));
  }
}

module.exports = GrpcServer;

function startServer(grpcServer) {
  const server = grpcServer.server;
  server.start();
}
