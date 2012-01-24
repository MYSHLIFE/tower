class Tower.Generator.AppGenerator extends Tower.Generator
  sourceRoot: __dirname
  
  buildProject: (name = @projectName) ->
    project = super(name)
    
    project.title       = @program.title || Tower.Support.String.camelize(project.name)
    project.description = @program.description
    project.keywords    = @program.keywords
    
    project
  
  run: ->
    @inside @project.name, '.', ->
      @template ".gitignore" unless @program.skipProcfile
      @template ".npmignore"
      @template ".slugignore" unless @program.skipProcfile
      
      @template "Cakefile"
      
      @inside "app", ->
        @inside "client", ->
          @inside "config", ->
            @template "application.coffee"
          @directory "helpers"
          @inside "stylesheets", ->
            @template "application.styl"
          @inside "controllers", ->
            @template "applicationController.coffee"
          
        @inside "controllers", ->
          @template "applicationController.coffee"
        
        @inside "helpers", ->
          @template "applicationHelper.coffee"
          
        @directory "mailers"
        
        @directory "models"
      
        @inside "views", ->
          @template "index.coffee"
          @inside "layouts", ->
            @template "application.coffee"
          @inside "shared", ->
            @template "_footer.coffee"
            @template "_header.coffee"
            @template "_meta.coffee"
            @template "_navigation.coffee"
            @template "_sidebar.coffee"
    
      @inside "config", ->
        @template "application.coffee"
        @template "assets.coffee"
        @template "credentials.coffee"
        @template "databases.coffee"
        @template "routes.coffee"
        @template "session.coffee"
        
        @inside "environments", ->
          @template "development.coffee"
          @template "production.coffee"
          @template "test.coffee"
        
        @directory "initializers"
        
        @inside "locales", ->
          @template "en.coffee"
        
      @inside "lib", ->
        @directory "tasks"
        @inside "stylesheets", ->
          @template "code.styl"
          @template "forms.styl"
          @template "mixins.styl"
          @template "reset.styl"
          @template "tables.styl"
          @template "typography.styl"
          @template "variables.styl"
      
      @directory "log"
    
      @template "pack", "package.json"
      @template "Procfile" unless @program.skipProcfile
      
      @inside "public", ->
        @template "404.html"
        @template "500.html"
        @template "favicon.ico"
        @template "crossdomain.xml"
        @template "humans.txt"
        @template "robots.txt"
        @inside "javascripts", ->
          @inside "app", ->
            @inside "views", ->
              @createFile "templates.js", ""
      
      @template "README.md"
      
      @template "server.js"
      
      @inside "test", ->
        @directory "controllers"
        @directory "factories"
        @directory "features"
        @directory "models"
        @template "config.coffee"
    
      @directory "tmp"
    
      @inside "vendor", ->
        @inside "javascripts", ->
          @get "https://raw.github.com/documentcloud/underscore/master/underscore.js", "underscore.js"
          @get "https://raw.github.com/epeli/underscore.string/master/lib/underscore.string.js", "underscore.string.js"
          @get "https://raw.github.com/caolan/async/master/lib/async.js", "async.js"
          @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/socket.io.js", "socket.io.js"
          @get "https://raw.github.com/viatropos/design.io/master/design.io.js", "design.io.js"
          @get "https://raw.github.com/viatropos/tower.js/master/dist/tower.js", "tower.js"
          @get "https://raw.github.com/balupton/history.js/master/scripts/uncompressed/history.js", "history.js"
          @get "https://raw.github.com/timrwood/moment/master/moment.js", "moment.js"
          @get "https://raw.github.com/medialize/URI.js/gh-pages/src/URI.js", "uri.js"
          @get "https://raw.github.com/visionmedia/mocha/master/mocha.js", "mocha.js"
          @get "http://coffeekup.org/coffeekup.js", "coffeekup.js"
        @directory "stylesheets"
        @inside "swfs", ->
          @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMain.swf", "WebSocketMain.swf"
          @get "https://raw.github.com/LearnBoost/socket.io-client/master/dist/WebSocketMainInsecure.swf", "WebSocketMainInsecure.swf"
    
      @template "Watchfile"
  
module.exports = Tower.Generator.AppGenerator
