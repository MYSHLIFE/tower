Tower.View.ComponentHelper =
  formFor: ->
    Tower.View.Form.render(__ck, arguments...)
    
  tableFor: ->
    Tower.View.Table.render(__ck, arguments...)

module.exports = Tower.View.ComponentHelper
