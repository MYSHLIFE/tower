
  Metro.Model.Validations = {
    ClassMethods: {
      validate: function() {
        var attributes, key, options, validators, value, _results;
        attributes = Metro.Support.Array.args(arguments);
        options = attributes.pop();
        if (typeof options !== "object") {
          Metro.raise("missing_options", "" + this.name + ".validates");
        }
        validators = this.validators();
        _results = [];
        for (key in options) {
          value = options[key];
          _results.push(validators.push(Metro.Model.Validator.create(key, value, attributes)));
        }
        return _results;
      },
      validators: function() {
        return this._validators || (this._validators = []);
      }
    },
    validate: function() {
      var errors, success, validator, validators, _i, _len;
      validators = this.constructor.validators();
      success = true;
      errors = this.errors = {};
      for (_i = 0, _len = validators.length; _i < _len; _i++) {
        validator = validators[_i];
        if (!validator.validateEach(this, errors)) success = false;
      }
      return success;
    }
  };

  module.exports = Metro.Model.Validations;
