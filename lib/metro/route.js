(function() {
  var Route;
  Route = (function() {
    Route.DSL = require('./route/dsl');
    Route.include(Metro.Model.Scopes);
    Route.store = function() {
      var _ref;
      return (_ref = this._store) != null ? _ref : this._store = new Metro.Store.Memory;
    };
    Route.create = function(route) {
      return this.store().create(route);
    };
    Route.normalize_path = function(path) {
      return "/" + path.replace(/^\/|\/$/, "");
    };
    Route.initialize = function() {
      return require("" + Metro.root + "/config/routes");
    };
    Route.teardown = function() {
      this.store().clear();
      delete require.cache["" + Metro.root + "/config/routes"];
      return delete this._store;
    };
    Route.prototype.name = null;
    Route.prototype.path = null;
    Route.prototype.ip = null;
    Route.prototype.method = null;
    Route.prototype.options = null;
    Route.prototype.pattern = null;
    Route.prototype.keys = null;
    Route.draw = function(callback) {
      callback.apply(new Metro.Route.DSL(this));
      return this;
    };
    Route.prototype.add = function(route) {
      this.set.push(route);
      if (route.name != null) {
        this.named[route.name] = route;
      }
      return route;
    };
    Route.prototype.clear = function() {
      this.set = [];
      return this.named = {};
    };
    function Route(options) {
      if (options == null) {
        options = options;
      }
      this.path = options.path;
      this.name = options.name;
      this.method = options.method;
      this.ip = options.ip;
      this.defaults = options.defaults || {};
      this.constraints = options.constraints;
      this.options = options;
      this.controller = options.controller;
      this.keys = [];
      this.pattern = this.extract_pattern(this.path);
      this.id = this.path;
      if (this.controller) {
        this.id += this.controller.name + this.controller.action;
      }
    }
    Route.prototype.match = function(path) {
      return this.pattern.exec(path);
    };
    Route.prototype.extract_pattern = function(path, case_sensitive, strict) {
      var self, _ref;
      if (path instanceof RegExp) {
        return path;
      }
      self = this;
      if (path === "/") {
        return new RegExp('^' + path + '$');
      }
      path = path.replace(/(\(?)(\/)?(\.)?([:\*])(\w+)(\))?(\?)?/g, function(_, open, slash, format, symbol, key, close, optional) {
        var result, splat;
        optional = (!!optional) || (open + close === "()");
        splat = symbol === "*";
        self.keys.push({
          name: key,
          optional: !!optional,
          splat: splat
        });
        if (slash == null) {
          slash = "";
        }
        result = "";
        if (!optional || !splat) {
          result += slash;
        }
        result += "(?:";
        if (format != null) {
          result += splat ? "\\.([^.]+?)" : "\\.([^/.]+?)";
        } else {
          result += splat ? "/?(.+)" : "([^/\\.]+)";
        }
        result += ")";
        if (optional) {
          result += "?";
        }
        return result;
      });
      return new RegExp('^' + path + '$', (_ref = !!case_sensitive) != null ? _ref : {
        '': 'i'
      });
    };
    return Route;
  })();
  module.exports = Route;
}).call(this);
