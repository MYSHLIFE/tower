class Tower.Model.Relation.BelongsTo extends Tower.Model.Relation
  init: (owner, name, options = {}) ->
    @_super arguments...

    @foreignKey = "#{name}Id"
    
    owner.field(@foreignKey, type: "Id")

    if @polymorphic
      @foreignType = "#{name}Type"
      owner.field(@foreignType, type: 'String')

    owner.prototype[name] = ->
      @relation(name)

class Tower.Model.Relation.BelongsTo.Cursor extends Tower.Model.Relation.Cursor
  isBelongsTo: true
  # need to do something here about Reflection

  toCursor: ->
    cursor  = super
    relation  = @relation

    # @todo shouldn't have to do $in here...
    cursor.where(id: $in: [@owner.get(relation.foreignKey)])

    cursor

module.exports = Tower.Model.Relation.BelongsTo
