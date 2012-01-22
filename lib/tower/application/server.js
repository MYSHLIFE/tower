var File, connect, io, server;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

connect = require('express');

File = require('pathfinder').File;

server = require('express').createServer();

io = require('socket.io').listen(server);

Tower.Application = (function() {

  __extends(Application, Tower.Class);

  Application.use = function() {
    this.middleware || (this.middleware = []);
    return this.middleware.push(arguments);
  };

  Application.defaultStack = function() {
    this.use(connect.favicon(Tower.publicPath + "/favicon.ico"));
    this.use(connect.static(Tower.publicPath, {
      maxAge: Tower.publicCacheDuration
    }));
    if (Tower.env !== "production") this.use(connect.profiler());
    this.use(connect.logger());
    this.use(connect.query());
    this.use(connect.cookieParser(Tower.cookieSecret));
    this.use(connect.session({
      secret: Tower.sessionSecret
    }));
    this.use(connect.bodyParser());
    this.use(connect.csrf());
    this.use(connect.methodOverride("_method"));
    this.use(Tower.Middleware.Agent);
    this.use(Tower.Middleware.Location);
    if (Tower.httpCredentials) {
      this.use(connect.basicAuth(Tower.httpCredentials.username, Tower.httpCredentials.password));
    }
    this.use(Tower.Middleware.Router);
    return this.middleware;
  };

  Application.instance = function() {
    if (!this._instance) require("" + Tower.root + "/config/application");
    return this._instance;
  };

  Application.configure = function(block) {
    return this.initializers().push(block);
  };

  Application.initializers = function() {
    return this._initializers || (this._initializers = []);
  };

  function Application() {
    var _base;
    if (Tower.Application._instance) {
      throw new Error("Already initialized application");
    }
    (_base = Tower.Application).middleware || (_base.middleware = []);
    Tower.Application._instance = this;
    this.server || (this.server = server);
    this.io || (this.io = io);
  }

  Application.prototype.use = function() {
    var _ref;
    return (_ref = this.constructor).use.apply(_ref, arguments);
  };

  Application.prototype.initialize = function() {
    var config, configs, path, paths, _i, _j, _k, _l, _len, _len2, _len3, _len4, _results;
    require("" + Tower.root + "/config/application");
    paths = File.files("" + Tower.root + "/config/locales");
    for (_i = 0, _len = paths.length; _i < _len; _i++) {
      path = paths[_i];
      if (path.match(/\.(coffee|js)$/)) Tower.Support.I18n.load(path);
    }
    require("" + Tower.root + "/config/routes");
    require("" + Tower.root + "/config/assets");
    require("" + Tower.root + "/config/environments/" + Tower.env);
    paths = File.files("" + Tower.root + "/config/initializers");
    for (_j = 0, _len2 = paths.length; _j < _len2; _j++) {
      path = paths[_j];
      if (path.match(/\.(coffee|js)$/)) require(path);
    }
    configs = this.constructor.initializers();
    for (_k = 0, _len3 = configs.length; _k < _len3; _k++) {
      config = configs[_k];
      config.call(this);
    }
    paths = File.files("" + Tower.root + "/config/locales");
    paths = paths.concat(File.files("" + Tower.root + "/app/helpers"));
    paths = paths.concat(File.files("" + Tower.root + "/app/controllers"));
    _results = [];
    for (_l = 0, _len4 = paths.length; _l < _len4; _l++) {
      path = paths[_l];
      if (path.match(/\.(coffee|js)$/)) {
        _results.push(require(path));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Application.prototype.teardown = function() {
    Tower.Route.clear();
    delete require.cache[require.resolve("" + Tower.root + "/config/locales/en")];
    delete require.cache[require.resolve("" + Tower.root + "/config/routes")];
    delete Tower.Route._store;
    delete Tower.Controller._helpers;
    delete Tower.Controller._layout;
    return delete Tower.Controller._theme;
  };

  Application.prototype.handle = function() {
    var _ref;
    return (_ref = this.server).handle.apply(_ref, arguments);
  };

  Application.prototype.stack = function() {
    var args, middleware, middlewares, _i, _len, _ref;
    middlewares = this.constructor.middleware;
    if (!(middlewares && middlewares.length > 0)) {
      middlewares = this.constructor.defaultStack();
    }
    for (_i = 0, _len = middlewares.length; _i < _len; _i++) {
      middleware = middlewares[_i];
      args = Tower.Support.Array.args(middleware);
      if (typeof args[0] === "string") {
        middleware = args.shift();
        this.server.use(connect[middleware].apply(connect, args));
      } else {
        (_ref = this.server).use.apply(_ref, args);
      }
    }
    return this;
  };

  Application.prototype.listen = function() {
    if (Tower.env !== "test") {
      this.server.listen(Tower.port);
      return _console.info("Tower " + Tower.env + " server listening on port " + Tower.port);
    }
  };

  Application.prototype.run = function() {
    this.initialize();
    this.stack();
    return this.listen();
  };

  return Application;

})();

require('./assets');

module.exports = Tower.Application;
