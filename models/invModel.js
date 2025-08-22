const Classification = require('./classificationModelMongoose');
const Inventory = require('./inventoryModelMongoose');

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


module.exports = {getAllClassifications, getInvByClassificationId, getClassificationName, getInvByInventoryId}