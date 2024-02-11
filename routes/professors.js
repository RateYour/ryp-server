// routes/professors.js
const express = require("express");
const router = express.Router();
const Professor = require("../models/Professor");
const College = require("../models/College");
const University = require("../models/University");
const TempProfessor = require("../models/TempProfessor");
// Get all professors
router.get("/", async (req, res) => {
  try {
    const professors = await Professor.find();
    res.json(professors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// Get a single professor
router.get("/:id", getProfessor, (req, res) => {
  res.json(res.professor);
});

router.post('/tempProfessor/', async (req, res) => {
  try {
    const {
      name,
      department,
      gender,
      title,
      college,
      university,
      subjects,
      passcode
    } = req.body;

    if(passcode!=process.env.PASSCODE){
      return res.status(403).send('Forbidden: Invalid passcode');
    }

    // Create a new temporary professor instance
    const newTempProfessor = new TempProfessor({
      name,
      department,
      gender,
      title,
      college,
      university,
      subjects
    });

    // Save the temporary professor to the database
    await newTempProfessor.save();

    res.json(newTempProfessor);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Create a professor
router.post("/", async (req, res) => {
  const { name, gender, department, title,image, subjects, collegeName, universityName } =
    req.body;

  try {
    let university = await University.findOne({ name: universityName });
    if (!university) {
      university = new University({ name: universityName });
      university = await university.save(); // Save university to database
    }

    let college = await College.findOne({
      name: collegeName,
      university: university._id,
    });
    if (!college) {
      college = new College({ name: collegeName, university: university._id });
      await college.save(); // Save college to database
    }

    const professor = new Professor({
      name,
      gender,
      department,
      title,
      image,
      subjects,
      college: college._id,
    });

    const newProfessor = await professor.save();
    res.status(201).json(newProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a professor
router.patch("/:id", getProfessor, async (req, res) => {
  if (req.body.name != null) {
    res.professor.name = req.body.name;
  }
  if (req.body.department != null) {
    res.professor.department = req.body.department;
  }
  if (req.body.title != null) {
    res.professor.title = req.body.title;
  }
  if (req.body.college != null) {
    res.professor.college = req.body.college;
  }
  if (req.body.subjects != null) {
    res.professor.subjects = req.body.subjects;
  }
  if (req.body.feedbacks != null) {
    res.professor.feedbacks = req.body.feedbacks;
  }
  try {
    const updatedProfessor = await res.professor.save();
    res.json(updatedProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/multipleprofessor/", async (req, res) => {
  const professorsData = req.body; // Assuming professorsData is an array of professor objects

  try {
    // Extract unique university names
    const uniqueUniversityNames = Array.from(new Set(professorsData.map(professor => professor.universityName)));

    // Create or fetch universities in bulk
    const universities = await Promise.all(
      uniqueUniversityNames.map(async (universityName) => {
        let university = await University.findOne({ name: universityName });

        if (!university) {
          university = new University({ name: universityName });
          university = await university.save(); // Save university to database
        }

        return university;
      })
    );

    // Map university names to their respective IDs
    const universityMap = {};
    universities.forEach(university => {
      universityMap[university.name] = university._id;
    });

    // Create professors
    const createdProfessors = await Promise.all(
      professorsData.map(async (professorData) => {
        const {
          name,
          gender,
          department,
          title,
          image,
          subjects,
          collegeName,
          universityName,
        } = professorData;

        const college = await College.findOneAndUpdate(
          { name: collegeName, university: universityMap[universityName] },
          { name: collegeName, university: universityMap[universityName] },
          { upsert: true, new: true }
        );

        const professor = new Professor({
          name,
          gender,
          department,
          title,
          image,
          subjects,
          college: college._id,
        });

        return professor.save();
      })
    );

    res.status(201).json(createdProfessors);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});




// Delete a professor
// router.delete("/:id", getProfessor, async (req, res) => {
//   try {
//     await res.professor.remove();
//     res.json({ message: "Professor deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// Add feedback for a professor
router.post("/:id/feedback", getProfessor, async (req, res) => {
  const feedback = {
    rating: req.body.rating,
    comment: req.body.comment,
  };

  try {
    res.professor.feedbacks.push(feedback);
    const updatedProfessor = await res.professor.save();
    res.status(201).json(updatedProfessor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Middleware function to get professor by ID
async function getProfessor(req, res, next) {
  try {
    const professor = await Professor.findById(req.params.id);
    if (professor == null) {
      return res.status(404).json({ message: "Professor not found" });
    }
    res.professor = professor;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
