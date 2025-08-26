const mongoose = require('mongoose');
const Counter = require("./counterSchema");

const inventorySchema = new mongoose.Schema({
    inv_id: {type: Number, unique: true},
    inv_make: { type: String, required: true },
    inv_model: { type: String, required: true },
    inv_year: { type: Number, required: true },
    inv_description: { type: String, required: true },
    inv_image: { type: String, required: true },
    inv_thumbnail: { type: String, required: true },
    inv_price: { type: Number, required: true },
    inv_miles: { type: Number, required: true },
    inv_color: { type: String, required: true },
    classification_id: { 
        type: Number,
        required: true 
    }
});

// Pre-save hook to auto-increment
inventorySchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'inv_id' }, 
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // create if missing
    );
    doc.inv_id = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Inventory', inventorySchema);