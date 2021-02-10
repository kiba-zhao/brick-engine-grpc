/**
 * @fileOverview grpc服务类
 * @name grpc_server.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { isPlainObject, isString, isInteger, inRange } = require('lodash');
const grpc = require('@grpc/grpc-js');
const assert = require('assert');
const { parse } = require('comment-parser');
const fs = require('fs');
const path = require('path');

const SERVER = Symbol('server');
const OPTIONS = Symbol('options');
const MODULES = Symbol('modules');
const DEPENDENCIES = Symbol('dependencies');

const PORT_REGEX = /^([1-9]|[1-5]\d{4}|6[1-4]\d{3}|65[1-4]\d{2}|655[1-2]\d|6553[1-5])$/;
class GrpcServer {
  constructor(loader, opts) {

    assert(isPlainObject(opts), `GrpcServer: wrong opts`);
    assert(isString(opts.address) ? true : opts.address === undefined, `GrpcServer: wrong opts.address`);
    assert(isString(opts.host) ? true : opts.host === undefined, `GrpcServer: wrong opts.host`);
    assert(isString(opts.port) ? PORT_REGEX.test(opts.port) : (isInteger(opts.port) && inRange(opts.port, 65536)) || opts.port === undefined, `GrpcServer: wrong opts.port`);


    this[SERVER] = new grpc.Server();
    this[OPTIONS] = opts;
    prepare(this, loader);
  }

  get deps() {
    return this[DEPENDENCIES];
  }

  get server() {
    return this[SERVER];
  }

  init(...args) {
    initModules(this, ...args);
    initServer(this);
  }
}

module.exports = GrpcServer;


function initServer(grpcServer) {
  const server = grpcServer.server;
  const opts = grpcServer[OPTIONS];
  server.bindAsync(opts.address ? opts.address : `${opts.host}:${opts.port}`, grpc.ServerCredentials.createInsecure(), startServer.bind(this, grpcServer));
}

function startServer(grpcServer) {
  const server = grpcServer.server;
  server.start();
}

function initModules(grpcServer, ...args) {
  const ctx = {};
  for (let i = 0; i < grpcServer.deps.length; i++) {
    if (args[i] === undefined) { continue; }
    const key = grpcServer.deps[i].id;
    ctx[key] = args[i];
  }

  const modules = grpcServer[MODULES];
  for (let module of modules) {
    const moduleArgs = [];
    for (let dep of module.deps) {
      assert(dep.required === false || ctx[dep.id] !== undefined, `Plugin GrpcServer Error: module ${module.name} is pending`);
      moduleArgs.push(ctx[dep.id]);
    }
    module.init(...moduleArgs);
  }
}

function prepare(grpcServer, loader) {

  const modules = [];
  const deps = [];
  const cache = {};
  for (let item of loader) {
    const module = parseModule(item);
    if (!module) { continue; }
    for (let dep of module.deps) {
      if (cache[dep.id] === true) { continue; }
      deps.push(dep);
    }
    modules.push(module);
  }

  grpcServer[MODULES] = modules;
  grpcServer[DEPENDENCIES] = deps;
}

const DEPENDENCY_TAG = 'dependency';
function parseModule(item) {
  const deps = [];
  const filePath = path.join(item.cwd, item.path);
  const content = fs.readFileSync(path, { encoding: 'utf8' });
  const ast = parse(content);
  for (const block of ast) {
    for (const tag of block.tags) {
      if (tag.tag === DEPENDENCY_TAG) {
        deps.push({ id: tag.name, required: !tag.optional });
      }
    }
  }

  return { name: filePath, deps, init: item.content };
}
