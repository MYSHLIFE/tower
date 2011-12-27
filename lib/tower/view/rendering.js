
Tower.View.Rendering = {
  render: function(options, callback) {
    var self;
    options.type || (options.type = this.constructor.engine);
    if (!options.hasOwnProperty("layout") && this._context.layout) {
      options.layout = this._context.layout();
    }
    options.locals = this._renderingContext(options);
    self = this;
    return this._renderBody(options, function(error, body) {
      return self._renderLayout(body, options, callback);
    });
  },
  _renderBody: function(options, callback) {
    if (options.text) {
      return callback(null, options.text);
    } else if (options.json) {
      return callback(null, typeof options.json === "string" ? options.json : JSON.stringify(options.json));
    } else {
      if (!options.inline) {
        options.template = this._readTemplate(options.template, options.type);
      }
      return this._renderString(options.template, options, callback);
    }
  },
  _renderLayout: function(body, options, callback) {
    var layout;
    if (options.layout) {
      layout = this._readTemplate("layouts/" + options.layout, options.type);
      options.locals.yield = body;
      return this._renderString(layout, options, callback);
    } else {
      return callback(null, body);
    }
  },
  _renderString: function(string, options, callback) {
    var engine;
    if (options == null) options = {};
    if (options.type) {
      engine = require("shift").engine(options.type);
      return engine.render(string, options.locals, callback);
    } else {
      engine = require("shift");
      options.locals.string = string;
      return engine.render(options.locals, callback);
    }
  },
  _renderingContext: function(options) {
    var key, locals, value, _ref;
    locals = this;
    _ref = this._context;
    for (key in _ref) {
      value = _ref[key];
      if (!key.match(/^(render|constructor)/)) this[key] = value;
    }
    locals = Tower.Support.Object.extend(locals, options.locals);
    if (this.constructor.prettyPrint) locals.pretty = true;
    return locals;
  },
  _readTemplate: function(path, ext) {
    var template;
    template = this.constructor.store().find({
      path: path,
      ext: ext
    });
    if (!template) throw new Error("Template '" + path + "' was not found.");
    return template;
  }
};

module.exports = Tower.View.Rendering;
