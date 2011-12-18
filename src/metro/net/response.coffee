class Metro.Net.Response
  constructor: (data = {}) ->
    @url        = data.url
    @location   = data.location
    @pathname   = @location.path
    @query      = @parsedUrl.param
    @title      = data.title
    @title    ||= document?.title
    @body       = data.body     || {}
    @headers    = data.headers  || {}
    @headerSent = false
    @statusCode = 200
    @body       = ""

  # writeHead(200, controller.headers)
  writeHead: (statusCode, headers) ->
    @statusCode = statusCode
    @headers    = headers

  setHeader: (key, value) ->
    throw new Error("Headers already sent") if @headerSent
    @headers[key] = value

  write: (body = '') ->
    @body += body

  end: (body = '') ->
    @body       += body
    @sent       = true
    @headerSent = true

module.exports = Metro.Net.Response
