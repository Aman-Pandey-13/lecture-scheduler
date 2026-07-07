const express = require("express");
const router = express.Router();
const { getMyLectures } = require("../controllers/lectureController");
const { verifyToken } = require("../middleware/auth");

router.get("/mine", verifyToken, getMyLectures);

module.exports = router;
