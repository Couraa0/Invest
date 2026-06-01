const router = require('express').Router();
const { getCourses, getCourseDetail, getUserProgress, enrollCourse, updateProgress, getWatchedVideos, markVideoWatched } = require('../controllers/academyController');

router.get('/courses', getCourses);
router.get('/courses/:courseId', getCourseDetail);
router.get('/progress/:userId', getUserProgress);
router.post('/progress/:userId/enroll', enrollCourse);
router.patch('/progress/:userId/:courseId', updateProgress);

router.get('/watched/:userId', getWatchedVideos);
router.post('/watched/:userId', markVideoWatched);
router.get('/watched', (req, res, next) => { req.params.userId = req.userId; getWatchedVideos(req, res, next); });
router.post('/watched', (req, res, next) => { req.params.userId = req.userId; markVideoWatched(req, res, next); });

module.exports = router;
