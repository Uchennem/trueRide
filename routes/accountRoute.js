const express = require("express")
const router = new express.Router() 
const asyncHandler = require("express-async-handler")
const accountController = require("../controllers/accountController")
const authentification = require('../middleware/authentification')

// Get Login Route
router.get("/login", asyncHandler(accountController.buildLogin))
router.post("/login",  asyncHandler(accountController.accountLogin))


router.get("/registration", asyncHandler(accountController.buildRegister))
router.post("/register", asyncHandler(accountController.registerAccount))

//adminstrative business
router.get("/management", 
    authentification.isLoggedIn, 
    authentification.isEmployee, 
    asyncHandler(accountController.buildManagementView))


router.get("/upgrade", 
authentification.isLoggedIn, 
authentification.isAdmin, 
asyncHandler(accountController.buildAccountUpgradeView))

router.post("/upgrade", 
authentification.isLoggedIn, 
authentification.isAdmin, 
asyncHandler(accountController.upgradeAccount))

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect("/")
    }
    res.clearCookie("connect.sid")
    res.redirect("/")
  })
})

module.exports = router;