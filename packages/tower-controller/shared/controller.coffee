# @include Tower.SupportCallbacks
# @include Tower.SupportEventEmitter
# @include Tower.ControllerCallbacks
# @include Tower.ControllerHelpers
# @include Tower.ControllerInstrumentation
# @include Tower.ControllerParams
# @include Tower.ControllerRedirecting
# @include Tower.ControllerRendering
# @include Tower.ControllerResourceful
# @include Tower.ControllerResponding
class Tower.Controller extends Tower.Collection
  @include  Tower.SupportCallbacks
  @reopenClass Tower.SupportEventEmitter
  @include  Tower.SupportEventEmitter

  @instance: ->
    @_instance ||= new @

  init: ->
    @_super arguments...
    @constructor._instance = @
    @headers              = {}
    @status               = 200
    @request              = null
    @response             = null
    @params               = {}
    @query                = {}

    metadata              = @constructor.metadata()

    @resourceName         = metadata.resourceName
    @resourceType         = metadata.resourceType
    @collectionName       = metadata.collectionName

    @formats              = if Tower.isClient then ['html'] else Tower._.keys(metadata.mimes)
    @hasParent            = @constructor.hasParent()

module.exports = Tower.Controller
