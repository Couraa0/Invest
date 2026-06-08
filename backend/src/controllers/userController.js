const { poolPromise, sql } = require('../config/db');

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .query('SELECT id, email, full_name, risk_profile, membership_level, avatar_url, google_id, created_at FROM Users WHERE id = @id');
    if (!result.recordset.length) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  const { email, full_name, risk_profile, membership_level } = req.body;
  if (!email || !full_name) return res.status(400).json({ error: 'email dan full_name wajib diisi' });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('email', sql.VarChar, email)
      .input('full_name', sql.VarChar, full_name)
      .input('risk_profile', sql.VarChar, risk_profile || 'Moderat')
      .input('membership_level', sql.VarChar, membership_level || 'Basic')
      .query(`
        INSERT INTO Users (email, full_name, risk_profile, membership_level)
        OUTPUT INSERTED.*
        VALUES (@email, @full_name, @risk_profile, @membership_level)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email sudah terdaftar' });
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/:id
const updateUser = async (req, res) => {
  const { full_name, risk_profile, membership_level, avatar_url, has_completed_onboarding } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('id', sql.UniqueIdentifier, req.params.id)
      .input('full_name', sql.VarChar, full_name)
      .input('risk_profile', sql.VarChar, risk_profile)
      .input('membership_level', sql.VarChar, membership_level)
      .input('avatar_url', sql.VarChar, avatar_url)
      .input('has_completed_onboarding', sql.Bit, has_completed_onboarding)
      .query(`
        UPDATE Users SET
          full_name = COALESCE(@full_name, full_name),
          risk_profile = COALESCE(@risk_profile, risk_profile),
          membership_level = COALESCE(@membership_level, membership_level),
          avatar_url = COALESCE(@avatar_url, avatar_url),
          has_completed_onboarding = COALESCE(@has_completed_onboarding, has_completed_onboarding),
          updated_at = CURRENT_TIMESTAMP
        OUTPUT INSERTED.id, INSERTED.email, INSERTED.full_name, INSERTED.risk_profile, INSERTED.membership_level, INSERTED.avatar_url, INSERTED.google_id, INSERTED.has_completed_onboarding, INSERTED.created_at
        WHERE id = @id
      `);
    res.json({ message: 'User berhasil diupdate', user: result.recordset[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserById, createUser, updateUser };
