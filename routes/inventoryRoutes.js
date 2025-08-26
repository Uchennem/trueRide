const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/invController")
const asyncHandler = require("express-async-handler")
const upload = require('../middleware/uploadConfig');


router.get("/type/:classificationId", asyncHandler(inventoryController.buildByClassificationId))
router.get("/detail/:inventoryId", asyncHandler(inventoryController.buildByInventoryId))

// Inventory management routes
router.get("/", asyncHandler(inventoryController.buildManagementView))
router.get("/getInventory/:classification_id", asyncHandler(inventoryController.getInventoryJSON))

// Inventory Management Edit and Manipulation
router.get("/edit/:inventory_id", asyncHandler(inventoryController.editInventoryView))
router.post("/update/",
    asyncHandler(inventoryController.updateInventory)
) // make post updates to inventory
// delete inventory
router.get("/delete/:inventory_id", asyncHandler(inventoryController.deleteConfirmationView))
router.post("/delete/", asyncHandler(inventoryController.deleteInventory))

// Route to view the add classification form
router.get("/addClassification", asyncHandler(inventoryController.addClassificationView));
// make post updates to Classification
router.post("/add-classification", 
    asyncHandler(inventoryController.addClassification)
)

// Route to add New inventory
router.get("/addInventory", asyncHandler(inventoryController.addInventoryView))
router.post("/add-inventory/", 
    upload.fields([
  { name: 'inv_image', maxCount: 1 },
  { name: 'inv_thumbnail', maxCount: 1 }
   ]), asyncHandler(inventoryController.addInventory)
) // make post updates to inventory

module.exports = router;