
Tower.Controller.Instrumentation = {
  ClassMethods: {
    baseClass: function() {
      if (this.__super__ && this.__super__.constructor.baseClass && this.__super__.constructor !== Tower.Controller) {
        return this.__super__.constructor.baseClass();
      } else {
        return this;
      }
    },
    metadata: function() {
      var baseClassName, callbacks, className, collectionName, metadata, mimes, params, parts, renderers, resourceName, resourceType, superMetadata;
      className = this.name;
      metadata = this.metadata[className];
      if (metadata) return metadata;
      baseClassName = this.baseClass().name;
      if (baseClassName !== className) {
        superMetadata = this.baseClass().metadata();
      } else {
        superMetadata = {};
      }
      resourceType = Tower.Support.String.singularize(this.name.replace(/(Controller)$/, ""));
      parts = resourceType.split(".");
      resourceName = Tower.Support.String.camelize(parts[parts.length - 1], true);
      collectionName = Tower.Support.String.camelize(this.name.replace(/(Controller)$/, ""), true);
      params = superMetadata.params ? _.clone(superMetadata.params) : {};
      callbacks = superMetadata.callbacks ? _.clone(superMetadata.callbacks) : {};
      renderers = superMetadata.renderers ? _.clone(superMetadata.renderers) : {};
      mimes = superMetadata.mimes ? _.clone(superMetadata.mimes) : {
        json: {},
        html: {}
      };
      return this.metadata[className] = {
        className: className,
        resourceName: resourceName,
        resourceType: resourceType,
        collectionName: collectionName,
        params: params,
        renderers: renderers,
        mimes: mimes,
        callbacks: callbacks
      };
    }
  },
  InstanceMethods: {
    call: function(request, response, next) {
      this.request = request;
      this.response = response;
      this.params = this.request.params || {};
      this.cookies = this.request.cookies || {};
      this.query = this.request.query || {};
      this.session = this.request.session || {};
      this.format = this.params.format || "html";
      this.action = this.params.action;
      this.headers = {};
      this.callback = next;
      return this.process();
    },
    process: function() {
      var _this = this;
      this.processQuery();
      if (!Tower.env.match(/(test|production)/)) {
        console.log("  Processing by " + this.constructor.name + "#" + this.action + " as " + (this.format.toUpperCase()));
        console.log("  Parameters:");
        console.log(this.params);
      }
      return this.runCallbacks("action", {
        name: this.action
      }, function(callback) {
        return _this[_this.action].call(_this, callback);
      });
    },
    processQuery: function() {},
    clear: function() {
      this.request = null;
      this.response = null;
      return this.headers = null;
    },
    metadata: function() {
      return this.constructor.metadata();
    }
  }
};

module.exports = Tower.Controller.Instrumentation;
