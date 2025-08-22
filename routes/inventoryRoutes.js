const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/invController")
const asyncHandler = require("express-async-handler")


router.get("/type/:classificationId", asyncHandler(inventoryController.buildByClassificationId))
router.get("/detail/:inventoryId", asyncHandler(inventoryController.buildByInventoryId))

// Inventory management routes
router.get("/", asyncHandler(inventoryController.buildManagementView))
router.get("/getInventory/:classification_id", asyncHandler(inventoryController.getInventoryJSON))

module.exports = router;