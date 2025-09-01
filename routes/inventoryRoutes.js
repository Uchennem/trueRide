const express = require("express")
const router = new express.Router() 
const inventoryController = require("../controllers/invController")
const asyncHandler = require("express-async-handler")
const upload = require('../middleware/uploadConfig');
const authentification = require('../middleware/authentification')
const commentController = require('../controllers/commentController')

router.get("/type/:classificationId", asyncHandler(inventoryController.buildByClassificationId))
router.get("/detail/:inventoryId", asyncHandler(inventoryController.buildByInventoryId))

// Inventory management routes
router.get("/", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.buildManagementView))
router.get("/getInventory/:classification_id", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.getInventoryJSON))

// Comments handling
router.post(
  "/:inv_id/comment",
  authentification.isLoggedIn,
  asyncHandler(commentController.addComment)
)

// Inventory Management Edit and Manipulation
router.get("/edit/:inventory_id", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.editInventoryView))
router.post("/update/",
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.updateInventory)
) // make post updates to inventory
// delete inventory
router.get("/delete/:inventory_id", 
    authentification.isLoggedIn, 
    authentification.isAdmin,
    asyncHandler(inventoryController.deleteConfirmationView))
router.post("/delete/", 
    authentification.isLoggedIn, 
    authentification.isAdmin,
    asyncHandler(inventoryController.deleteInventory))

// Route to view the add classification form
router.get("/addClassification", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.addClassificationView));
// make post updates to Classification
router.post("/add-classification", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.addClassification)
)

// Route to add New inventory
router.get("/addInventory",
    authentification.isLoggedIn, 
    authentification.isEmployee,
    asyncHandler(inventoryController.addInventoryView))
router.post("/add-inventory/", 
    authentification.isLoggedIn, 
    authentification.isEmployee,
    upload.fields([
  { name: 'inv_image', maxCount: 1 },
  { name: 'inv_thumbnail', maxCount: 1 }
   ]), asyncHandler(inventoryController.addInventory)
) // make post updates to inventory

module.exports = router;