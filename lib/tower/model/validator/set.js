
Tower.Model.Validator.Set = (function() {

  function Set(value, attributes) {
    Set.__super__.constructor.call(this, _.toArray(value), attributes);
  }

  Set.prototype.validate = function(record, attribute, errors, callback) {};

  return Set;

})();

module.exports = Tower.Model.Validator.Format;
