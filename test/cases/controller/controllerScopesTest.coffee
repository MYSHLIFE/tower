class App.Controller_Scopes_MetdataController extends Tower.Controller
  @resource 'post'

  currentUser: Ember.computed ->
    user = App.User.build()
    user.set('id', 5)
    user

describe 'Tower.Controller.Scopes', ->
  C = App.Controller_Scopes_MetdataController

  beforeEach ->
    C.metadata().scopes = {}
    C.metadata().scopeNames = []
    C._instance = undefined

  test 'metadata', ->
    assert.deepEqual {}, C.metadata().scopes

  describe '@scope', ->
    test 'App.Post', ->
      C.scope App.Post

      assert.deepEqual _.keys(C.metadata().scopes), ['all']
      assert.isTrue C.metadata().scopes['all'].isCursor, "scope instanceof Tower.Model.Cursor"

    test '"all"', ->
      C.scope 'all'

      assert.deepEqual C.metadata().scopeNames, ['all']
      assert.isTrue C.metadata().scopes['all'].isCursor, "scope instanceof Tower.Model.Cursor"

    test '"highlyRated"', ->
      C.scope 'highlyRated'

      assert.deepEqual _.keys(C.metadata().scopes), ['highlyRated']
      assert.isTrue C.metadata().scopes['highlyRated'].isCursor, "scope instanceof Tower.Model.Cursor"
      assert.deepEqual C.metadata().scopes['highlyRated'].conditions(), {type: 'Post', rating: '>=': 8}

  describe 'instance', ->
    test 'default', ->
      C.scope()

      assert.isTrue C.instance().get('all').isCursor, "scope instanceof Tower.Model.Cursor"

    test '"writtenBy(currentUser)"', ->
      C.scope 'writtenBy', -> App.Post.where(userId: @getPath('currentUser.id'))

      assert.deepEqual _.keys(C.metadata().scopes), ['writtenBy']
      assert.isFunction C.metadata().scopes['writtenBy']

      assert.deepEqual C.instance().getCursor('writtenBy').conditions(), {type: 'Post', userId: 5}

  describe 'resolveAgainstCursors', ->
    describe 'all', ->
      beforeEach ->
        C.scope 'all'

      test 'any', ->
        post = App.Post.build(id: 5, rating: 8)
        
        assert.equal C.instance().resolveAgainstCursors('created', [post]).toArray().length, 1
        assert.equal C.instance().resolveAgainstCursors('updated', [post]).toArray().length, 1
        assert.equal C.instance().resolveAgainstCursors('deleted', [post]).toArray().length, 1
