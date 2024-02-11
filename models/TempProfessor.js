// models/Professor.js
const mongoose = require("mongoose");

const tempProfessorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  title: {
    type: String,
    enum: [
      "Assistant Professor",
      "Associate Professor",
      "Professor",
      "Ph.D. Scholar",
    ],
    required: true,
  },
  college: {type: String, required: true},
  university: {type: String, required: true},
  date: {
    type: Date,
    default: () =>
      new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
      ),
  },
  subjects: [{ type: String }], // Array of subjects the professor teaches
});

module.exports = mongoose.model("TempProfessor", tempProfessorSchema);
