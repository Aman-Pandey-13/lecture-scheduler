const express = require("express");
const router = express.Router();
const { getMyLectures } = require("../controllers/lectureController");
const { verifyToken } = require("../middleware/auth");

router.get("/mine", verifyToken, getMyLectures);
router.get("/:id", verifyToken, getLectureById);

module.exports = router;
