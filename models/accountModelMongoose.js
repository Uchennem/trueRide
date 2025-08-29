const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  account_firstname: { 
    type: String, 
    required: [true, "First name is required"], 
    trim: true 
  },
  account_lastname: { 
    type: String, 
    required: [true, "Last name is required"], 
    trim: true 
  },
  account_email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    match: [/\S+@\S+\.\S+/, "Please enter a valid email"] 
  },
  account_password: { 
    type: String, 
    required: [true, "Password is required"], 
    minlength: [8, "Password must be at least 8 characters long"] 
  },
  account_type: { 
    type: String, 
    enum: ['Employee', 'Admin', 'Client'], 
    default: 'Client' 
  }
});

module.exports = mongoose.model("Account", accountSchema);
