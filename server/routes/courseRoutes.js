const express = require('express');
const router = express.Router();
const {createCourse, getCourses, getCourseById} = require('../controllers/courseController');
const {verifyToken, isAdmin} = require('../middleware/auth');
const lectureRoutes = require('./lectureRoutes');
const upload = require('../middleware/upload');

router.post('/', verifyToken, isAdmin, createCourse);
router.post('/', verifyToken, isAdmin, upload.single('image'), createCourse);
router.get('/', verifyToken, getCourses);
router.get('/:id', verifyToken, getCourseById);
router.use('/:courseId/lectures', lectureRoutes);

module.exports = router;