const router = require('express').Router();
const {
  getSessions, createSession, updateSessionTitle, deleteSession,
  getMessages, addMessage,
} = require('../controllers/mentorshipController');

// Sessions (with :userId param — backward compatible)
router.get('/:userId/sessions', getSessions);
router.post('/:userId/sessions', createSession);
router.patch('/sessions/:sessionId/title', updateSessionTitle);
router.delete('/sessions/:sessionId', deleteSession);

// Messages
router.get('/sessions/:sessionId/messages', getMessages);
router.post('/sessions/:sessionId/messages', addMessage);

// Shortcut sessions routes using logged-in user from JWT
router.get('/my/sessions', (req, res, next) => { req.params.userId = req.userId; getSessions(req, res, next); });
router.post('/my/sessions', (req, res, next) => { req.params.userId = req.userId; createSession(req, res, next); });

module.exports = router;
