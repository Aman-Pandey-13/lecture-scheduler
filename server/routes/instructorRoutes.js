const express = require('express');
const router = express.Router();
const {addInstructor, getInstructors} = require('../controllers/instructorController');
const {verifyToken, isAdmin} = require('../middleware/auth');


router.post('/', verifyToken, isAdmin, addInstructor);
router.get('/', verifyToken, isAdmin, getInstructors);

module.exports = router;

