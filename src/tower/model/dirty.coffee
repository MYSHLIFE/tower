# @mixin
Tower.Model.Dirty =
  changes: Ember.computed(->
    attributes        = @get('attributes')

    injectChange = (memo, value, key) =>
      memo[key] = [value, attributes[key]] # [old, new]
      memo

    _.inject(@get('changedAttributes'), injectChange, {})
  ).volatile()

  dirtyAttributes: Ember.computed(->
    if @get('isNew')
      @attributesForCreate()
    else
      @attributesForUpdate()
  ).volatile()

  changedAttributes: Ember.computed(->
    @get('data').changedAttributes
  ).volatile()

  changed: Ember.computed(->
    _.keys(@get('changedAttributes'))
  ).volatile()

  attributeChanged: (name) ->
    @get('changedAttributes').hasOwnProperty(name)

  attributeWas: (name) ->
    @get('changedAttributes')[name]

  resetAttribute: (key) ->
    changedAttributes = @get('changedAttributes')
    attributes        = @get('attributes')

    if changedAttributes.hasOwnProperty(key)
      old = changedAttributes[key]
      delete changedAttributes[key]
      attributes[key] = old
    else
      attributes[key] = @get('data')._defaultValue(key)

  attributesForCreate: ->
    @_attributesForPersistence(@attributeKeysForCreate())

  attributesForUpdate: (keys) ->
    @_attributesForPersistence(@attributeKeysForUpdate(keys))

  attributeKeysForCreate: ->
    primaryKey = 'id'
    _.select _.keys(@get('attributes')), (key) -> key != primaryKey

  attributeKeysForUpdate: (keys) ->
    primaryKey  = 'id'
    keys ||= _.keys(@get('changedAttributes'))
    _.select keys, (key) -> key != primaryKey

  _updateChangedAttribute: (key, value) ->
    changedAttributes = @get('changedAttributes')
    attributes        = @get('attributes')

    # @todo, need to account for typecasting better
    if changedAttributes.hasOwnProperty(key)
      if _.isEqual(changedAttributes[key], value)
        delete changedAttributes[key]
    else
      old = @get('data')._clonedValue(attributes[key]) # @readAttribute(key)
      changedAttributes[key] = old unless _.isEqual(old, value) # if old != value

  _attributesForPersistence: (keys) ->
    result      = {}
    attributes  = @get('attributes')

    for key in keys
      result[key] = attributes[key]

    result

module.exports = Tower.Model.Dirty
