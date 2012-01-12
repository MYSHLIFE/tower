class Tower.Dispatch.Param.Array extends Tower.Dispatch.Param
  parse: (value) ->
    values  = []
    array   = value.toString().split(/[,\|]/)
    
    for string in array
      isRange   = false
      negation  = !!string.match(/^\^/)
      string    = string.replace(/^\^/, "")
      
      string.replace /([^\.]+)?(\.{2})([^\.]+)?/, (_, startsOn, operator, endsOn) =>
        isRange = true
        range   = []
        range.push @parseValue(startsOn, ["$gte"]) if !!(startsOn && startsOn.match(/^\d/))
        range.push @parseValue(endsOn, ["$lte"])   if !!(endsOn && endsOn.match(/^\d/))
        values.push range
      
      unless isRange
        values.push [@parseValue(string, ["$eq"])]
      
    values

module.exports = Tower.Dispatch.Param.Array
