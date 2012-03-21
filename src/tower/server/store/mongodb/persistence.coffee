Tower.Store.MongoDB.Persistence =
  create: (attributes, options, callback) ->
    record      = @serializeModel(attributes)
    attributes  = @serializeAttributesForCreate(attributes)
    options     = @serializeOptions(options)

    @collection().insert attributes, options, (error, docs) =>
      doc       = docs[0]
      record.set("id", doc["_id"])
      record.persistent = !!!error
      callback.call(@, error, record.attributes) if callback

    record.set("id", attributes["_id"])

    record

  update: (updates, conditions, options, callback) ->
    updates         = @serializeAttributesForUpdate(updates)
    conditions      = @serializeQuery(conditions)
    options         = @serializeOptions(options)

    options.safe    = true unless options.hasOwnProperty("safe")
    options.upsert  = false unless options.hasOwnProperty("upsert")
    # update multiple docs, b/c it defaults to false
    options.multi   = true unless options.hasOwnProperty("multi")

    @collection().update conditions, updates, options, (error) =>
      callback.call(@, error) if callback

    @

  destroy: (conditions, options, callback) ->
    conditions      = @serializeQuery(conditions)
    options         = @serializeOptions(options)

    @collection().remove conditions, options, (error) =>
      callback.call(@, error) if callback

    @

module.exports = Tower.Store.MongoDB.Persistence
