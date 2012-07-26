# Tower.js <img src="http://i.imgur.com/e3VLW.png"/>

> Full Stack Web Framework for Node.js and the Browser.

Built on top of Node's Connect and Express, modeled after Ruby on Rails.  Built for the client and server from the ground up.

[![Build Status](https://secure.travis-ci.org/viatropos/tower.png)](http://travis-ci.org/viatropos/tower)

Follow me [@viatropos](http://twitter.com/viatropos).

- **IRC**: #towerjs on irc.freenode.net
- **Ask a question**: http://stackoverflow.com/questions/tagged/towerjs
- **Issues**: http://github.com/viatropos/tower/issues
- **Roadmap**: http://github.com/viatropos/tower/wiki/roadmap

Note, Tower is still very early alpha (0.4.0).  Check out the [roadmap](http://github.com/viatropos/tower/wiki/roadmap) to see where we're going.  If your up for it please contribute!  The 0.5.0 release will have most of the features and will be roughly equivalent to a beta release.  From there, it's performance optimization, workflow streamlining, and creating some awesome examples.  1.0 will be a plug-and-chug real-time app framework.

Tower is soon going to support only Node.js 0.8.0+. This stuff moves fast.

Master branch will always be functional, and for the most part in sync with the version installed through the npm registry.

## Default Development Stack

- Ember
- jQuery
- Handlebars (templating)
- Stylus (LESS is also supported)
- MongoDB (database)
- Redis (background jobs)
- Mocha (tests)
- CoffeeScript
- Twitter Bootstrap

Includes a database-agnostic ORM with browser (memory and ajax) and MongoDB support, modeled after ActiveRecord and Mongoid for Ruby.  Includes a controller architecture that works the same on both the client and server, modeled after Rails.  The routing API is pretty much exactly like Rails 3's.  Templates work on client and server as well (and you can swap in any template engine no problem).  Includes asset pipeline that works just like Rails 3's - minifies and gzips assets with an md5-hashed name for optimal browser caching, only if you so desire.  And it includes a watcher that automatically injects javascripts and stylesheets into the browser as you develop.  It solves a lot of our problems, hope it solves yours too.

## Install

``` bash
npm install express@2.x -g # temporary, for design.io
npm install design.io -g
npm install tower -g
```

If you want to hack around in the Tower source, install design.io locally.  It's not included in Tower's `package.json` because I haven't found a way for places like Heroku to ignore `"devDependencies"`, and it has a ruby dependency so I'm leaving it out for now.  Run this in the root directory of your locally cloned Tower repo:

```
npm install design.io design.io-javascripts
```

## Generate

```
tower new app
cd app
sudo npm install
tower generate scaffold Post title:string body:text
npm test
node server
```

If you run into an error during `npm install`, remove the `node_modules` folder and try again.

To restart your server automatically if it crashes, run with forever:

```
npm install forever -g
forever server.js
```

## Structure

Here's how you might organize a blog:

```
.
|-- app
|   |-- client
|   |   |-- stylesheets
|   |-- controllers
|   |   |-- admin
|   |   |   |-- postsController.coffee
|   |   |   `-- usersController.coffee
|   |   |-- commentsController.coffee
|   |   |-- postsController.coffee
|   |   |-- sessionsController.coffee
|   |   `-- usersController.coffee
|   |-- models
|   |   |-- comment.coffee
|   |   |-- post.coffee
|   |   `-- user.coffee
|   |-- views
|   |   |-- admin
|   |   |   `-- posts
|   |   |       |-- _form.coffee
|   |   |       |-- edit.coffee
|   |   |       |-- index.coffee
|   |   |       |-- new.coffee
|   |   |       |-- show.coffee
|   |   |-- layouts
|   |   |   `-- application.coffee
|   |   |-- shared
|   |   `-- posts
|   |       |-- index.coffee
|   |       `-- show.coffee
|   `-- helpers
|       |-- admin
|       |   |-- postsHelper.coffee
|       |   `-- usersHelper.coffee
|       `-- postsHelper.coffee
`-- config
|    |-- application.coffee
|    |-- assets.coffee
|    |-- databases.coffee
|    |-- environments
|       |-- development.coffee
|       |-- production.coffee
|       `-- test.coffee
|    |-- locale
|       `-- en.coffee
|    |-- routes.coffee
`-- test
|    |-- helper.coffee
|    |-- models
|    |   |-- postTest.coffee
|    |   |-- userTest.coffee
|    `-- acceptance
|        |-- login.coffee
|        |-- signup.coffee
|        `-- posts.coffee
```

## Application

``` coffeescript
# config/application.coffee
global.App = Tower.Application.create()
```

## Models

``` coffeescript
# app/models/user.coffee
class App.User extends Tower.Model
  @field "firstName", required: true
  @field "lastName"
  @field "email", format: /\w+@\w+.com/
  @field "activatedAt", type: "Date", default: -> new Date()
  
  @hasOne "address", embed: true
  
  @hasMany "posts"
  @hasMany "comments"
  
  @scope "recent", -> createdAt: ">=": -> _(3).days().ago().toDate()
  
  @validates "firstName", "email", presence: true
  
  @after "create", "welcome"
  
  welcome: ->
    Tower.Mailer.welcome(@).deliver()
```
``` coffeescript
# app/models/post.coffee
class App.Post extends Tower.Model
  @field "title"
  @field "body"
  @field "tags", type: ["String"], default: []
  @field "slug"
  
  @belongsTo "author", type: "User"
  
  @hasMany "comments", as: "commentable"
  @hasMany "commenters", through: "comments", type: "User"
  
  @before "validate", "slugify"
  
  slugify: ->
    @set "slug", @get("title").replace(/[^a-z0-9]+/g, "-").toLowerCase()
```
``` coffeescript
# app/models/comment.coffee
class App.Comment extends Tower.Model
  @field "message"
  
  @belongsTo "author", type: "User"
  @belongsTo "commentable", polymorphic: true
```
``` coffeescript
# app/models/address.coffee
class App.Address extends Tower.Model
  @field "street"
  @field "city"
  @field "state"
  @field "zip"
  @field "coordinates", type: "Geo"
  
  @belongsTo "user", embed: true
```

### Chainable Scopes, Queries, and Pagination

``` coffeescript
App.User
  .where(createdAt: ">=": _(2).days().ago(), "<=": new Date())
  .desc("createdAt")
  .asc("firstName")
  .paginate(page: 5)
  .all()
```

### Associations

``` coffeescript
user  = App.User.first()

# hasMany "posts"
posts = user.posts().where(title: "First Post").first()
post  = user.posts().build(title: "A Post!")
post  = user.posts().create(title: "A Saved Post!")
posts = user.posts().all()

post  = App.Post.first()

# belongsTo "author"
user  = post.author()
```

### Validations

``` coffeescript
user = App.User.build()
user.save() #=> false
user.errors #=> {"email": ["Email must be present"]}
user.email  = "me@gmail.com"
user.save() #=> true
user.errors #=> {}
```

## Routes

``` coffeescript
# config/routes.coffee
App.routes ->
  @match "/login", "sessions#new", via: "get", as: "login"
  @match "/logout", "sessions#destroy", via: "get", as: "logout"
  
  @resources "posts", ->
    @resources "comments"
    
  @namespace "admin", ->
    @resources "users"
    @resources "posts", ->
      @resources "comments"
      
  @constraints subdomain: /^api$/, ->
    @resources "posts", ->
      @resources "comments"
      
  @match "(/*path)", to: "application#index", via: "get"
```

## Views

Views adhere to the [Twitter Bootstrap 2.x](http://twitter.github.com/bootstrap/) markup conventions.

### Forms

``` html
# app/client/templates/posts/new.ejs
<form>
  <fieldset>
    <legend></legend>
    <input name="post[title]" />
    <textarea name="post[body]" ></textarea>
    <input type="submit" />
  </fieldset>
</form>
```

### Tables

``` html
<!--  app/client/templates/posts/index.hbs -->
tableFor "posts", (t) ->
  t.head ->
    t.row ->
      t.cell "title", sort: true
      t.cell "body", sort: true
      t.cell()
      t.cell()
      t.cell()
  t.body ->
    for post in @posts
      t.row ->
        t.cell post.get("title")
        t.cell post.get("body")
        t.cell linkTo 'Show', post
        t.cell linkTo 'Edit', Tower.urlFor(post, action: "edit")
        t.cell linkTo 'Destroy', post, method: "delete"
  linkTo 'New Post', Tower.urlFor(App.Post, action: "new")
```

### Layouts

``` html
<!DOCTYPE html>
<html>
  <head>  
    {{meta charset="utf-8"}}
    {{title}}
    {{meta name=description contentLocale="description"}}
    {{meta name=keywords contentLocale="keywords"}}
    {{meta name=robots contentLocale="robots"}}
    {{meta name=author contentLocale="author"}}
    {{link href=/favicon.png rel="icon shortcut-icon favicon"}} 

    {{stylesheets application}}
    {{javascripts vendor lib application}}
    {{#if Tower.isDevelopment}}
      {{javascripts development}}
    {{/if}}
  </head>
  <body>
    <script>
      App.bootstrap({{json bootstrapData}})
    </script>
  </body>
</html>
```

The default templating engine is [CoffeeCup](http://easydoc.org/coffeecup), which is pure CoffeeScript.  It's much more powerful than Jade, and it's just as performant if not more so.  You can set Jade or any other templating engine as the default by setting `Tower.View.engine = "jade"` in `config/application`.  Tower uses [Mint.js](http://github.com/viatropos/mint.js), which is a normalized interface to most of the Node.js templating languages.

## Styles

It's all using Twitter Bootstrap, so check out their docs.  http://twitter.github.com/bootstrap/

## Controllers

``` coffeescript
# app/controllers/postsController.coffee
class App.PostsController extends Tower.Controller
  index: ->
    App.Post.all (error, posts) =>
      @render "index", locals: posts: posts
    
  new: ->
    @post = new App.Post
    @render "new"
    
  create: ->
    @post = new App.Post(@params.post)
    
    super (success, failure) ->
      @success.html => @render "posts/edit"
      @success.json => @render text: "success!"
      @failure.html => @render text: "Error", status: 404
      @failure.json => @render text: "Error", status: 404
    
  show: ->
    App.Post.find @params.id, (error, post) =>
      @render "show"
    
  edit: ->
    App.Post.find @params.id, (error, post) =>
      @render "edit"
    
  update: ->
    App.Post.find @params.id, (error, post) =>
      post.updateAttributes @params.post, (error) =>
        @redirectTo action: "show"
    
  destroy: ->
    App.Post.find @params.id, (error, post) =>
      post.destroy (error) =>
        @redirectTo action: "index"
```

Actually, all that's built in!  So for the simple case you don't even need to write anything in your controllers (skinny controllers, fat models).  The default implementation is actually a lot more robust than that, just wanted to show a simple example.

## Databases

``` coffeescript
# config/databases.coffee
module.exports =
  mongodb:
    development:
      name: "app-development"
      port: 27017
      host: "127.0.0.1"
    test:
      name: "app-test"
      port: 27017
      host: "127.0.0.1"
    staging:
      name: "app-staging"
      port: 27017
      host: "127.0.0.1"
    production:
      name: "app-production"
      port: 27017
      host: "127.0.0.1"
```

## Mailers

``` coffeescript
class App.Notification extends Tower.Mailer
  # app/views/mailers/welcome.coffee template
  @welcome: (user) ->
    @mail to: user.email, from: "me@gmail.com"
```

## Internationalization

``` coffeescript
# config/locales/en.coffee
module.exports =
  hello: "world"
  forms:
    titles:
      signup: "Signup"
  pages:
    titles:
      home: "Welcome to %{site}"
  posts:
    comments:
      none: "No comments"
      one: "1 comment"
      other: "%{count} comments"
  messages:
    past:
      none: "You never had any messages"
      one: "You had 1 message"
      other: "You had %{count} messages"
    present:
      one: "You have 1 message"
    future:
      one: "You might have 1 message"
```

## Helpers

Since all of the controller/routing code is available on the client, you can go directly through that system just like you would the server.

``` coffeescript
# Just request the url, and let it do it's thing
Tower.get '/posts'

# Same thing, this time passing parameters
Tower.get '/posts', createdAt: "2011-10-26..2011-10-31"

# Dynamic
Tower.urlFor(Post.first()) #=> "/posts/the-id"
```

Those methods pass through the router and client-side middleware so you have access to `request` and `response` objects like you would on the server.

## Middleware

It's built on [connect](http://github.com/sencha/connect), so you can use any of the middleware libs out there.

## Assets

``` coffeescript
# config/assets.coffee
module.exports =
  javascripts:
    vendor: [
      "/vendor/javascripts/jquery.js"
      "/vendor/javascripts/underscore.js"
      "/vendor/javascripts/socket.io"
      "/vendor/javascripts/tower.js"
    ]
    
    lib: [
      "/lib/grid.js"
      "/lib/profiler.js"
    ]
    
    application: [
      "/app/models/post.js"
      "/app/models/comment.js"
    ]
    
  stylesheets:
    vendor: [
      "/vendor/stylesheets/reset.css"
    ]
    application: [
      "/app/assets/stylesheets/application.css"
      "/app/assets/stylesheets/theme.css"
    ]
```

All assets are read from `/public`, which is the compiled output of everything in `/app`, `/lib`, `/vendor`, and wherever else you might put things.  The default is to use stylus for css in `/app/assets/stylesheets`.

By having this `assets.coffee` file, you can specify exactly how you want to compile your files for the client so it's as optimized and cacheable as possible in production.

### Minify and Gzip

``` bash
cake assets:compile
```

### Push to S3

``` bash
cake assets:publish
```

## Watchfile

``` coffeescript
require('design.io').extension('watchfile')

# stylesheet watcher
require("design.io-stylesheets")
  ignore: /(public|node_modules|zzz|less)/
  outputPath: (path) ->
    "public/stylesheets/#{path}".replace(/\.(css|styl|less)$/, ".css")

# javascript watcher
require("design.io-javascripts")
  ignore:   /(public|node_modules|server|spec.*[sS]pec)/
  outputPath: (path) ->
    "public/javascripts/#{path}".replace(/\.(js|coffee)$/, ".js")
    
watch /app\/views\/.+\.mustache/
  update: (path) ->
    # do anything!
```

## Test

``` bash
npm test
```

## Examples

- [towerjs.org (project site)](https://github.com/viatropos/towerjs.org)

## License

(The MIT License)

Copyright &copy; 2012 [Lance Pollard](http://twitter.com/viatropos) &lt;lancejpollard@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## Unsolved Complexities

- Handling transactions from the client. How would you save the data for credit/account (subtract one record, add to another) so if one fails both revert back (if you try to keep it simplified and only POST individual records at a time)? You can do embedded models on MongoDB, and transactions on MySQL perhaps. Then if `acceptsNestedAttributesFor` is specified it will send nested data in JSON POST rather than separate. Obviously it's better to not do this on the server, but we should see if it's possible to do otherwise, and if not, publicize why.

## Decisions (need to finalize)

- for uniqueness validation, if it fails on the client, should it try fetching the record from the server? (and loading the record into the client memory store). Reasons for include having to do less work as a coder (lazy loads data). Reasons against include making HTTP requests to the server without necessarily expecting to - or you may not want it to fetch. Perhaps you can specify an option (`lazy: true`) or something, and on the client if true it will make the request (or `autofetch: true`)
- For non-transactional (yet still complex) associations, such as `group hasMany users through memberships`, you can save one record at a time, so the client should be instant. But if the first record created fails (say you do `group.members.create()`, which creates a user, then a membership tying the two together), what should the client tell the user? Some suggest a global notification (perhaps an alert bar) saying a more generic message such as "please refresh the page, some data is out of sync". But if the data is very important, ideally the code would know how to take the user (who might click this notification) to a form to try saving the `hasMany through` association again. If it continues to fail, it's probably either a bug in the code, or we should be able to know if the server is having issues (like it's crashed or power went out) - then if it's a bug we can have them notify us (some button perhaps) or if it's a real server problem we prepared for we can notify something like "sorry, having server issues, try again later". Other that that, it's up to you to build the validations properly so the data is saved

## Todo

- refactor attachments
- test redis queue
- s3 store
- redis store
- embedded documents
- test jsonp
- remove/replace/update design.io (watch tasks)
- default templates: eco
- add ability to use pure javascript (no coffeescript). default templates: ejs
- handlebars on client
- allow not using any database
- redis data store
- make store be reused between models, not per model
- should we rename app/views to app/templates (since views are now Ember.View and Ember templates are templates?)
- have application autoload lib folders
- use require in the browser to lazy load scripts
- gruntjs
- term-css