# @mixin
# @todo make this work in not just coffeecup but all of them.
Tower.ViewAssetHelper =
  javascripts: ->
    sources = Tower._.args(arguments)
    options = Tower._.extractOptions(sources)
    options.namespace = 'javascripts'
    options.extension = 'js'
    paths = _extractAssetPaths sources, options
    javascriptTag(path) for path in paths
    return null

  javascript: ->
    javascripts.apply(@, arguments)

  stylesheets: ->
    sources = _.args(arguments)
    options = _.extractOptions(sources)
    options.namespace = 'stylesheets'
    options.extension = 'css'
    paths = _extractAssetPaths sources, options
    stylesheetTag(path) for path in paths
    return null

  stylesheet: ->
    stylesheets.apply @, arguments

  stylesheetTag: (source) ->
    link rel: 'stylesheet', href: source

  javascriptTag: (source) ->
    script src: source

  # @private
  _extractAssetPaths: (sources, options = {}) ->
    namespace = options.namespace
    extension = options.extension
    assets    = Tower.config.assets[namespace]
    result    = []

    if Tower.env == 'production'
      manifest  = Tower.assetManifest
      for source in sources
        unless !!source.match(/^(http|\/{2})/)
          continue unless assets[source]?
          source    = "#{source}.#{extension}"
          source    = manifest[source] if manifest[source]
          source    = "/assets/#{source}"
          source    = "#{Tower.assetHost}#{source}" if Tower.assetHost
        result.push(source)
    else
      for source in sources
        if !!source.match(/^(http|\/{2})/)
          result.push(source)
        else
          paths   = assets[source]
          if paths
            for path in paths
              result.push("/#{namespace}#{path}.#{extension}")

    result

module.exports = Tower.ViewAssetHelper