
Tower.Store.MongoDB.Persistence = {
  create: function(attributes, options, callback) {
    var record,
      _this = this;
    record = this.serializeModel(attributes);
    attributes = this.serializeAttributesForCreate(attributes);
    options = this.serializeOptions(options);
    this.joins(scope, function() {
      return _this.collection().insert(attributes, options, function(error, docs) {
        var doc;
        doc = docs[0];
        record.set("id", doc["_id"]);
        record.persistent = !!!error;
        if (callback) return callback.call(_this, error, record.attributes);
      });
    });
    record.set("id", attributes["_id"]);
    return record;
  },
  update: function(updates, conditions, options, callback) {
    var _this = this;
    updates = this.serializeAttributesForUpdate(updates);
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    if (!options.hasOwnProperty("safe")) options.safe = true;
    if (!options.hasOwnProperty("upsert")) options.upsert = false;
    if (!options.hasOwnProperty("multi")) options.multi = true;
    this.joins(scope, function() {
      return _this.collection().update(conditions, updates, options, function(error) {
        if (callback) return callback.call(_this, error);
      });
    });
    return;
  },
  destroy: function(conditions, options, callback) {
    var _this = this;
    conditions = this.serializeQuery(conditions);
    options = this.serializeOptions(options);
    this.joins(scope, function() {
      return _this.collection().remove(conditions, options, function(error) {
        if (callback) return callback.call(_this, error);
      });
    });
    return;
  }
};

module.exports = Tower.Store.MongoDB.Persistence;
