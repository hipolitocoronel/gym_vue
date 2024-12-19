/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_ul0Kqa9wDL` ON `miembros` (`dni`)"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3482769729")

  // update collection data
  unmarshal({
    "indexes": []
  }, collection)

  return app.save(collection)
})
