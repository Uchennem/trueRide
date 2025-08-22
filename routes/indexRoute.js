const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")

// Route to build inventory by classification view
router.get("/", baseController.buildHome);

module.exports = router;