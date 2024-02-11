// models/University.js
const mongoose = require('mongoose');

const universitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String,},
  location: { type: String, },
  establishedYear: { type: Number },
  website: { type: String },
  contactEmail: { type: String },
  contactPhone: { type: String },
  accreditation: { type: String },
  programsOffered: [{ type: String }],
  campusSize: { type: String },
  studentsEnrolled: { type: Number },
  imageUrl: { type: String }
});

module.exports = mongoose.model('University', universitySchema);