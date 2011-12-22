class Tower.Model.Relation.HasManyThrough extends Tower.Model.Relation.HasMany
  ###
  * HasManyThrough Relation
  * 
  * Examples
  * 
  *     @hasMany "comments", through: "articles"
  * 
  ###
  constructor: (owner, name, options = {}) ->
    super(owner, name, options)
    
  class @Scope extends @Scope
    constructor: (options = {}) ->
      super(options)
  
module.exports = Tower.Model.Relation.HasManyThrough
