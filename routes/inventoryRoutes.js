const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/invController")
const asyncHandler = require("express-async-handler")


router.get("/type/:classificationId", asyncHandler(inventoryController.buildByClassificationId))
router.get("/detail/:inventoryId", asyncHandler(inventoryController.buildByInventoryId))

module.exports = router;