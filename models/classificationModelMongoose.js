const mongoose = require('mongoose');
const Counter = require('./counterSchema'); 

const classificationSchema = new mongoose.Schema({
  classification_id: { 
    type: Number, 
    unique: true 
  },
  classification_name: { 
    type: String, 
    required: [true, "Classification name is required"], 
    unique: true,  // prevents duplicates
    trim: true,    // removes leading/trailing spaces
    minlength: [3, "Classification name must be at least 3 characters long"],
    maxlength: [50, "Classification name cannot exceed 50 characters"]
  }
});

// Pre-save hook to auto-increment
classificationSchema.pre('save', async function(next) {
  const doc = this;
  if (doc.isNew) {
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'classification_id' }, 
      { $inc: { seq: 1 } },
      { new: true, upsert: true } // create if missing
    );
    doc.classification_id = counter.seq;
  }
  next();
});

module.exports = mongoose.model('Classification', classificationSchema);
