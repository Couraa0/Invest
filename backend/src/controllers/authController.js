const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { poolPromise, sql } = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'investai_secret_key_2026';
const JWT_EXPIRES = '3h';

// POST /api/auth/register
const register = async (req, res) => {
  const { email, password, full_name } = req.body;
  if (!email || !password || !full_name)
    return res.status(400).json({ error: 'email, password, dan full_name wajib diisi' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password minimal 6 karakter' });

  try {
    const pool = await poolPromise;
    
    // Check if email already exists
    const checkResult = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT id FROM Users WHERE email = @email');

    if (checkResult.recordset.length > 0) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('password_hash', sql.VarChar, password_hash)
      .input('full_name', sql.VarChar, full_name)
      .query(`
        INSERT INTO Users (email, password_hash, full_name)
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.risk_profile, INSERTED.membership_level, INSERTED.created_at
        VALUES (@email, @password_hash, @full_name)
      `);

    const user = result.recordset[0];
    
    // Automatically create a Portfolio for the new user (initial cash 100M defaults from schema)
    await pool.request()
      .input('userId', sql.UniqueIdentifier, user.id)
      .query(`INSERT INTO Portfolios (user_id) VALUES (@userId)`);

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message && (err.message.includes('UNIQUE') || err.message.includes('Violation of UNIQUE KEY'))) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email dan password wajib diisi' });

  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    if (!result.recordset.length)
      return res.status(401).json({ error: 'Email atau password salah' });

    const user = result.recordset[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid)
      return res.status(401).json({ error: 'Email atau password salah' });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    // Return user without password_hash
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me — get current user from token
const getMe = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.userId)
      .query('SELECT id, email, full_name, risk_profile, membership_level, created_at FROM Users WHERE id = @id');
    if (!result.recordset.length) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy-client-id');

// POST /api/auth/google
const googleLogin = async (req, res) => {
  const { token: googleToken } = req.body;
  if (!googleToken) return res.status(400).json({ error: 'Token Google tidak ditemukan' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: googleToken,
      audience: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
    });
    const payload = ticket.getPayload();
    const { sub: google_id, email, name: full_name, picture: avatar_url } = payload;

    const pool = await poolPromise;
    
    // Check if user exists
    let result = await pool.request()
      .input('email', sql.VarChar, email)
      .query('SELECT * FROM Users WHERE email = @email');

    let user;

    if (result.recordset.length > 0) {
      user = result.recordset[0];
      // If user exists but no google_id, update it
      if (!user.google_id) {
        await pool.request()
          .input('id', sql.UniqueIdentifier, user.id)
          .input('google_id', sql.VarChar, google_id)
          .input('avatar_url', sql.VarChar, avatar_url)
          .query(`UPDATE Users SET google_id = @google_id, avatar_url = COALESCE(avatar_url, @avatar_url), auth_provider = 'google' WHERE id = @id`);
        user.google_id = google_id;
        user.avatar_url = user.avatar_url || avatar_url;
      }
    } else {
      // User doesn't exist, create new
      const insertResult = await pool.request()
        .input('email', sql.VarChar, email)
        .input('full_name', sql.VarChar, full_name)
        .input('avatar_url', sql.VarChar, avatar_url)
        .input('google_id', sql.VarChar, google_id)
        .query(`
          INSERT INTO Users (email, full_name, avatar_url, auth_provider, google_id)
          OUTPUT INSERTED.*
          VALUES (@email, @full_name, @avatar_url, 'google', @google_id)
        `);
      
      user = insertResult.recordset[0];

      // Create Portfolio
      await pool.request()
        .input('userId', sql.UniqueIdentifier, user.id)
        .query(`INSERT INTO Portfolios (user_id) VALUES (@userId)`);
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    const { password_hash, ...safeUser } = user;
    
    res.json({ user: safeUser, token });
  } catch (err) {
    console.error('Google Auth Error:', err);
    res.status(500).json({ error: 'Gagal memverifikasi akun Google' });
  }
};

module.exports = { register, login, getMe, googleLogin };
