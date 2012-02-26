Tower.Store.Memory.Serialization =    
  generateId: ->
    @lastId++
    
  _updateAttribute: (attributes, key, value) ->
    field       = @schema()[key]
    if field && field.type == "Array" && !Tower.Support.Object.isArray(value)
      attributes[key] ||= []
      attributes[key].push value
    else if @_atomicModifier(key)
      @["_#{key.replace("$", "")}AtomicUpdate"](attributes, value)
    else
      attributes[key] = value
    
  _atomicModifier: (key) ->
    !!@constructor.atomicModifiers[key]
    
  _pushAtomicUpdate: (attributes, value) ->
    for _key, _value of value
      attributes[_key] ||= []
      attributes[_key].push _value
    attributes
    
  _pullAtomicUpdate: (attributes, value) ->
    for _key, _value of value
      _attributeValue = attributes[_key]
      if _attributeValue
        for item in _value
          _attributeValue.splice _attributeValue.indexOf(item), 1
    attributes
    
  _incAtomicUpdate: (attributes, value) ->
    for _key, _value of value
      attributes[_key] ||= 0
      attributes[_key] += _value
    attributes
  
module.exports = Tower.Store.Memory.Serialization
