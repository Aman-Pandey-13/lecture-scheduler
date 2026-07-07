const Lecture = require("../models/lecture");

exports.addLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { instructorId, date, batchName } = req.body;

    if (!instructorId || !date) {
      return res
        .status(400)
        .json({ message: "Instructor and date are required" });
    }

    const day = new Date(date);
    day.setHours(0, 0, 0, 0);
    const nextDay = new Date(day);
    nextDay.setDate(day.getDate() + 1);

    const clash = await Lecture.findOne({
      instructor: instructorId,
      date: { $gte: day, $lt: nextDay },
    });

    if (clash) {
      return res.status(409).json({
        message: `This instructor already has a lecture scheduled on ${day.toDateString()}.`,
      });
    }

    const lecture = await Lecture.create({
      course: courseId,
      instructor: instructorId,
      date: day,
      batchName,
    });

    res.status(201).json(lecture);
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Instructor already booked on this date." });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getLecturesByCourse = async (req, res) => {
  try {
    const lectures = await Lecture.find({
      course: req.params.courseId,
    }).populate("instructor", "name email");
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getMyLectures = async (req, res) => {
  try {
    const lectures = await Lecture.find({ instructor: req.user.id })
      .populate("course", "name level")
      .sort({ date: 1 });
    res.status(200).json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
