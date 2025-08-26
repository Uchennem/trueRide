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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = req.params.inventory_id;  // Get the inventory ID from URL parameters
  console.log(inv_id);

  // Fetch navigation and item details
  let nav = await utilities.getNav();
  const itemData = await invModel.getInvByInventoryId(inv_id);

  console.log(`This is the value of item data: ${JSON.stringify(itemData, null, 2)}`);

  // Fetch all classifications
  const data = await invModel.getAllClassifications();  // Fetch all classifications from the DB
  console.log("This is the classifications Data " + data)

  // Pass the full list of classifications to the helper function
  const classificationSelect = utilities.buildClassificationList(data, itemData.classification_id);

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,  // Render the dropdown
    errors: null,
    itemName: itemName,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id  // This will be pre-selected in the dropdown
  });
}

/*********************************
 *  Update Vehicle Data
 * **************************************/

invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  console.log(inv_color)
  const updateResult = await invModel.updateInventory (
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("success", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classifications = await invModel.getAllClassifications()
    const classificationSelect =  utilities.buildClassificationList(classifications)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("error", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }

}

invCont.deleteConfirmationView = async (req, res, next) => {
  const inv_id = req.params.inventory_id; 
  const item = await invModel.getInvByInventoryId(inv_id)

  // Fetch navigation and item details
  let nav = await utilities.getNav();

  // Fetch all classifications
  const classificationData = await invModel.getAllClassifications();  // Fetch all classifications from the DB

  // Pass the full list of classifications to the helper function
  const classificationSelect = utilities.buildClassificationList(classificationData, item.classification_id);

  const itemName = `${item.inv_make} ${item.inv_model}`;
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,  // Render the dropdown
    errors: null,
    itemName: itemName,
    inv_id: item.inv_id,
    inv_make: item.inv_make,
    inv_model: item.inv_model,
    inv_year: item.inv_year,
    inv_description: item.inv_description,
    inv_image: item.inv_image,
    inv_thumbnail: item.inv_thumbnail,
    inv_price: item.inv_price,
    inv_miles: item.inv_miles,
    inv_color: item.inv_color,
    classification_id: item.classification_id  // This will be pre-selected in the dropdown
  });
}

invCont.deleteInventory = async (req, res, next) => {
  const inv_id = req.params.inventory_id
  const item = await invModel.getInvByInventoryId(inv_id)
  if (item) {    
    const itemName = `${item.inv_make} ${item.inv_model}` 
    await invModel.deleteInventoryById(inv_id)
    req.flash("success", `The ${itemName} has been successfully deleted`)
    res.redirect("/inv/")
  } else {
    req.flash("error", "Inventory item not found, delete failed.");
    res.status(404).render("/inventory/delete-confirm");
  }
}


/* ***************************
 *  Build Add Classification View
 * ************************** */
invCont.addClassificationView = async function (req, res) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***************************
 *  Add Classification Data
 * ************************** */
invCont.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_name
  } = req.body

  console.log(classification_name)
  const updateResult = await invModel.addClassification(classification_name)
  if (updateResult) {
    req.flash("success", `The ${classification_name} classification was successfully created.`)
    res.redirect("/inv/")
  } else {
    req.flash("error", "Sorry, the insert failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }

}

/*********************************
 *  Add Inventory View and Data
 * *******************************/

invCont.addInventoryView = async function (req, res, next) {
  let nav = await utilities.getNav();

  // Fetch all classifications
  const classificationData = await invModel.getAllClassifications();  // Fetch all classifications from the DB
  const classificationSelect = utilities.buildClassificationList(classificationData)

  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationSelect: classificationSelect,
    errors: null,
  });
}

invCont.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_make,
    inv_model,
    inv_description,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  // Extract file paths from Multer
  const inv_image = req.files['inv_image'] ? `/images/vehicles/${req.files['inv_image'][0].filename}` : '';
  const inv_thumbnail = req.files['inv_thumbnail'] ? `/images/vehicles/${req.files['inv_thumbnail'][0].filename}` : '';

  try {
    const inventoryItem = {
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
    };
    const updateResult = await invModel.addInventoryItem (inventoryItem)
    const itemName = inv_make + " " + inv_model
    req.flash("success", `The ${itemName} was successfully added.`)
    res.redirect("/inv/")
  } catch(error) {
    console.error("Error adding Inventory:", error)
    req.flash("error", "Sorry, the item addition has failed.")
    res.status(501).redirect("inv/add-inventory")
  }
}


module.exports = invCont;