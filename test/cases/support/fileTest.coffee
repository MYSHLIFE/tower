Tower.SupportFile =
  removeDirectory: (path, recursive = true) ->
    if recursive
      require('wrench').rmdirSyncRecursive(path)
    else
      require('fs').rmdirSync(path)