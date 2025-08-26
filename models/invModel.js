const Classification = require('./classificationModelMongoose');
const Inventory = require('./inventoryModelMongoose');
const connectDB = require("../mongoDb/dbConnection")

//Note: Try/catch is unneccessary because I alread have express error handler on the routes. This is just for me

async function getAllClassifications() {
  try {
    const classifications = await Classification.find({});
    console.log(classifications);
    return classifications;
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error;
  }
}

async function getClassificationName(classification_id) {
  try {
    const classification = await Classification.findOne({ classification_id: classification_id });
    if (!classification) return null; // handle case when no match found
    return classification.classification_name;
  } catch (error) {
    console.error("Error fetching classification:", error);
    throw error;
  }
}


async function getInvByClassificationId(class_id) {
  try {
    const classification = await Inventory.find({ classification_id: class_id });
    console.log(classification);
    return classification;
  } catch (error) {
    console.error("Error fetching Classification items:", error);
    throw error;
  }
}

async function getInvByInventoryId(inventory_id) {
  try {
    const inventoryItem = await Inventory.findOne({ inv_id: inventory_id });
    console.log(inventoryItem);
    return inventoryItem;
  } catch (error) {
    console.error("Error fetching Inventory item:", error);
    throw error;
  }
}

/*********************************
 *  Update Vehicle Data
 * Unit 5, Update  Activity
 * **************************************/

async function updateInventory(
  inv_id, inv_make, inv_model, 
  inv_description, inv_image, inv_thumbnail, inv_price, 
  inv_year, inv_miles, inv_color, classification_id
) {
  // Use the Inventory model directly
  const result = await Inventory.findOneAndUpdate(
    { inv_id: inv_id },           // filter
    {                             // update
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
    },
    { new: true }                 // return the updated document
  );

  return result;
}

async function deleteInventoryById(inventory_id) {
   try {
    const result = await Inventory.deleteOne({ inv_id: inventory_id });
    return result; // contains info about deleted count
    } catch (error) {
        console.error("Error deleting inventory:", error);
        throw error;
    }
}

async function addClassification(classification) {
  try {
    const newClassification = new Classification({classification_name: classification})
    const savedItem = await newClassification.save()
    return savedItem
  } catch(error) {
    console.error("Error adding Classification: ", error);
    throw error;
  }
}

async function addInventoryItem(inventoryItem) {
  try {
    const newInventory = new Inventory(inventoryItem)
    const savedItem = await newInventory.save()
    return savedItem
  } catch(error) {
    console.error("Error adding Inventory: ", error);
    throw error;
  }
}


module.exports = {getAllClassifications, getInvByClassificationId, getClassificationName, getInvByInventoryId, updateInventory, deleteInventoryById, addClassification, addInventoryItem}