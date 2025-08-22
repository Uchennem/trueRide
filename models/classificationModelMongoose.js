const mongoose = require('mongoose');

const classificationSchema = new mongoose.Schema({
    classification_id: { type: Number, required: true, unique: true },
    classification_name: { type: String, required: true }
});

module.exports = mongoose.model('Classification', classificationSchema);
