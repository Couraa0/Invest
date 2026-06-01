const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Trigger koneksi DB saat startup
require('./src/config/db');

const authRouter = require('./src/routes/auth');
const authMiddleware = require('./src/middlewares/auth');
const usersRouter = require('./src/routes/users');
const portfolioRouter = require('./src/routes/portfolio');
const mentorshipRouter = require('./src/routes/mentorship');
const academyRouter = require('./src/routes/academy');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Public routes (no auth required)
app.use('/api/auth', authRouter);

// Protected routes (require JWT token)
app.use('/api/users', authMiddleware, usersRouter);
app.use('/api/portfolio', authMiddleware, portfolioRouter);
app.use('/api/mentorship', authMiddleware, mentorshipRouter);
app.use('/api/academy', authMiddleware, academyRouter);

// Health check
app.get('/', (req, res) => {
  res.json({
    message: 'InvestAI Backend API',
    status: 'running',
    endpoints: {
      public: [
        'POST /api/auth/register',
        'POST /api/auth/login',
      ],
      protected: [
        'GET  /api/auth/me',
        'GET/PATCH /api/users/:id',
        'GET  /api/portfolio/:userId',
        'POST /api/portfolio/:userId/buy',
        'POST /api/portfolio/:userId/sell',
        'GET  /api/mentorship/:userId/sessions',
        'POST /api/mentorship/:userId/sessions',
        'GET  /api/mentorship/sessions/:sessionId/messages',
        'POST /api/mentorship/sessions/:sessionId/messages',
        'GET  /api/academy/courses',
        'GET  /api/academy/progress/:userId',
      ],
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
