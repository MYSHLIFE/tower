require 'tower'

task 'environment', ->
  Tower.env = 'production'
  Tower.Application.instance().initialize()

task 'tower:initializers', ->
  