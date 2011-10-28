class Dependencies
  @middleware: (request, result, next) -> (new Dependencies).call(request, result, next)
  
  call: (request, result, next) ->
    Metro.Support.Dependencies.reloadModified()
    Metro.Routes.reload()
    next() if next?
    
module.exports = Dependencies
