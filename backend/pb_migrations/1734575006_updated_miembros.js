/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool732216385",
    "name": "membresia",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update field
  collection.fields.addAt(7, new Field({
    "hidden": false,
    "id": "bool732216385",
    "name": "membresia",
    "presentable": false,
    "required": true,
    "system": false,
    "type": "bool"
  }))

  return app.save(collection)
})
