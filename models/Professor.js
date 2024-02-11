// models/Professor.js
const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
});

const professorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  department: { type: String },
  gender: {
    type: String,
    enum: [
      "Male",
      "Female",
    ],
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
  college: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College",
    required: true,
  },
  subjects: [{ type: String }], // Array of subjects the professor teaches
  feedbacks: [feedbackSchema], // Array of feedback objects
});

module.exports = mongoose.model("Professor", professorSchema);