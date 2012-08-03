# until ember supports npm...
require 'ember-metal-node'
require 'ember-runtime-node'
require 'ember-states-node'

require 'underscore.logger'

global._ = require 'underscore'
_.mixin(require('underscore.string'))

module.exports  = global.Tower = Tower = Ember.Namespace.create()

# reads and sets the latest version on startup
Tower.version = JSON.parse(require('fs').readFileSync(require('path').normalize("#{__dirname}/../../package.json"))).version

Tower.logger    = _console

# external libraries, to get around having to use `require` in the browser.
Tower.modules =
  validator:  require 'validator'
  accounting: require 'accounting'
  moment:     require 'moment'
  geo:        require 'geolib'
  inflector:  require 'inflection'
  async:      require 'async'
  superagent: require 'superagent'
  mime:       require 'mime'
  mint:       require 'mint'
  kue:        try require 'kue'
  coffeecup:  require 'coffeecup'
  socketio:   try require 'socket.io'
  sockjs:     try require 'sockjs'
  _:          _

require './support'
require './application'
require './server/application'
require './store'
require './server/store'
require './model'
require './server/model'
require './view'
require './controller'
require './server/controller'
require './controller/tst'
require './net'
require './server/net'
require './server/mailer'
require './middleware'
require './server/command'
require './server/generator'

Tower.watch = true

Tower.View.store(new Tower.Store.FileSystem(['app/views']))
Tower.root                = process.cwd()
Tower.publicPath          = process.cwd() + '/public'
Tower.publicCacheDuration = 60 * 1000
Tower.render              = (string, options = {}) ->
  Tower.modules.mint.render(options.type, string, options)

Tower.domain              = 'localhost'

Tower.run = (argv) ->
  (new Tower.Command.Server(argv)).run()
