Metro   = require('../lib/metro')
fs      = require('fs')

describe "compilers", ->
  describe "stylus", ->
    it "should compile stylus", ->
      template = new Metro.Compilers.Stylus
      result = template.compile "./spec/fixtures/stylesheets/stylus.styl"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/stylus.css", 'utf8')
        
  describe "jade", ->
    it "should compile jade", ->
      template = new Metro.Compilers.Jade
      template.compile "./spec/fixtures/views/jade.jade", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/jade.html", 'utf8')
  
  describe "haml", ->
    it "should compile haml", ->
      template = new Metro.Compilers.Haml
      template.compile "./spec/fixtures/views/haml.haml", (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/haml.html", 'utf8')
  
  describe "ejs", ->
    it "should compile ejs", ->
      template = new Metro.Compilers.Ejs
      template.compile "./spec/fixtures/views/ejs.ejs", {locals: {name: "My Name"}}, (error, result) ->
        expect(result).toEqual fs.readFileSync("./spec/fixtures/views/ejs.html", 'utf8')
  
  describe "coffee_script", ->
    it "should compile coffee script", ->
      template = new Metro.Compilers.CoffeeScript
      result = template.compile "./spec/fixtures/javascripts/coffee.coffee", {locals: {name: "My Name"}}
      expect(result).toEqual fs.readFileSync("./spec/fixtures/javascripts/coffee.js", 'utf8')
  
  describe "less", ->
    it "should compile less", ->
      template = new Metro.Compilers.Less
      result = template.compile "./spec/fixtures/stylesheets/less.less"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/less.css", 'utf8')
      
  # describe "scss", ->
  #   it "should compile scss", ->
  #     template = new Metro.Compilers.Scss
  #     result = template.compile "./spec/fixtures/stylesheets/scss.scss"
  #     expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/scss.css", 'utf8')
  
  describe "mustache", ->
    it "should compile mustache", ->
      template = new Metro.Compilers.Mustache
      locals = {name: "World", say_hello: -> "Hello" }
      result = template.compile "./spec/fixtures/views/mustache.mustache", locals: locals
      expect(result).toEqual fs.readFileSync("./spec/fixtures/views/mustache.html", 'utf8')
      
  describe "sass", ->
    it "should compile sass", ->
      template = new Metro.Compilers.Sass
      result = template.compile "./spec/fixtures/stylesheets/sass.sass"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/stylesheets/sass.css", 'utf8')
      
  describe "markdown", ->
    it "should compile markdown", ->
      template = new Metro.Compilers.Markdown
      result = template.compile "./spec/fixtures/docs/markdown.markdown"
      expect(result).toEqual fs.readFileSync("./spec/fixtures/docs/markdown.html", 'utf8')
      