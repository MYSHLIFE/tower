
Minified & Gzipped: 15.7kb

- https://github.com/powmedia/backbone-forms
- https://github.com/search?type=Repositories&language=JavaScript&q=validation&repo=&langOverride=&x=0&y=0&start_value=1
- http://happyjs.com/
- https://github.com/flatiron/director
- https://github.com/hij1nx/EventEmitter2

## Client Extensions

Have CachedCommons.org let you load files with `require('socket.io')`:

``` coffeescript
# coach/controllers/sockets
require('socket.io')

# essentially...
require = (key) ->
  $.getScript("http://cachedcommons.org/javascripts/#{key}.min.js")
```

- underscore.js
- underscore.string.js
- moment.js (date/time)
- mustache.js
- socket.io
- pluralization
- schema.org (https://github.com/indexzero/node-schema-org)
- geo: https://github.com/manuelbieh/Geolib
- tiny-require.js (browser + node)
  - useragent (npm install useragent)
  - shift.js (templating)
  - async.js (callbacks)
  - mimetypes

window.μ = new class Urban
αστικός, == Urban

> Attention All Passengers:  Client and server are merging...  You may now begin coding.

## Parts

- Core: Core extensions, base files, I18n
- Model + Store
- View + Controller + Middleware + Route
- Event
- Date, String, etc.

## Features

- `Store` layer to all popular databases, which just normalizes the data for the `Model` layer.
  - MongoDB
  - Redis
  - [Cassandra](https://github.com/wadey/node-thrift)
  - PostgreSQL
  - CouchDB
- `Model` layer with validations, sophisticated attribute management, associations, named and chainable scopes, etc.
- `Controller` layer that works pretty much exactly like the Rails controller system.
- `View` layer which works just like Rails
- `Route` layer, which handles mapping and finding routes
- `Event` layer, for callbacks and event management [todo]
- `Asset` layer, for asset compression pipeline just like Sprockets + Rails.  Handles image sprite creation too.
- `I18n` layer [todo]
- `Spec` layer for setting up tests for your app just like Rails.
- `Generator` [todo]
- `Component` layer, for building complex forms, tables, widgets, etc. [todo]
- `Template` layer, so you can swap out any template engines. In the [Node.js Shift Module](https://github.com/viatropos/shift.js).
- Can also use on the client:
  - Model
  - View
  - Controller
  - Route
  - Template
  - Support
- Optimized for the browser.

## Install

``` bash
npm install coach
```

To install Coach with development dependencies, use:

``` bash
npm install coach --dev # npm install coach -d
```

## Structure

``` bash
.
|-- app
|   |-- controllers
|   |   |-- admin
|   |   |   |-- postsController.coffee
|   |   |   `-- usersController.coffee
|   |   |-- postsController.coffee
|   |   |-- sessionsController.coffee
|   |   `-- usersController.coffee
|   |-- models
|   |   |-- post.coffee
|   |   `-- user.coffee
|   |-- views
|   |   |-- admin
|   |   |   `-- posts
|   |   |       |-- edit.jade
|   |   |       |-- index.jade
|   |   |       |-- new.jade
|   |   |-- layouts
|   |   |   `-- application.jade
|   |   |-- shared
|   |   `-- posts
|   |       |-- index.jade
|   |       `-- show.jade
|   `-- helpers
|       |-- admin
|       |   |-- postsHelper.coffee
|       |   `-- tagsHelper.coffee
|       `-- postsHelper.coffee
`-- config
|    |-- application.coffee
|    |-- locale
|        `-- en.coffee
|    |-- routes.coffee
`-- spec
|    |-- helper.coffee
|    |-- models
|    |   |-- postSpec.coffee
|    |   |-- userSpec.coffee
|    `-- acceptance
|        |-- login.coffee
|        |-- signup.coffee
|        `-- posts.coffee
```

## Tips

#### Create a namespace for your app.

This makes it so you don't have to use `require` everywhere on the client, setting the same variable over and over again.

``` coffeescript
class MyApp.User
  @include Coach.Model
```

or

``` coffeescript
class User
  @include Coach.Model

MyApp.User = User
```

Instead of

``` coffeescript
# user.coffee
class User
  @include Coach.Model

module.exports = User

# somewhere else
User = require('../app/models/user')
```

Because of the naming/folder conventions, you can get away with this without any worries.  It also decreases the final output code :)

## Generator

``` bash
coach new my-app
```

## App

``` coffeescript
# index.coffee
class Movement extends Coach.Application
```

## Routes

``` coffeescript
# config/routes.coffee
route "/login",         "sessions#new", via: "get", as: "login"
                        
route "/posts",         "posts#index", via: "get"
route "/posts/:id/edit","posts#edit", via: "get"
route "/posts/:id",     "posts#show", via: "get"
route "/posts",         "posts#create", via: "post"
route "/posts/:id",     "posts#update", via: "put"
route "/posts/:id",     "posts#destroy", via: "delete"
```

Routes are really just models, `Coach.Route`.  You can add and remove and search them however you like:

``` coffeescript
Coach.Route.where(pattern: "=~": "/posts").first()
```

## Models

``` coffeescript
class User
  @include Coach.Model
  
  @key "id"
  @key "firstName"
  @key "createdAt", type: "time"
  
  @scope "byMrBaldwin", @where firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> Coach.Support.Time.now().beginningOfWeek().toDate()
  
  @hasMany "posts", className: "Page"
  
  @validates "firstName", presence: true
```

Models have:

- validations
- named (and chainable) scopes
- attributes
- associations
- callbacks

``` coffeescript
User.where(firstName: "=~": "a").order(["firstName", "desc"]).all()
```

## Controllers

``` coffeescript
class PostsController extends Coach.Controller
  index: ->
    @posts = Post.all()
    
  new: ->
    @post = new Post
    
  create: ->
    @post = new Post(@params.post)
    
    super (success, failure) ->
      @success.html -> @render "posts/edit"
      @success.json -> @render text: "success!"
      @failure.html -> @render text: "Error", status: 404
      @failure.json -> @render text: "Error", status: 404
    
  show: ->
    @post = Post.find(@params.id)
    
  edit: ->
    @post = Post.find(@params.id)
    
  update: ->
    @post = Post.find(@params.id)
    
  destroy: ->
    @post = Post.find(@params.id)
```

## Store

There's a unified interface to the different types of stores, so you can use the model and have it transparently manage data.  For example, for the browser, you can use the memory store, and for the server, you can use the mongodb store.  Redis, PostgreSQL, and Neo4j are in the pipeline.

``` coffeescript
class PageView extents Coach.Model
  @store "redis"
```

## Views

Use any template framework for your views.  Includes [shift.js](http://github.com/viatropos/shift.js) which is a normalized interface on most of the Node.js templating languages.

Soon will add form and table builders.

## Web Sockets

Web Sockets work just like actions in controllers, using socket.io.

``` coffeescript
class ConnectionsController
  new: ->
    @emit text: "Welcome!"
  
  create: ->
    @broadcast user: params.id, text: params.text
    
  destroy: ->
    @emit text: "Adios"
```

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## History

Since all of the controller/routing code is available on the client, you can go directly through that system just like you would the server.

``` coffeescript
# Just request the url, and let it do it's thing
Coach.get '/posts'

# Same thing, this time passing parameters
Coach.get '/posts', createdAt: "2011-10-26..2011-10-31"

# Dynamic
Coach.urlFor(Post.first()) #=> "/posts/the-id"
Coach.navigate Coach.urlFor(post)
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Application

``` coffeescript
# config/application.coffee
class MyApp extends Coach.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
  
MyApp.Application.initialize()
```

## Watchfile

## Internationalization

The default interpolator is mustache.  You can swap that out with any template engine you want.

Should use https://github.com/olado/doT, which seems to be the fastest: http://jsperf.com/dom-vs-innerhtml-based-templating/253.

``` coffeescript
en:
  hello: "world"
  forms:
    titles:
      signup: "Signup"
  pages:
    titles:
      home: "Welcome to {{site}}"
  posts:
    comments:
      none: "No comments"
      one: "1 comment"
      other: "{{count}} comments"
  messages:
    past:
      none: "You never had any messages"
      one: "You had 1 message"
      other: "You had {{count}} messages"
    present:
      one: "You have 1 message"
    future:
      one: "You might have 1 message"
```

## Test, Development, Minify

``` bash
cake coffee
cake spec
cake minify
```

- https://github.com/rstacruz/js2coffee
- http://momentjs.com/
- http://sugarjs.com/
- http://rickharrison.github.com/validate.js/
- https://github.com/javve/list
- http://debuggable.com/posts/testing-node-js-modules-with-travis-ci:4ec62298-aec4-4ee3-8b5a-2c96cbdd56cb
- http://dtrace.org/resources/bmc/QCon.pdf
- http://derbyjs.com/
- http://www.html5rocks.com/en/tutorials/file/filesystem/
- https://github.com/gregdingle/genetify
- https://github.com/jquery/qunit

## Presenter

``` coffeescript
PostsPresenter =
  index: ->
```

## Research

These are projects that should either be integrated into Coach, or rewritten to decrease file size.

### Database

- https://github.com/zefhemel/persistencejs

### Routes & History

- https://github.com/balupton/history.js
- https://github.com/millermedeiros/crossroads.js

### Models

- https://github.com/maccman/spine
- https://github.com/biggie/biggie-orm

### Events

- http://millermedeiros.github.com/js-signals

### Payment Gateways

- https://github.com/jamescarr/paynode
- https://github.com/braintree/braintree_node

### Mailers

- https://github.com/marak/node_mailer

## Design Principles

### Minimize the number of methods

- less code to manage
- fewer methods to memorize
- smaller footprint (less code for the browser to download)
- differs from Rails
- opt-in helper method generation

```
model.buildRelation("user") # can opt into
# vs.
model.buildUser()
```

### Use double underscore `__name` for private/protected methods

### Use single underscore for Ruby-ish `bang!` methods: `_create()`.

### Organize the code so it can be compiled for the client

- put `module.exports = X` at the bottom of each file so it can be stripped with a regular expression.

### Create Underscore.js Compatible Helpers

- write helpers so they are independent of underscore but can be swapped.

## Model

``` coffeescript
class App.User extends Coach.Model
  @key "firstName"
  @key "createdAt", type: "Date", default: -> new Date()
  @key "coordinates", type: "Geo"
  
  @scope "byBaldwin", firstName: "=~": "Baldwin"
  @scope "thisWeek", @where createdAt: ">=": -> require('moment')().subtract('days', 7)
  
  @hasMany "posts", className: "App.Post", cache: true # postIds
  
  @validate "firstName", presence: true
  
class App.Post extends Coach.Model
  @belongsTo "author", className: "App.User"
  
User.where(createdAt: ">=": _(2).days().ago(), "<=": new Date()).within(radius: 2).desc("createdAt").asc("firstName").paginate(page: 5).all (error, records) =>
  @render json: User.toJSON(records)

# should handle these but doesn't yet.  
Post.includes("author").where(author: firstName: "=~": "Baldwin").all()
Post.includes("author").where("author.firstName": "=~": "Baldwin").all()
# userIds = User.where(firstName: "=~": "Baldwin").select("id")
# Post.where(authorId: $in: userIds).all()

User.includes("posts").where("posts.title": "Welcome").all()
```

## Controller

All controller actions are just events.  This means then that controllers handle events:

- DOM events
- socket messages
- url requests

Instead of having to create a controller for each type of message, why not just establish some conventions:

``` coffeescript
class PostsController extends Coach.Controller
  # url handler, just like Rails
  create: ->
    
  # socket.io handler
  @on "create", "syncCreate" # created by default... knows because it's named after an action
  @on "notification", "flashMessage" # knows it's socket because 'notification' isn't an action or dom event keyword
  @on "mousemove", "updateHeatMap", type: 'socket' # if you name a socket event after a keyword then pass the `type: 'socket'` option.
  
  # dom event handler
  @on "click", "click"
  @on "click .item a", "clickItem"
  # or as an object
  @on "click .itemA a": "clickItemA",
    "click .itemB a": "clickItemB",
    "click .itemC a": "clickItemC"
  
  @on "change #user-first-name-input", "enable", dependent: "#user-last-name-input"
  @on "change #user-first-name-input", "enable #user-last-name-input" # enable: (selector)
  @on "change #user-first-name-input", "validate"
  @on "change #user-first-name-input", bind: "firstName"
  @bind "change #user-first-name-input", "firstName"
  @on "click #add-user-address", "addAddress"
  @on "click #add-user-address", "add", object: "address"
  @on "click #remove-user-address", "removeAddress"
  # $(window).on('click', '#user-details', "toggleDetails");
  @on "click #user-details", "toggleDetails"

  # show or hide
  toggleShowHide: ->

  show: ->

  hide: ->

  toggleSelectDeselect: ->

  select: ->

  deselect: ->

  toggleAddRemove: ->

  add: ->

  remove: ->

  toggleEnableDisable: ->  
    if _.blank(value)
      @disable()
    else
      @enable()

  # enable or disable
  enable: ->
    $(options.dependent).attr("disabled", false)

  disable: ->
    $(options.dependent).attr("disabled", true)

  validate: (element) ->
    element

  invalidate: ->

  bind: ->
  
  next: ->
    
  prev: ->
```