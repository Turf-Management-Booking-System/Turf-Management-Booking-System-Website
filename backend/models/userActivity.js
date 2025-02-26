const mongoose = require("mongoose");

const userActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  action: {
    type: String,
    required: true,
  },
},{timestamps:true});

module.exports = mongoose.model("UserActivity", userActivitySchema);
