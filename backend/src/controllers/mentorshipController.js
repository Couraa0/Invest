const { supabase } = require('../config/db');

// GET /api/mentorship/:userId/sessions
const getSessions = async (req, res) => {
  try {
    const { data: sessions, error } = await supabase
      .from('Mentorship_Sessions')
      .select('*')
      .eq('user_id', req.params.userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mentorship/:userId/sessions
const createSession = async (req, res) => {
  const { title } = req.body;
  try {
    const { data: session, error } = await supabase
      .from('Mentorship_Sessions')
      .insert([{ user_id: req.params.userId, title: title || 'New Session' }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/mentorship/sessions/:sessionId/title  — update judul sesi
const updateSessionTitle = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ error: 'title wajib diisi' });
  try {
    const { error } = await supabase
      .from('Mentorship_Sessions')
      .update({ title, updated_at: new Date().toISOString() })
      .eq('id', req.params.sessionId);

    if (error) throw error;
    res.json({ message: 'Judul sesi diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/mentorship/sessions/:sessionId
const deleteSession = async (req, res) => {
  try {
    const { error } = await supabase
      .from('Mentorship_Sessions')
      .delete()
      .eq('id', req.params.sessionId);

    if (error) throw error;
    res.json({ message: 'Sesi dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/mentorship/sessions/:sessionId/messages
const getMessages = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('Mentorship_Messages')
      .select('*')
      .eq('session_id', req.params.sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/mentorship/sessions/:sessionId/messages
const addMessage = async (req, res) => {
  const { sender_role, content } = req.body;
  if (!sender_role || !content) return res.status(400).json({ error: 'sender_role dan content wajib diisi' });
  try {
    const { data: message, error: insError } = await supabase
      .from('Mentorship_Messages')
      .insert([{
        session_id: req.params.sessionId,
        sender_role,
        content
      }])
      .select()
      .single();

    if (insError) throw insError;

    // Update timestamp sesi
    const { error: updError } = await supabase
      .from('Mentorship_Sessions')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', req.params.sessionId);

    if (updError) throw updError;

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getSessions, createSession, updateSessionTitle, deleteSession, getMessages, addMessage };
