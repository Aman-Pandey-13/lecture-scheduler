const express = require("express");
const router = express.Router({ mergeParams: true });
const {
  addLecture,
  getLecturesByCourse,
  getMyLectures,
} = require("../controllers/lectureController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.get("/mine", verifyToken, getMyLectures);
router.post("/", verifyToken, isAdmin, addLecture);
router.get("/", verifyToken, getLecturesByCourse);

module.exports = router;
