(function() {
  var File, crypto, fs, mime, util, _path;
  fs = require('fs');
  crypto = require('crypto');
  mime = require('mime');
  _path = require('path');
  util = require('util');
  File = (function() {
    File.stat = function(path) {
      return fs.statSync(path);
    };
    File.digest_hash = function() {
      return crypto.createHash('md5');
    };
    File.digest = function(path, data) {
      var stat;
      stat = this.stat(path);
      if (stat == null) {
        return;
      }
      if (data == null) {
        data = this.read(path);
      }
      if (data == null) {
        return;
      }
      return this.digest_hash().update(data).digest("hex");
    };
    File.read = function(path) {
      return fs.readFileSync(path, "utf-8");
    };
    File.slug = function(path) {
      return this.basename(path).replace(new RegExp(this.extname(path) + "$"), "");
    };
    File.content_type = function(path) {
      return mime.lookup(path);
    };
    File.mtime = function(path) {
      return this.stat(path).mtime;
    };
    File.size = function(path) {
      return this.stat(path).size;
    };
    File.expand_path = function(path) {
      return _path.normalize(path);
    };
    File.basename = function() {
      return _path.basename.apply(_path, arguments);
    };
    File.extname = function(path) {
      return _path.extname(path);
    };
    File.exists = function(path) {
      return _path.exists(path);
    };
    File.extensions = function(path) {
      return this.basename(path).match(/(\.\w+)/g);
    };
    File.join = function() {
      return Array.prototype.slice.call(arguments, 0, arguments.length).join("/").replace(/\/+/, "/");
    };
    File.is_url = function(path) {
      return !!path.match(/^[-a-z]+:\/\/|^cid:|^\/\//);
    };
    File.is_absolute = function(path) {
      return path.charAt(0) === "/";
    };
    File.glob = function() {
      var path, paths, result, _i, _len;
      paths = Metro.Support.Array.extract_args(arguments);
      result = [];
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        result = result.concat(require('findit').sync(path));
      }
      return result;
    };
    File.files = function() {
      var path, paths, result, self, _i, _len;
      paths = this.glob.apply(this, arguments);
      result = [];
      self = this;
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        if (self.is_file(path)) {
          result.push(path);
        }
      }
      return result;
    };
    File.directories = function() {
      var path, paths, result, self, _i, _len;
      paths = this.glob.apply(this, arguments);
      result = [];
      self = this;
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        if (self.is_directory(path)) {
          result.push(path);
        }
      }
      return result;
    };
    File.entries = function(path) {
      return fs.readdirSync(path);
    };
    File.dirname = function(path) {
      return _path.dirname(path);
    };
    File.is_directory = function(path) {
      return this.stat(path).isDirectory();
    };
    File.is_file = function(path) {
      return !this.is_directory(path);
    };
    File.copy = function(from, to) {
      var new_file, old_file;
      old_file = fs.createReadStream(from);
      new_file = fs.createWriteStream(to);
      return new_file.once('open', function(data) {
        return util.pump(old_file, new_file);
      });
    };
    File.watch = function() {};
    function File(path) {
      this.path = path;
      this.previous_mtime = this.mtime();
    }
    File.prototype.stale = function() {
      var new_mtime, old_mtime, result;
      old_mtime = this.previous_mtime;
      new_mtime = this.mtime();
      result = old_mtime.getTime() !== new_mtime.getTime();
      this.previous_mtime = new_mtime;
      return result;
    };
    File.prototype.stat = function() {
      return this.constructor.stat(this.path);
    };
    File.prototype.content_type = function() {
      return this.constructor.content_type(this.path);
    };
    File.prototype.mtime = function() {
      return this.constructor.mtime(this.path);
    };
    File.prototype.size = function() {
      return this.constructor.size(this.path);
    };
    File.prototype.digest = function() {
      return this.constructor.digest(this.path);
    };
    File.prototype.extensions = function() {
      return this.constructor.extensions(this.path);
    };
    File.prototype.extension = function() {
      return this.constructor.extname(this.path);
    };
    File.prototype.read = function() {
      return fs.readFileSync(this.path, "utf-8");
    };
    return File;
  })();
  module.exports = File;
}).call(this);
