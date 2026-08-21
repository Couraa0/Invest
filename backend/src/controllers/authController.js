const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../config/db');

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
    // Check if email already exists
    const { data: existingUser, error: checkError } = await supabase
      .from('Users')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (checkError) throw checkError;
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const { data: user, error: insertError } = await supabase
      .from('Users')
      .insert([{ email, password_hash, full_name }])
      .select('id, email, full_name, risk_profile, membership_level, has_completed_onboarding, created_at')
      .single();

    if (insertError) throw insertError;

    // Automatically create a Portfolio for the new user (initial cash 100M defaults from schema)
    const { error: portfolioError } = await supabase
      .from('Portfolios')
      .insert([{ user_id: user.id }]);

    if (portfolioError) throw portfolioError;

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

    res.status(201).json({ user, token });
  } catch (err) {
    if (err.message && err.message.includes('duplicate key')) {
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
    const { data: user, error: selectError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (selectError) throw selectError;
    if (!user)
      return res.status(401).json({ error: 'Email atau password salah' });

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
    const { data: user, error: selectError } = await supabase
      .from('Users')
      .select('id, email, full_name, risk_profile, membership_level, avatar_url, has_completed_onboarding, created_at')
      .eq('id', req.userId)
      .maybeSingle();

    if (selectError) throw selectError;
    if (!user) return res.status(404).json({ error: 'User tidak ditemukan' });
    res.json(user);
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

    // Check if user exists
    const { data: existingUser, error: selectError } = await supabase
      .from('Users')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (selectError) throw selectError;

    let user;

    if (existingUser) {
      user = existingUser;
      // If user exists but no google_id, update it
      if (!user.google_id) {
        const { data: updatedUser, error: updateError } = await supabase
          .from('Users')
          .update({
            google_id,
            avatar_url: user.avatar_url || avatar_url,
            auth_provider: 'google'
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) throw updateError;
        user = updatedUser;
      }
    } else {
      // User doesn't exist, create new
      const { data: newUser, error: insertError } = await supabase
        .from('Users')
        .insert([{
          email,
          full_name,
          avatar_url,
          auth_provider: 'google',
          google_id
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      user = newUser;

      // Create Portfolio
      const { error: portfolioError } = await supabase
        .from('Portfolios')
        .insert([{ user_id: user.id }]);

      if (portfolioError) throw portfolioError;
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
