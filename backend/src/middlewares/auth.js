const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'investai_secret_key_2026';

/**
 * Middleware: extract JWT token from Authorization header and set req.userId
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ error: 'Token tidak ditemukan. Silakan login.' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
  }
};

module.exports = authMiddleware;
