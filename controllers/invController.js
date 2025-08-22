const invModel = require('../models/invModel');
const utilities = require("../utilities/index");
const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    console.log(req.params.classificationId)
    
    const data = await invModel.getInvByClassificationId(classification_id)
    if (!data) {
      res.status(404)
      throw new Error("Cannot get Classification")
    }
    console.log("Here is the data: ", data)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className =await invModel.getClassificationName(classification_id)
    res.render("./vehicleDetails/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
}

/* ***************************
 *  Build inventory by Inventory Id view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id = req.params.inventoryId
    console.log(req.params.inventoryId)
    
    const data = await invModel.getInvByInventoryId(inventory_id)
    if (!data) {
      res.status(404)
      throw new Error("Cannot get Inventory Item")
    }
    console.log("Here is the data: ", data)
    const section = await utilities.buildVehicleDetails(data)
    let nav = await utilities.getNav()
    const inventoryName = `${data.inv_make} ${data.inv_model}`
    res.render("./vehicleDetails/inventory", {
      title: inventoryName,
      nav,
      section,
    })
}

/* ***************************
 *  Build Inventory Management view
 * ************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const data = await invModel.getAllClassifications();
  if (!data) {
    console.error("Error fetching classifications:", error);
    res.status(500).render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: "Could not load vehicle classifications.",
      classificationSelect: "<p>Error loading classifications.</p>",
    });
  }
  
  // Build the classification select HTML using `data`
  const classificationSelect = utilities.buildClassificationList(data);
  res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
    });
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInvByClassificationId(classification_id)
  if (invData) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



module.exports = invCont;