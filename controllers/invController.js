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
    res.render("./inventory/classification", {
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
    res.render("./inventory/inventory", {
      title: inventoryName,
      nav,
      section,
    })
}

module.exports = invCont;