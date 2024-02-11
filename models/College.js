// models/College.js
const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String },
  establishedYear: { type: Number },
  imageUrl: { type: String },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "University",
    required: true,
  },
});

module.exports = mongoose.model("College", collegeSchema);
