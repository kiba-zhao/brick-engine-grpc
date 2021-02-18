/**
 * @fileOverview 提供器入口文件
 * @name xprovide.js
 * @author kiba.x.zhao <kiba.rain@qq.com>
 * @license MIT
 */
'use strict';

const { createGrpcServer, grpc } = require('.');

module.exports = provider => {

  provider.require(['boot', 'inject', 'config'], (boot, inject, config) => setup(provider, boot, inject, config.grpcServer));

};

function setup(provider, boot, inject, config) {

  if (!config) {
    return;
  }

  const instance = createGrpcServer(config);
  provider.define('grpc-server', [], { server: instance.server, grpc });

  const loader = boot.createBootLoader(config.patterns, boot.context, config.opts || {});
  const injector = inject.createInjector(loader);
  provider.require(injector.deps, init.bind(this, injector, instance));
}

function init(injector, grpcServer, ...args) {
  const modules = injector.create(...args);
  let value = modules.next();
  while (value.done === false) {
    value = modules.next();
  }
  grpcServer.init();
}

