_url = require('url')
_   = require('underscore')

# http://nodejs.org/docs/v0.4.7/api/url.html
class Router
  @middleware: (request, result, next) -> (new Metro.Middleware.Router).call(request, result, next)
  
  call: (request, response, next) ->
    unless !!@process(request, response)
      @error(request, response)
      #next() if next?
    response
  
  process: (request, response) ->
    routes = Metro.Route.all()
    for route in routes
      if controller = @processRoute(route, request, response)
        return controller
    null
    
  processRoute: (route, request, response) ->
    url                    = _url.parse(request.url)
    path                   = url.pathname
    match                  = route.match(path)
    return null unless match
    method                 = request.method.toLowerCase()
    keys                   = route.keys
    params                 = _.extend({}, route.defaults, request.query || {}, request.body || {})
    match                  = match[1..-1]
    
    for capture, i in match
      params[keys[i].name] = if capture then decodeURIComponent(capture) else null
    
    controller             = route.controller
    
    params.action          = controller.action if controller
    
    request.params         = params
    
    if controller
      try
        controller         = new global[route.controller.className]
      catch error
        throw(new Error("#{route.controller.className} wasn't found"))
      controller.call(request, response)
    
    controller
    
  error: (request, response) ->
    if response
      response.statusCode = 404
      response.setHeader('Content-Type', 'text/plain')
      response.end("No path matches #{request.url}")
      
module.exports = Router
