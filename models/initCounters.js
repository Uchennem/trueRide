const Counter = require('./counterSchema');
const Classification = require('./classificationModelMongoose');
const Inventory = require('./inventoryModelMongoose');

async function initClassificationCounter() {
  const maxClassification = await Classification.findOne({})
    .sort({ classification_id: -1 })
    .exec();
  const maxId = maxClassification ? maxClassification.classification_id : 0;

  await Counter.findByIdAndUpdate(
    { _id: 'classification_id' },
    { seq: maxId },
    { upsert: true, new: true }
  );

  console.log(`Classification counter initialized to ${maxId}`);
}

async function initInventoryCounter() {
  const maxInv = await Inventory.findOne({})
    .sort({ inv_id: -1 })
    .exec();
  const maxId = maxInv ? maxInv.inv_id : 0;

  await Counter.findByIdAndUpdate(
    { _id: 'inv_id' },
    { seq: maxId },
    { upsert: true, new: true }
  );

  console.log(`Inventory counter initialized to ${maxId}`);
}

async function initCounters() {
  await initClassificationCounter();
  await initInventoryCounter();
}

module.exports = initCounters;
