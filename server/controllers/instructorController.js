const bcrypt = require("bcryptjs");
const User = require("../models/user");

exports.addInstructor = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ message: "A user with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const instructor = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "Instructor",
    });

    res.status(201).json({
      id: instructor._id,
      name: instructor.name,
      email: instructor.email,
      role: instructor.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getInstructors = async (req, res) => {
  try {
    const instructors = await User.find({ role: "Instructor" }).select(
      "-password",
    );
    res.status(200).json(instructors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
