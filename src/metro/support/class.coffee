moduleKeywords = ['included', 'extended', 'prototype']

class Class
  # Rename an instance method
  # 
  # ``` coffeescript
  # class User
  #   @alias "methods", "instance_methods"
  #   
  # ```
  @alias: (to, from) ->
    @::[to] = @::[from]
  
  @alias_method: (to, from) ->
    @::[to] = @::[from]
  
  @accessor: (key, self, callback) ->
    @_accessors ?= []
    @_accessors.push(key)
    @getter(key, self, callback)
    @setter(key, self)
    @
  
  @getter: (key, self, callback) ->
    self    ?= @prototype
    
    unless self.hasOwnProperty("_getAttribute")
      Object.defineProperty self, "_getAttribute", enumerable: false, configurable: true, value: (key) -> @["_#{key}"]
    
    @_getters ?= []
    @_getters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true, 
      get: ->
        @["_getAttribute"](key) || (@["_#{key}"] = callback.apply(@) if callback)
    
    @
  
  @setter: (key, self) ->
    self    ?= @prototype
    
    unless self.hasOwnProperty("_setAttribute")
      Object.defineProperty self, method, enumerable: false, configurable: true, value: (key, value) -> @["_#{key}"] = value
    
    @_setters ?= []
    @_setters.push(key)
    Object.defineProperty self, "_#{key}", enumerable: false, configurable: true
    Object.defineProperty self, key, enumerable: true, configurable: true, set: (value) -> @["_setAttribute"](key, value)
    
    @
    
  @classEval: (block) ->
    block.call(@)
    
  @delegate: ->
    options = arguments.pop()
    to      = options.to
    self    = @
    for key in arguments
      self::[key] = to[key]
  
  @include: (obj) ->
    throw new Error('include(obj) requires obj') unless obj
    
    @extend(obj)
    
    #for key, value of obj.prototype when key not in moduleKeywords
    #  @::[key] = value
    
    c = @
    child = @
    parent = obj
    
    #sn = if child.__super__ then child.__super__.constructor.name else "null"
    #console.log "#{@name}.__super__ (WAS) #{sn} and WILL BE #{parent.name}"
    
    clone = (fct)->
      clone = ->
        fct.apply this, arguments
        
      clone:: = fct::
      for property of fct
        clone[property] = fct[property] if fct.hasOwnProperty(property) and property isnt "prototype"
      clone
      
    oldproto = child.__super__ if child.__super__
    cloned = clone(parent)
    newproto = cloned.prototype
    
    for key, value of cloned.prototype when key not in moduleKeywords
      @::[key] = value
    
    cloned.prototype = oldproto if oldproto
    child.__super__ = newproto
    
    included = obj.included
    included.apply(obj.prototype) if included
    @
  
  @extend: (obj) ->
    throw new Error('extend(obj) requires obj') unless obj
    for key, value of obj when key not in moduleKeywords
      @[key] = value
    
    extended = obj.extended
    extended.apply(obj) if extended
    @
  
  @new: ->
    new @(arguments...)
    
  @instance_methods: ->
    result = []
    result.push(key) for key of @prototype
    result
    
  @class_methods: ->
    result = []
    result.push(key) for key of @
    result
  
  instance_exec: ->
    arguments[0].apply(@, arguments[1..-1]...)
  
  instance_eval: (block) ->
    block.apply(@)
    
  send: (method) ->
    if @[method]
      @[method].apply(arguments...)
    else
      @methodMissing(arguments...) if @methodMissing
  
  methodMissing: (method) ->
  
module.exports = Class

for key, value of Class
  Function.prototype[key] = value