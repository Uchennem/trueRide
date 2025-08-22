const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    account_firstname: { type: String, required: true },
    account_lastname: { type: String, required: true },
    account_email: { type: String, required: true, unique: true },
    account_password: { type: String, required: true },
    account_type: { 
        type: String, 
        enum: ['Employee', 'Admin', 'Client'], 
        default: 'Client' 
    }
});

module.exports = mongoose.model('Account', accountSchema);
