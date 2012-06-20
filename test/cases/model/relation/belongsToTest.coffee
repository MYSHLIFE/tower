membership  = null
group       = null
user        = null

describeWith = (store) ->
  describe "Tower.Model.Relation.BelongsTo (Tower.Store.#{store.className()})", ->
    beforeEach (done) ->
      async.series [
        (callback) =>
          store.clean(callback)
        (callback) =>
          # maybe the store should be global..
          # there's a problem in relations with subclasses b/c type
          App.Page.store(store)
          App.Post.store(store)
          App.Child.store(store)
          App.Address.store(store)
          App.Parent.store(store)
          App.User.store(store)
          App.Membership.store(store)
          App.DependentMembership.store(store)
          App.Group.store(store)
          callback()
        (callback) =>
          App.User.insert firstName: "Lance", (error, record) =>
            user = record
            callback()
        (callback) =>
          App.Group.insert (error, record) =>
            group = record
            callback()
      ], done
      
    afterEach ->
      try App.Parent.insert.restore()
      try App.Group.insert.restore()
      try App.Membership.insert.restore()

    test 'create from hasMany', (done) ->
      App.User.create firstName: 'Lance', (error, user) ->
        user.get('articles').create rating: 8, (error, createdPost) =>
          App.Post.first (error, foundPost) =>
            assert.deepEqual createdPost.get('id').toString(), foundPost.get('id').toString()

            assert.ok !foundPost.get('user')

            App.User.count (error, count) =>
              assert.equal 2, count

              foundPost.fetch 'user', (error, foundUser) =>
                assert.deepEqual foundUser.get('articleIds')[0].toString(), foundPost.get('id').toString()
                assert.deepEqual foundUser.get('id').toString(), user.get('id').toString()
                assert.deepEqual foundPost.get('user').get('id').toString(), user.get('id').toString()
                done()

    # user.getAssociation('address').create
    # user.get('address')
    # user.createAssociation('address')
    # user.buildAssociation('address')
    test 'create from hasOne', (done) ->
      App.User.create firstName: 'Lance', (error, user) ->
        user.createAssocation 'address', city: 'San Francisco', (error, createdAddress) =>
          App.Address.first (error, foundAddress) =>
            assert.deepEqual createdAddress.get('id').toString(), foundAddress.get('id').toString()

            App.Address.count (error, count) =>
              assert.equal 1, count

              App.User.find user.get('id'), (error, user) =>
                assert.ok !user.get('address'), "there should not be an address loaded yet"

                user.fetch 'address', (error, foundAddress) =>
                  assert.deepEqual foundAddress.get('id').toString(), createdAddress.get('id').toString()
                  # now you can access it.
                  assert.deepEqual user.get('address').get('id').toString(), createdAddress.get('id').toString()

                  # need to handle reverse
                  # console.log foundAddress.get('user')
                  # and id portion:
                  # foundAddress.get('userId')
                  done()
    ###
    describe 'belongsTo', ->
      user = null
      post = null

      beforeEach (done) ->
        App.User.create firstName: 'Lance', (error, record) =>
          user = record
          user.get('posts').create rating: 8, (error, record) =>
            post = record
            done()

      test 'fetch', (done) ->
        done()
    ###
   
describeWith(Tower.Store.Mongodb) unless Tower.isClient