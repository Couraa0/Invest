const { poolPromise, sql } = require('../config/db');

// GET /api/mentorship/:userId/sessions
const getSessions = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query('SELECT * FROM Mentorship_Sessions WHERE user_id = @userId ORDER BY updated_at DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mentorship/:userId/sessions
const createSession = async (req, res) => {
  const { title } = req.body;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .input('title', sql.VarChar, title || 'New Session')
      .query('INSERT INTO Mentorship_Sessions (user_id, title) OUTPUT INSERTED.* VALUES (@userId, @title)');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/mentorship/sessions/:sessionId/title  — update judul sesi
const updateSessionTitle = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title wajib diisi' });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.params.sessionId)
      .input('title', sql.VarChar, title)
      .query('UPDATE Mentorship_Sessions SET title = @title, updated_at = CURRENT_TIMESTAMP WHERE id = @sessionId');
    res.json({ message: 'Judul sesi diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/mentorship/sessions/:sessionId
const deleteSession = async (req, res) => {
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.params.sessionId)
      .query('DELETE FROM Mentorship_Sessions WHERE id = @sessionId');
    res.json({ message: 'Sesi dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/mentorship/sessions/:sessionId/messages
const getMessages = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.params.sessionId)
      .query('SELECT * FROM Mentorship_Messages WHERE session_id = @sessionId ORDER BY created_at ASC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mentorship/sessions/:sessionId/messages
const addMessage = async (req, res) => {
  const { sender_role, content } = req.body;
  if (!sender_role || !content) return res.status(400).json({ error: 'sender_role dan content wajib diisi' });
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.params.sessionId)
      .input('senderRole', sql.VarChar, sender_role)
      .input('content', sql.Text, content)
      .query(`
        INSERT INTO Mentorship_Messages (session_id, sender_role, content)
        OUTPUT INSERTED.*
        VALUES (@sessionId, @senderRole, @content)
      `);
    // Update timestamp sesi
    await pool.request()
      .input('sessionId', sql.UniqueIdentifier, req.params.sessionId)
      .query('UPDATE Mentorship_Sessions SET updated_at = CURRENT_TIMESTAMP WHERE id = @sessionId');
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSessions, createSession, updateSessionTitle, deleteSession, getMessages, addMessage };
