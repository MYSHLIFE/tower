# Coach.js

> Full Stack Web Framework for Node.js.  Minified & Gzipped: 15.7kb

## Install

``` bash
npm install coach -d
```

## Generator

``` bash
coach new my-app
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

## Application

``` coffeescript
# config/application.coffee
class App extends Coach.Application
  @config.encoding = "utf-8"
  @config.filterParameters += ["password", "password_confirmation"]
  @config.loadPaths += ["./themes"]
```

## Models

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

## Routes

``` coffeescript
# config/routes.coffee
Coach.Route.draw ->
  @match "/login",         "sessions#new", via: "get", as: "login"
  
  @resources "posts", ->
    @resources "comments"
```

Routes are really just models, `Coach.Route`.  You can add and remove and search them however you like:

``` coffeescript
Coach.Route.where(pattern: "=~": "/posts").first()
```

## Views

The default templating engine is [CoffeeKup](http://coffeekup.org/), which is pure coffeescript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Coach.View.engine = "jade"` in `config/application`.  Coach uses [Shift.js](http://github.com/viatropos/shift.js), which is a normalized interface to most of the Node.js templating languages.

``` coffeescript
# app/views/layouts/application.coffee
doctype 5
html ->
  head ->
    meta charset: 'utf-8'
    title "#{@title or 'Untitled'} | My awesome website"
    meta name: 'description', content: @desc if @desc?
    link rel: 'stylesheet', href: '/stylesheets/application.css'
  body ->
    header ->
      h1 @title or 'Untitled'
      nav ->
        ul ->
          (li -> a href: '/', -> 'Home') unless @path is '/'
          li -> a href: '/chunky', -> 'Bacon!'
          switch @user.role
            when 'owner', 'admin'
              li -> a href: '/admin', -> 'Secret Stuff'
            when 'vip'
              li -> a href: '/vip', -> 'Exclusive Stuff'
            else
              li -> a href: '/commoners', -> 'Just Stuff'
    section ->
      yield()
    footer ->
      p shoutify('bye')
```

``` coffeescript
# app/views/posts/new.coffee
formFor @post, ->
  fieldset ->
    legend "Basic Info"
    field "title"
    field "body", as: "text"
  submit "Save"
```

Soon will add form and table builders.

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

## Test, Develop, Minify

``` bash
cake coffee
cake spec
cake minify
```

## License

(The MIT License)

Copyright &copy; 2011 - 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
