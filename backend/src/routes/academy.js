const router = require('express').Router();
const { getCourses, getCourseDetail, getUserProgress, enrollCourse, updateProgress } = require('../controllers/academyController');

router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseDetail);
router.get('/progress/:userId', getUserProgress);
router.post('/progress/:userId/enroll', enrollCourse);
router.patch('/progress/:userId/:courseId', updateProgress);

module.exports = router;
