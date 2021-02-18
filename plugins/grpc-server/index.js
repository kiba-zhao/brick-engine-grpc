/**
 * @fileOverview grpc服务插件
 * @name index.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const grpc = require('@grpc/grpc-js');
const GrpcServer = require('lib/grpc_server');

function createGrpcServer(...args) {
  return new GrpcServer(...args);
}

exports.createGrpcServer = createGrpcServer;

exports.GrpcServer = GrpcServer;

exports.grpc = grpc;
