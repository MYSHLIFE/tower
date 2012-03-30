# @module
Tower.Model.Scopes =
  ClassMethods:
    # Define a named scope on the model class.
    # 
    # @example All users with firstName starting with the letter "a"
    #   class App.User extends Tower.Model
    #     @field "firstName"
    #     @scope "letterA", @where(firstName: /^a/)
    #   
    #   App.User.a().all()
    # 
    # @param [String] name
    # @param [Object] scope you can pass in conditions for the `where` method, or an actual scope instance.
    # 
    # @return [Tower.Model.Scope]
    scope: (name, scope) ->
      @[name] = if scope instanceof Tower.Model.Scope then scope else @where(scope)

    # Returns a scope with default criteria for the model class.
    # 
    # @return [Tower.Model.Scope]
    scoped: ->
      scope = new Tower.Model.Scope(model: @)
      scope.where(type: @name) if @baseClass().name != @name
      scope

    defaultSort: (object) ->
      @_defaultSort = object if object
      @_defaultSort ||= {name: "createdAt", direction: "desc"}

    defaultScope: ->

for key in Tower.Model.Scope.queryMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.finderMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

for key in Tower.Model.Scope.persistenceMethods
  do (key) ->
    Tower.Model.Scopes.ClassMethods[key] = ->
      @scoped()[key](arguments...)

module.exports = Tower.Model.Scopes