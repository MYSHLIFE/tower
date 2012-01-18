Tower.Store.Memory.Finders =
  find: (query, options, callback) ->
    result  = []
    records = @records
    self    = @
    
    if Tower.Support.Object.isPresent(query)
      sort    = options.sort
      limit   = options.limit || Tower.Store.defaultLimit
      
      for key, record of records
        result.push(record) if @matches(record, query)
        # break if result.length >= limit
      
      result = @sort(result, sort) if sort
      
      result = result[0..limit - 1] if limit
    else
      for key, record of records
        result.push(record)
    
    callback.call(self, null, result) if callback
    
    result
    
  findOne: ->
  
  first: (query, options, callback) ->
    record = null
    @find query, options, (error, records) -> 
      record = records[0]
      callback.call(@, error, record) if callback
    record
  
  last: (query, options, callback) ->
    record = null
    @find query, options, (error, records) -> 
      record = records[records.length - 1]
      callback.call(@, error, record) if callback
    record
  
  count: (query, options, callback) ->
    result = 0
    
    @find query, options, (error, records) -> 
      result = records.length
      callback.call(@, error, result) if callback
      
    result
    
  # store.sort [{one: "two", hello: "world"}, {one: "four", hello: "sky"}], [["one", "asc"], ["hello", "desc"]]
  sort: ->
    Tower.Support.Array.sortBy(arguments...)
    
module.exports = Tower.Store.Memory.Finders
