/**
 * @fileOverview 提供器入口文件
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createGrpcServer } = require('.');

module.exports = (provider) => {

  provider.require(['boot', 'config'], (boot, config) => setup(provider, boot, config.grpcServer));

};

const ID = 'grpc-server';
function setup(provider, boot, config) {

  if (!config) {
    return;
  }

  const loader = boot.createBootLoader(config.pattern, boot.context, config.opts || {});
  const instance = createGrpcServer(loader, config);
  provider.define(ID, [], instance.server);
  provider.require(instance.deps, instance.init);
}
