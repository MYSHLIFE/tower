fs = require('fs')
# https://github.com/fairfieldt/coffeescript-concat/blob/master/coffeescript-concat.coffee
# https://github.com/serpentem/coffee-toaster
# http://requirejs.org/
# _require = global.require
# global.require = (path) ->
#   Metro.Support.Dependencies.load_path(path)

class Dependencies
  @load: (directory) ->
    paths = require('findit').sync directory
    @load_path(path) for path in paths
  
  @load_path: (path) ->
    self  = @
    keys  = @keys
    klass = Metro.Support.Path.basename(path).split(".")[0]
    klass = Metro.Support.String.camelize("_#{klass}")
    unless keys[klass]
      keys[klass]   = new Metro.Support.Path(path)
      global[klass] = require(path)
      
  @clear: ->
    @clear_dependency(key) for key, file of @keys
  
  @clear_dependency: (key) ->
    file = @keys[key]
    delete require.cache[file.path]
    global[key] = null
    delete global[key]
    @keys[key] = null
    delete @keys[key]
    
  @reload_modified: ->
    self = @
    keys = @keys
    for key, file of keys
      if file.stale()
        self.clear_dependency(key)
        keys[key]   = file
        global[key] = require(file.path)
    
  @keys: {}
    
module.exports = Dependencies
