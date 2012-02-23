class Tower.Controller extends Tower.Class
  @extend   Tower.Support.EventEmitter
  @include  Tower.Support.EventEmitter
  
  @instance: ->
    @_instance ||= new @
  
  constructor: ->
    @constructor._instance = @
    @headers              = {}
    @status               = 200
    @request              = null
    @response             = null
    @contentType          = null#"text/html"
    @params               = {}
    @query                = {}
    @resourceName         = @constructor.resourceName()
    @resourceType         = @constructor.resourceType()
    @collectionName       = @constructor.collectionName()
    @formats              = _.keys(@constructor.mimes())
    
    if @constructor._belongsTo
      @hasParent          = true
    else
      @hasParent          = false

require './controller/caching'
require './controller/callbacks'
require './controller/helpers'
require './controller/http'
require './controller/instrumentation'
require './controller/params'
require './controller/redirecting'
require './controller/rendering'
require './controller/resourceful'
require './controller/responder'
require './controller/responding'
require './controller/sockets'

Tower.Controller.include Tower.Support.Callbacks
Tower.Controller.include Tower.Controller.Caching
Tower.Controller.include Tower.Controller.Callbacks
Tower.Controller.include Tower.Controller.Helpers
Tower.Controller.include Tower.Controller.HTTP
Tower.Controller.include Tower.Controller.Instrumentation
Tower.Controller.include Tower.Controller.Params
Tower.Controller.include Tower.Controller.Redirecting
Tower.Controller.include Tower.Controller.Rendering
Tower.Controller.include Tower.Controller.Resourceful
Tower.Controller.include Tower.Controller.Responding
Tower.Controller.include Tower.Controller.Sockets

require './controller/renderers'

module.exports = Tower.Controller
