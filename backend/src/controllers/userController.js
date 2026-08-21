const { supabase } = require('../config/db');

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('Users')
      .select('id, email, full_name, risk_profile, membership_level, avatar_url, google_id, created_at')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/users
const createUser = async (req, res) => {
  const { email, full_name, risk_profile, membership_level } = req.body;
  if (!email || !full_name) return res.status(400).json({ error: 'email dan full_name wajib diisi' });
  try {
    const { data: user, error } = await supabase
      .from('Users')
      .insert([{
        email,
        full_name,
        risk_profile: risk_profile || 'Moderat',
        membership_level: membership_level || 'Basic'
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(user);
  } catch (err) {
    if (err.message && err.message.includes('duplicate key')) {
      return res.status(409).json({ error: 'Email sudah terdaftar' });
    }
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/users/:id
const updateUser = async (req, res) => {
  const { full_name, risk_profile, membership_level, avatar_url, has_completed_onboarding } = req.body;
  try {
    const updateData = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (risk_profile !== undefined) updateData.risk_profile = risk_profile;
    if (membership_level !== undefined) updateData.membership_level = membership_level;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (has_completed_onboarding !== undefined) updateData.has_completed_onboarding = has_completed_onboarding;
    updateData.updated_at = new Date().toISOString();

    const { data: user, error } = await supabase
      .from('Users')
      .update(updateData)
      .eq('id', req.params.id)
      .select('id, email, full_name, risk_profile, membership_level, avatar_url, google_id, has_completed_onboarding, created_at')
      .single();

    if (error) throw error;
    res.json({ message: 'User berhasil diupdate', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getUserById, createUser, updateUser };
