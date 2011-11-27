(function() {
  var specialProperties;
  var __hasProp = Object.prototype.hasOwnProperty, __indexOf = Array.prototype.indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (__hasProp.call(this, i) && this[i] === item) return i; } return -1; }, __slice = Array.prototype.slice;

  specialProperties = ['included', 'extended', 'prototype', 'ClassMethods', 'InstanceMethods'];

  Metro.Support.Object = {
    extend: function(object) {
      var args, key, node, value, _i, _len;
      args = Metro.Support.Array.args(arguments, 1);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        node = args[_i];
        for (key in node) {
          value = node[key];
          if (__indexOf.call(specialProperties, key) < 0) object[key] = value;
        }
      }
      return object;
    },
    deepMerge: function(object) {
      var args, key, node, value, _i, _len;
      args = Metro.Support.Array.args(arguments, 1);
      for (_i = 0, _len = args.length; _i < _len; _i++) {
        node = args[_i];
        for (key in node) {
          value = node[key];
          if (__indexOf.call(specialProperties, key) < 0) {
            if (typeof value === 'object' && object[key]) {
              object[key] = Metro.Support.Object.deepMerge(object[key], value);
            } else {
              object[key] = value;
            }
          }
        }
      }
      return object;
    },
    defineProperty: function(object, key, options) {
      if (options == null) options = {};
      return Object.defineProperty(object, key, options);
    },
    functionName: function(fn) {
      var _ref;
      if (fn.__name__) return fn.__name__;
      if (fn.name) return fn.name;
      return (_ref = fn.toString().match(/\W*function\s+([\w\$]+)\(/)) != null ? _ref[1] : void 0;
    },
    alias: function(object, to, from) {
      return object[to] = object[from];
    },
    accessor: function(object, key, callback) {
      object._accessors || (object._accessors = []);
      object._accessors.push(key);
      this.getter(key, object, callback);
      this.setter(key, object);
      return this;
    },
    setter: function(object, key) {
      if (!object.hasOwnProperty("_setAttribute")) {
        this.defineProperty(object, "_setAttribute", {
          enumerable: false,
          configurable: true,
          value: function(key, value) {
            return this["_" + key] = value;
          }
        });
      }
      object._setters || (object._setters = []);
      object._setters.push(key);
      this.defineProperty(object, key, {
        enumerable: true,
        configurable: true,
        set: function(value) {
          return this["_setAttribute"](key, value);
        }
      });
      return this;
    },
    getter: function(object, key, callback) {
      if (!object.hasOwnProperty("_getAttribute")) {
        this.defineProperty(object, "_getAttribute", {
          enumerable: false,
          configurable: true,
          value: function(key) {
            return this["_" + key];
          }
        });
      }
      object._getters || (object._getters = []);
      object._getters.push(key);
      this.defineProperty(object, key, {
        enumerable: true,
        configurable: true,
        get: function() {
          return this["_getAttribute"](key) || (callback ? this["_" + key] = callback.apply(this) : void 0);
        }
      });
      return this;
    },
    variables: function(object) {},
    accessors: function(object) {},
    methods: function(object) {
      var key, result, value;
      result = [];
      for (key in object) {
        value = object[key];
        if (this.isFunction(value)) result.push(key);
      }
      return result;
    },
    delegate: function() {
      var isFunction, key, keys, object, options, to, _i, _j, _len;
      object = arguments[0], keys = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), options = arguments[_i++];
      if (options == null) options = {};
      to = options.to;
      isFunction = this.isFunction(object);
      for (_j = 0, _len = keys.length; _j < _len; _j++) {
        key = keys[_j];
        if (isFunction) {
          object[key] = function() {
            var _ref;
            return (_ref = this[to]())[key].apply(_ref, arguments);
          };
        } else {
          this.defineProperty(object, key, {
            enumerable: true,
            configurable: true,
            get: function() {
              return this[to]()[key];
            }
          });
        }
      }
      return object;
    },
    isFunction: function(object) {
      return !!(object && object.constructor && object.call && object.apply);
    },
    isA: function(object, isa) {},
    isHash: function() {
      var object;
      object = arguments[0] || this;
      return _.isObject(object) && !(_.isFunction(object) || _.isArray(object));
    },
    isPresent: function(object) {
      return !this.isBlank(object);
    },
    isBlank: function(object) {
      var key, value;
      for (key in object) {
        value = object[key];
        return false;
      }
      return true;
    },
    has: function(object, key) {
      return object.hasOwnProperty(key);
    }
  };

  module.exports = Metro.Support.Object;

}).call(this);
