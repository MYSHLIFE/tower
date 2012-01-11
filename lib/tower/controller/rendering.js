
Tower.Controller.Rendering = {
  render: function() {
    var args, callback, options, self, view, _base;
    args = Tower.Support.Array.args(arguments);
    if (args.length >= 2 && typeof args[args.length - 1] === "function") {
      callback = args.pop();
    } else {
      callback = null;
    }
    if (args.length > 1 && typeof args[args.length - 1] === "object") {
      options = args.pop();
    }
    if (typeof args[0] === "object") {
      options = args[0];
    } else {
      options || (options = {});
      options.template = args[0];
    }
    if (options.template) {
      if (typeof options.template === "string" && !!!options.template.match(/\//)) {
        options.template = "" + this.collectionName + "/" + options.template;
      }
    } else if (options.action) {
      options.template = "" + this.collectionName + "/" + options.action;
    }
    view = new Tower.View(this);
    (_base = this.headers)["Content-Type"] || (_base["Content-Type"] = this.contentType);
    self = this;
    return view.render.call(view, options, function(error, body) {
      if (error) {
        self.body = error.stack;
      } else {
        self.body = body;
      }
      if (callback) callback(error, body);
      if (self.callback) return self.callback();
    });
  },
  renderToBody: function(options) {
    this._processOptions(options);
    return this._renderTemplate(options);
  },
  renderToString: function() {
    var options;
    options = this._normalizeRender.apply(this, arguments);
    return this.renderToBody(options);
  },
  _renderTemplate: function(options) {
    return this.template.render(viewContext, options);
  }
};

module.exports = Tower.Controller.Rendering;
