/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update collection data
  unmarshal({
    "name": "miembros"
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update collection data
  unmarshal({
    "name": "alumnos"
  }, collection)

  return app.save(collection)
})
