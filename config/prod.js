/**
 * @fileOverview 生产配置
 * @name prod.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

module.exports = env => {

  const exports = {};

  exports.grpcServer = {
    address: env.GRPC_SERVER_ADDRESS,
    host: env.GRPC_SERVER_HOST || '0.0.0.0',
    port: env.GRPC_SERVER_PROT || 9090,
  };

  return exports;
};
