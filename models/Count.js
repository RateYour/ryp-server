// models/College.js
const mongoose = require("mongoose");

const countSchema = new mongoose.Schema({
  count: { type: Number},
});

module.exports = mongoose.model("Count", countSchema);
