class App.Parent extends Tower.Model
  @field "id", type: "Id"
  @hasMany "child", cache: true, counterCache: true
  
  # embed tests
  @hasMany "embeddedChildren", embed: true, type: "Child", inverseOf: "embeddableParent"
  
  # inverseOf tests
  @hasMany "noInverse_noInverse", type: "Child"
  @hasMany "noInverse_withInverse", type: "Child"
  @hasMany "withInverse_withInverse", type: "Child", inverseOf: "withInverse_withInverse"
  @hasMany "withInverse_noInverse", type: "Child", inverseOf: "noInverse_withInverse"
  
  @hasMany "idCacheTrue_idCacheFalse", type: "Child", idCache: true
  @hasMany "idCacheFalse_idCacheTrue", type: "Child", inverseOf: "idCacheTrue_idCacheFalse"