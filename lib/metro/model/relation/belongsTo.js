(function() {
  var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Metro.Model.Relation.BelongsTo = (function() {

    __extends(BelongsTo, Metro.Model.Relation);

    function BelongsTo(owner, name, options) {
      var self;
      if (options == null) options = {};
      BelongsTo.__super__.constructor.call(this, owner, name, options);
      if (Metro.accessors) {
        Metro.Support.Object.defineProperty(owner.prototype, name, {
          enumerable: true,
          configurable: true,
          get: function() {
            return this.relation(name).first();
          },
          set: function(value) {
            return this.relation(name).set(value);
          }
        });
      }
      owner.field("" + name + "Id");
      self = this;
      owner.prototype["build" + (Metro.Support.String.camelize(name))] = function(attributes, callback) {
        return this.buildRelation(name, attributes, callback);
      };
      owner.prototype["create" + (Metro.Support.String.camelize(name))] = function(attributes, callback) {
        return this.createRelation(name, attributes, callback);
      };
    }

    BelongsTo.Scope = (function() {

      __extends(Scope, BelongsTo.Scope);

      function Scope() {
        Scope.__super__.constructor.apply(this, arguments);
      }

      return Scope;

    })();

    return BelongsTo;

  })();

  module.exports = Metro.Model.Relation.BelongsTo;

}).call(this);
