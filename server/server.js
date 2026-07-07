require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const instructorRoutes = require("./routes/instructorRoutes");
const lectureRoutes = require("./routes/lectureRoutes");
const courseRoutes = require("./routes/courseRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB not connected", err));

app.get("/", (req, res) => {
  res.send("Welcome to Lecture Scheduler ");
});

app.use("/api/auth", authRoutes);

app.use("/api/instructors", instructorRoutes);

app.use("/api/lectures", lectureRoutes);

app.use("/api/courses", courseRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
