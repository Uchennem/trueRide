const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true,
    match: [/\S+@\S+\.\S+/, "Please provide a valid email"]
  },
  comment_text: {
    type: String,
    required: [true, "Comment cannot be empty"],
    trim: true
  },
  inv_id: {
    type: Number,
    ref: "Inventory",
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Comment", commentSchema);
