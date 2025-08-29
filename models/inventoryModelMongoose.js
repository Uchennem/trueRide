const mongoose = require('mongoose'); 
const Counter = require("./counterSchema");

const inventorySchema = new mongoose.Schema({
    inv_id: { type: Number, unique: true },

    inv_make: { 
        type: String, 
        required: [true, "Vehicle make is required"], 
        trim: true,
        minlength: [2, "Make must be at least 2 characters"]
    },
    inv_model: { 
        type: String, 
        required: [true, "Vehicle model is required"], 
        trim: true,
        minlength: [1, "Model must be at least 1 character"]
    },
    inv_year: { 
        type: Number, 
        required: [true, "Year is required"], 
        min: [1900, "Year cannot be before 1900"], 
        max: [new Date().getFullYear(), "Year cannot be in the future"]
    },
    inv_description: { 
        type: String, 
        required: [true, "Description is required"], 
        minlength: [10, "Description must be at least 10 characters"]
    },
    inv_image: { 
        type: String, 
        required: [true, "Vehicle image is required"]
    },
    inv_thumbnail: { 
        type: String, 
        required: [true, "Thumbnail image is required"]
    },
    inv_price: { 
        type: Number, 
        required: [true, "Price is required"], 
        min: [0, "Price must be a positive number"]
    },
    inv_miles: { 
        type: Number, 
        required: [true, "Miles is required"], 
        min: [0, "Miles cannot be negative"]
    },
    inv_color: { 
        type: String, 
        required: [true, "Color is required"], 
        trim: true
    },
    classification_id: { 
        type: Number,
        required: [true, "Classification is required"]
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
