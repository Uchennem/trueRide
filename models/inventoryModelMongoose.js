const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    inv_id: {type: Number, required: true},
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

module.exports = mongoose.model('Inventory', inventorySchema);