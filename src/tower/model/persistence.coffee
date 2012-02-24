Tower.Model.Persistence =
  ClassMethods:
    defaultStore: Tower.Store.Memory
    
    store: (value) ->
      return @_store if !value && @_store
      
      if typeof value == "function"
        @_store = new value(name: @collectionName(), type: Tower.namespaced(@name))
      else if typeof value == "object"
        @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
        Tower.Support.Object.extend @_store, value
      else if value
        @_store = value
      
      @_store ||= new @defaultStore(name: @collectionName(), type: Tower.namespaced(@name))
      
      @_store
    
    load: (records) ->
      @store().load(records)
      
    collectionName: ->
      Tower.Support.String.camelize(Tower.Support.String.pluralize(@name), true)
      
    resourceName: ->
      Tower.Support.String.camelize(@name, true)
      
  InstanceMethods:
    save: (options, callback) ->
      throw new Error("Record is read only") if @readOnly
      
      if typeof options == "function"
        callback  = options
        options   = {}
      options ||= {}
      
      unless options.validate == false
        @validate (error) =>
          if error
            callback.call @, null, false if callback
          else
            @_save callback
      else
        @_save callback
        
      @
    
    updateAttributes: (attributes, callback) ->
      @_update(attributes, callback)
    
    destroy: (callback) ->
      if @isNew()
        callback.call @, null if callback
      else
        @_destroy callback
      @
    
    delete: (callback) ->
      @destroy(callback)
    
    isPersisted: ->
      !!(@persistent)# && @attributes.hasOwnProperty("id") && @attributes.id != null && @attributes.id != undefined)
      
    isNew: ->
      !!!@isPersisted()
      
    reload: ->
      
    store: ->
      @constructor.store()
      
    _save: (callback) ->
      @runCallbacks "save", (block) =>
        complete = @_callback(block, callback)
        
        if @isNew()
          @_create(complete)
        else
          @_update(@toUpdates(), complete)
      
    _create: (callback) ->
      @runCallbacks "create", (block) =>
        complete = @_callback(block, callback)
        
        @constructor.create @, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @changes    = {}
            @persistent = true
            @updateSyncAction "create"
          
          complete.call(@, error)
      
      @
      
    _update: (updates, callback) ->
      @runCallbacks "update", (block) =>
        complete = @_callback(block, callback)
        @constructor.update @get("id"), updates, instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @changes    = {}
            @persistent = true
            @updateSyncAction "update"
          
          complete.call(@, error)
    
      @
      
    _destroy: (callback) ->
      @runCallbacks "destroy", (block) =>
        complete = @_callback(block, callback)
        
        @constructor.destroy @get("id"), instantiate: false, (error) =>
          throw error if error && !callback
          
          unless error
            @persistent = false
            @changes    = {}
            delete @attributes.id
            @updateSyncAction "destroy"
            
          complete.call(@, error)
          
      @
      
    updateSyncAction: ->
      
module.exports = Tower.Model.Persistence
