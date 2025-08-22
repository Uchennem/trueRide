const express = require("express");
const router = new express.Router(); 

// Route that intentionally triggers a 500 error
router.get("/", (req, res, next) => {
  // Pass an error to Express -> this will go to errorHandler middleware
  res.status(500)
  next(new Error("Intentional 500 error for testing purposes"));
});

module.exports = router;
