class Metro.Model extends Metro.Object
  constructor: (attrs = {}) ->
    definitions = @constructor.fields()
    attributes  = {}
    
    for key, value of attrs
      attributes[key] = value
    
    for name, definition of definitions
      attributes[name] ||= definition.defaultValue(@) unless attrs.hasOwnProperty(name)
    
    @attributes   = attributes
    @changes      = {}
    @errors       = {}
    #@relations    = {}
    @readonly     = false
  
require './model/scope'
require './model/callbacks'
require './model/criteria'
require './model/dirty'
require './model/metadata'
require './model/inheritance'
require './model/relation'
require './model/relations'
require './model/field'
require './model/versioning'
require './model/fields'
require './model/persistence'
require './model/atomic'
require './model/scopes'
require './model/nestedAttributes'
require './model/serialization'
require './model/states'
require './model/validator'
require './model/validations'
require './model/timestamp'

Metro.Model.include Metro.Model.Persistence
Metro.Model.include Metro.Model.Atomic
Metro.Model.include Metro.Model.Versioning
Metro.Model.include Metro.Model.Metadata
Metro.Model.include Metro.Model.Dirty
Metro.Model.include Metro.Model.Criteria
Metro.Model.include Metro.Model.Scopes
Metro.Model.include Metro.Model.States
Metro.Model.include Metro.Model.Inheritance
Metro.Model.include Metro.Model.Serialization
Metro.Model.include Metro.Model.NestedAttributes
Metro.Model.include Metro.Model.Relations
Metro.Model.include Metro.Model.Validations
Metro.Model.include Metro.Model.Callbacks
Metro.Model.include Metro.Model.Fields

module.exports = Metro.Model
