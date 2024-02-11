// index.js
const express = require("express");
const mongoose = require("mongoose");
const professorRouter = require("./routes/professors");

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/myapp", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("Connected to MongoDB"))
//   .catch((err) => console.error("Could not connect to MongoDB", err));

mongoose
  .connect("mongodb://localhost:27017/myapp")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

// Middleware
app.use(express.json());

// Routes
app.use("/professors", professorRouter);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
