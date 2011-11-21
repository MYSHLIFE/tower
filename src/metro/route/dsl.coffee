###
* Metro.Route.DSL
###
class Metro.Route.DSL
  match: ->
    @scope ||= {}
    Metro.Route.create(new Metro.Route(@_extractOptions(arguments...)))
    
  get: ->
    @matchMethod("get", arguments...)
    
  post: ->
    @matchMethod("post", arguments...)
    
  put: ->
    @matchMethod("put", arguments...)
    
  delete: ->
    @matchMethod("delete", arguments...)
    
  matchMethod: (method) ->
    options = arguments.pop()
    options.via = method
    arguments.push(options)
    @match(options)
    @
    
  scope: ->
    
  controller: (controller, options, block) ->
    options.controller = controller
    @scope(options, block)
  
  ###
  * Scopes routes to a specific namespace. For example:
  * 
  * ```coffeescript
  * namespace "admin", ->
  *   resources "posts"
  * ```
  * 
  * This generates the following routes:
  * 
  *       adminPosts GET    /admin/posts(.:format)          admin/posts#index
  *       adminPosts POST   /admin/posts(.:format)          admin/posts#create
  *    newAdminPost GET    /admin/posts/new(.:format)      admin/posts#new
  *   editAdminPost GET    /admin/posts/:id/edit(.:format) admin/posts#edit
  *        adminPost GET    /admin/posts/:id(.:format)      admin/posts#show
  *        adminPost PUT    /admin/posts/:id(.:format)      admin/posts#update
  *        adminPost DELETE /admin/posts/:id(.:format)      admin/posts#destroy
  * 
  * ## Options
  * 
  * The +:path+, +:as+, +:module+, +:shallowPath+ and +:shallowPrefix+
  * options all default to the name of the namespace.
  * 
  * For options, see <tt>Base#match</tt>. For +:shallowPath+ option, see
  * <tt>Resources#resources</tt>.
  * 
  * ## Examples
  * 
  * ``` coffeescript
  * # accessible through /sekret/posts rather than /admin/posts
  * namespace "admin", path: "sekret", ->
  *   resources "posts"
  * 
  * # maps to <tt>Sekret::PostsController</tt> rather than <tt>Admin::PostsController</tt>
  * namespace "admin", module: "sekret", ->
  *   resources "posts"
  * 
  * # generates +sekretPostsPath+ rather than +adminPostsPath+
  * namespace "admin", as: "sekret", ->
  *   resources "posts"
  * ```
  * 
  * @param {String} path
  ###
  namespace: (path, options, block) ->
    options = _.extend(path: path, as: path, module: path, shallowPath: path, shallowPrefix: path, options)
    @scope(options, block)
    
  # === Parameter Restriction
  # Allows you to constrain the nested routes based on a set of rules.
  # For instance, in order to change the routes to allow for a dot character in the +id+ parameter:
  #
  #   constraints id: /\d+\.\d+, ->
  #     resources "posts"
  #
  # Now routes such as +/posts/1+ will no longer be valid, but +/posts/1.1+ will be.
  # The +id+ parameter must match the constraint passed in for this example.
  #
  # You may use this to also restrict other parameters:
  #
  #   resources "posts", ->
  #     constraints postId: /\d+\.\d+, ->
  #       resources "comments"
  #
  # === Restricting based on IP
  #
  # Routes can also be constrained to an IP or a certain range of IP addresses:
  #
  #   constraints ip: /192.168.\d+.\d+/, ->
  #     resources "posts"
  #
  # Any user connecting from the 192.168.* range will be able to see this resource,
  # where as any user connecting outside of this range will be told there is no such route.
  constraints: (options, block) ->
    @scope(constraints: options, block)
    
  # Allows you to set default parameters for a route, such as this:
  # 
  #   defaults id: 'home', ->
  #     match 'scopedPages/(:id)', to: 'pages#show'
  # 
  # Using this, the `:id` parameter here will default to 'home'.
  defaults: (options, block) ->
    @scope(defaults: options, block)
  
  # Sometimes, you have a resource that clients always look up without
  # referencing an ID. A common example, /profile always shows the
  # profile of the currently logged in user. In this case, you can use
  # a singular resource to map /profile (rather than /profile/:id) to
  # the show action:
  #
  #   resource "geocoder"
  #
  # creates six different routes in your application, all mapping to
  # the +GeoCoders+ controller (note that the controller is named after
  # the plural):
  #
  #   GET     /geocoder/new
  #   POST    /geocoder
  #   GET     /geocoder
  #   GET     /geocoder/edit
  #   PUT     /geocoder
  #   DELETE  /geocoder
  #
  # === Options
  # Takes same options as +resources+.
  resource: ->
  
  # In Rails, a resourceful route provides a mapping between HTTP verbs
  # and URLs and controller actions. By convention, each action also maps
  # to particular CRUD operations in a database. A single entry in the
  # routing file, such as
  #
  #   resources "photos"
  #
  # creates seven different routes in your application, all mapping to
  # the +Photos+ controller:
  #
  #   GET     /photos/new
  #   POST    /photos
  #   GET     /photos/:id
  #   GET     /photos/:id/edit
  #   PUT     /photos/:id
  #   DELETE  /photos/:id
  #
  # Resources can also be nested infinitely by using this block syntax:
  #
  #   resources "photos", ->
  #     resources "comments"
  #
  # This generates the following comments routes:
  #
  #   GET     /photos/:photoId/comments/new
  #   POST    /photos/:photoId/comments
  #   GET     /photos/:photoId/comments/:id
  #   GET     /photos/:photoId/comments/:id/edit
  #   PUT     /photos/:photoId/comments/:id
  #   DELETE  /photos/:photoId/comments/:id
  #
  # === Options
  # Takes same options as <tt>Base#match</tt> as well as:
  #
  # [:pathNames]
  #   Allows you to change the paths of the seven default actions.
  #   Paths not specified are not changed.
  #
  #     resources "posts", pathNames: {new: "brandNew"}
  #
  #   The above example will now change /posts/new to /posts/brandNew
  #
  # [:only]
  #   Only generate routes for the given actions.
  #
  #     resources "cows", only: "show"
  #     resources "cows", only: ["show", "index"]
  #
  # [:except]
  #   Generate all routes except for the given actions.
  #
  #     resources :cows, :except => :show
  #     resources :cows, :except => [:show, :index]
  #
  # [:shallow]
  #   Generates shallow routes for nested resource(s). When placed on a parent resource,
  #   generates shallow routes for all nested resources.
  #
  #     resources "posts", shallow: true, ->
  #       resources "comments"
  #
  #   Is the same as:
  #
  #     resources :posts do
  #       resources :comments, :except => [:show, :edit, :update, :destroy]
  #     end
  #     resources :comments, :only => [:show, :edit, :update, :destroy]
  #
  #   This allows URLs for resources that otherwise would be deeply nested such
  #   as a comment on a blog post like <tt>/posts/a-long-permalink/comments/1234</tt>
  #   to be shortened to just <tt>/comments/1234</tt>.
  #
  # [:shallowPath]
  #   Prefixes nested shallow routes with the specified path.
  #
  #     scope shallowPath: "sekret", ->
  #       resources "posts", ->
  #         resources "comments", shallow: true
  #
  #   The +comments+ resource here will have the following routes generated for it:
  #
  #     postComments    GET    /posts/:postId/comments(.:format)
  #     postComments    POST   /posts/:postId/comments(.:format)
  #     newPostComment GET    /posts/:postId/comments/new(.:format)
  #     editComment     GET    /sekret/comments/:id/edit(.:format)
  #     comment          GET    /sekret/comments/:id(.:format)
  #     comment          PUT    /sekret/comments/:id(.:format)
  #     comment          DELETE /sekret/comments/:id(.:format)
  #
  # === Examples
  #
  #   # routes call <tt>Admin::PostsController</tt>
  #   resources "posts", module: "admin"
  #
  #   # resource actions are at /admin/posts.
  #   resources "posts", path: "admin/posts"
  resources: ->
  
  # To add a route to the collection:
  #
  #   resources "photos", ->
  #     collection ->
  #       get 'search'
  #
  # This will enable Rails to recognize paths such as <tt>/photos/search</tt>
  # with GET, and route to the search action of +PhotosController+. It will also
  # create the <tt>searchPhotosUrl</tt> and <tt>searchPhotosPath</tt>
  # route helpers.
  collection: ->
  
  # To add a member route, add a member block into the resource block:
  #
  #   @resources "photos", ->
  #     @member ->
  #       @get 'preview'
  #
  # This will recognize <tt>/photos/1/preview</tt> with GET, and route to the
  # preview action of +PhotosController+. It will also create the
  # <tt>previewPhotoUrl</tt> and <tt>previewPhotoPath</tt> helpers.
  member: ->
    
  root: (options) ->
    @match '/', _.extend(as: "root", options)
    
  _extractOptions: ->
    path            = Metro.Route.normalizePath(arguments[0])
    options         = arguments[arguments.length - 1] || {}
    options.path    = path
    format          = @_extractFormat(options)
    options.path    = @_extractPath(options)
    method          = @_extractRequestMethod(options)
    constraints     = @_extractConstraints(options)
    defaults        = @_extractDefaults(options)
    controller      = @_extractController(options)
    anchor          = @_extractAnchor(options)
    name            = @_extractName(options)
    
    options         = _.extend options,
      method:         method
      constraints:    constraints
      defaults:       defaults
      name:           name
      format:         format
      controller:     controller
      anchor:         anchor
      ip:             options.ip
    
    options
    
  _extractFormat: (options) ->
    
  _extractName: (options) ->
    options.as
    
  _extractConstraints: (options) ->
    options.constraints || {}
    
  _extractDefaults: (options) ->
    options.defaults || {}
    
  _extractPath: (options) ->
    "#{options.path}.:format?"
    
  _extractRequestMethod: (options) ->
    options.via || options.requestMethod
  
  _extractAnchor: (options) ->
    options.anchor
    
  _extractController: (options) ->
    to = options.to.split('#')
    if to.length == 1
      action = to[0]
    else
      controller  = to[0]
      action      = to[1]
    
    controller   ||= (options.controller || @scope.controller)
    action       ||= (options.action || @scope.action)
    
    controller  = controller.toLowerCase().replace(/(?:[cC]ontroller)?$/, "Controller")
    action      = action.toLowerCase()
    
    name: controller, action: action, className: Metro.Support.String.camelize("_#{controller}")

module.exports = Metro.Route.DSL
