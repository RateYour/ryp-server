// routes/universityRoutes.js
const express = require('express');
const router = express.Router();
const University = require('../models/University');

// CREATE route
router.post('/', async (req, res) => {
  try {
    const university = await University.create(req.body);
    res.status(201).json(university);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// READ all universities route
router.get('/', async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// READ single university route
router.get('/:id', getUniversity, (req, res) => {
  res.json(res.university);
});

// UPDATE route
router.patch('/:id', getUniversity, async (req, res) => {
  if (req.body.name != null) {
    res.university.name = req.body.name;
  }
  if (req.body.description != null) {
    res.university.description = req.body.description;
  }
  // Update other fields similarly...

  try {
    const updatedUniversity = await res.university.save();
    res.json(updatedUniversity);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE route
router.delete('/:id', getUniversity, async (req, res) => {
  try {
    await res.university.remove();
    res.json({ message: 'University deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getUniversity(req, res, next) {
  let university;
  try {
    university = await University.findById(req.params.id);
    if (university == null) {
      return res.status(404).json({ message: 'University not found' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.university = university;
  next();
}

module.exports = router;
