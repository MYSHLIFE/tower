Metro.Model.Scopes =
  ClassMethods:
    # Create named scope class method finders for a model.
    #
    # @example Add scope to a User model
    # 
    #     class User
    #       @scope "active",      @where(active: true)
    #       @scope "recent",      @where(createdAt: ">=": 2.days().ago()).order("createdAt", "desc").order("email", "asc")
    #       @scope "developers",  @where(tags: _anyIn: ["ruby", "javascript"])
    # 
    scope: (name, scope) ->
      @[name] = if scope instanceof Metro.Model.Scope then scope else @where(scope)
    
    where: ->
      @scoped().where(arguments...)
    
    order: ->
      @scoped().order(arguments...)
    
    limit: ->
      @scoped().limit(arguments...)
  
    # The fields you want to pluck from the database  
    select: ->
      @scoped().select(arguments...)
    
    joins: ->
      @scoped().joins(arguments...)
    
    includes: ->
      @scoped().includes(arguments...)
      
    # Tile.paginate(perPage: 20, page: 3).where(title: "=~": "Hello").all()
    paginate: ->
      @scoped().paginate(arguments...)
    
    # GEO!  
    # Tile.within(3, origin: [42.12415, -81.3815719]).all()
    within: ->
      @scoped().within(arguments...)
    
    scoped: ->
      new Metro.Model.Scope(Metro.namespaced(@name))
    
    all: (query, callback) ->
      @store().all(query, callback)
  
    first: (query, callback) ->
      @store().first(query, callback)
  
    last: (query, callback) ->
      @store().last(query, callback)
    
    find: (id, callback) ->
      @store().find(id, callback)
    
    count: (query, callback) ->
      @store().count(query, callback)
    
    exists: (callback) ->
      @store().exists(callback)
  
module.exports = Metro.Model.Scopes
