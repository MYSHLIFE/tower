# This should somehow integrate with the future {Tower.Store.Transaction} class,
# to bundle up modifications.
# 
# This doesn't need to be used on the client.  The client just needs a set of cursors.
# e_dub: One way you could handle when to let go of the memory is when the user changes resources. so let's say the user is flipping through a list of users, and you keep that stuff in memory, then when they find the user they want, they click on that users posts, now you let go of your users list and start hanging onto the posts
# 
# This class should store the currentUser and currentAbility objects
# so there's a quick way to filter data by user and role.
class Tower.Net.Connection extends Tower.Class
  @transports:  []
  @controllers: []
  @all:         {}
  @handlers:    Ember.Map.create()

  # Try socket.io, then sockjs
  @initialize: ->
    try
      require('socket.io')
      @reopenClass Tower.Net.Connection.Socketio
    catch error
      try
        require('sockjs')
        @reopenClass Tower.Net.Connection.Sockjs
      catch error
        @

  @connect: (socket) ->
    @all[@getId(socket)] = connection = Tower.Net.Connection.create(socket: socket)

    connection.registerHandlers()

    connection

  @disconnect: (socket) ->
    connection = @all[@getId(socket)]
    connection.destroy =>
      delete @all[@getId(socket)]

  # @addHandler '/posts/something'
  @addHandler: (name, handler) ->
    @handlers.set(name, handler)

  registerHandlers: ->
    @constructor.handlers.forEach (eventType, handler) =>
      @registerHandler(eventType, handler)

  # all records must be of the same type for now.
  notify: (action, records) ->
    record    = records[0]
    return unless record
    matches   = []

    iterator  = (controller, next) =>
      @get(controller).matchAgainstCursors(records, matches, next)

    Tower.series @constructor.controllers, iterator, (error) =>
      @[action](matches)

  # 1. Once one record is matched against a controller it doesn't need to be matched against any other cursor.
  # 2. Once there are no more records for a specific controller type, the records don't need to be queried.
  created: (records, url, callback) ->
    @write(records)

  updated: (records) ->
    @write(records)

  deleted: (records) ->
    @write(records)

  # This then gets handled by client-side controllers
  # 
  # This connection is unique to a user, so it may send some records to one user and not to another.
  write: (records, url, callback) ->
    return unless records.length

    message =
      data: records
      url:  url
    return
    @constructor.emit message, (error, data) =>
      callback.call(@, error, data)

  # @todo
  destroy: (callback) ->
    callback()

module.exports = Tower.Net.Connection
