const express = require("express")
const router = new express.Router() 
const asyncHandler = require("express-async-handler")
const accountController = require("../controllers/accountController")

// Get Login Route
router.get("/login", asyncHandler(accountController.buildLogin))
router.post("/login",  asyncHandler(accountController.accountLogin))


router.get("/registration", asyncHandler(accountController.buildRegister))
router.post("/register", asyncHandler(accountController.registerAccount))

//adminstrative business
router.get("/management", asyncHandler(accountController.buildManagementView))


module.exports = router;