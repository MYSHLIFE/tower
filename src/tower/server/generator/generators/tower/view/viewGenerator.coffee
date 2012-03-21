class Tower.Generator.ViewGenerator extends Tower.Generator
  sourceRoot: __dirname

  run: ->
    @directory "app/views/#{@view.directory}"

    views = [
      "_form",
      "_item",
      "_list",
      "_table",
      "edit",
      "index",
      "new",
      "show"
    ]

    for view in views
      @template "#{view}.coffee", "app/views/#{@view.directory}/#{view}.coffee"

module.exports = Tower.Generator.ViewGenerator
