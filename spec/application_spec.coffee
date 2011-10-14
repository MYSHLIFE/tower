Metro  = require('../lib/metro')
# http://visionmedia.github.com/expresso/

describe "application", ->
  beforeEach ->
    @application = Metro.Application.bootstrap()
    
  it "should be configured", ->
    expect(Metro.Asset.config.path).toEqual "#{Metro.root}/public/assets"
    
  it "should load routes", ->
    expect(Metro.Application.routes().set.length).toEqual 1
    
  it "should load models", ->
    expect(Post).toBeTruthy()
  
  it "should load controllers", ->
    expect(ApplicationController).toBeTruthy()
    expect(PostsController).toBeTruthy()
    
  it "should respond to requests", ->
    console.log @application.app