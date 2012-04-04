
Tower.Store.MongoDB.Database = {
  ClassMethods: {
    initialize: function(callback) {
      var env, mongo, url,
        _this = this;
      if (!this.initialized) {
        this.initialized = true;
        env = this.env();
        mongo = this.lib();
        if (env.url) {
          url = new Tower.Dispatch.Url(env.url);
          env.name = url.segments[0] || url.user;
          env.host = url.hostname;
          env.port = url.port;
          env.username = url.user;
          env.password = url.password;
        }
        new mongo.Db(env.name, new mongo.Server(env.host, env.port, {})).open(function(error, client) {
          if (error) throw error;
          if (env.username && env.password) {
            return client.authenticate(env.username, env.password, function(error) {
              if (error) throw error;
              _this.database = client;
              if (callback) return callback();
            });
          } else {
            _this.database = client;
            if (callback) return callback();
          }
        });
        process.on("exit", function() {
          if (_this.database) return _this.database.close();
        });
      } else {
        if (callback) callback();
      }
      return this.database;
    },
    clean: function(callback) {
      var _this = this;
      if (!this.database) return callback.call(this);
      return this.database.collections(function(error, collections) {
        var remove;
        remove = function(collection, next) {
          return collection.remove(next);
        };
        return Tower.parallel(collections, remove, callback);
      });
    }
  },
  collection: function() {
    var lib;
    if (!this._collection) {
      lib = this.constructor.lib();
      this._collection = new lib.Collection(this.constructor.database, this.name);
    }
    return this._collection;
  },
  transaction: function(callback) {
    this._transaction = true;
    callback.call(this);
    return this._transaction = false;
  }
};

module.exports = Tower.Store.MongoDB.Database;
