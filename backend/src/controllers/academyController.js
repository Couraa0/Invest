const { supabase } = require('../config/db');

// GET /api/academy/courses
const getCourses = async (req, res) => {
  try {
    const { data: courses, error } = await supabase
      .from('Courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/academy/courses/:courseId
const getCourseDetail = async (req, res) => {
  try {
    const { data: course, error: courseError } = await supabase
      .from('Courses')
      .select('*')
      .eq('id', req.params.courseId)
      .maybeSingle();

    if (courseError) throw courseError;
    if (!course) return res.status(404).json({ error: 'Course tidak ditemukan' });

    const { data: modules, error: modulesError } = await supabase
      .from('Course_Modules')
      .select('*')
      .eq('course_id', req.params.courseId)
      .order('sequence_order', { ascending: true });

    if (modulesError) throw modulesError;

    res.json({ ...course, modules });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/academy/progress/:userId
const getUserProgress = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('User_Course_Progress')
      .select('*, Courses:course_id(title, difficulty_level)')
      .eq('user_id', req.params.userId)
      .order('last_accessed', { ascending: false });

    if (error) throw error;

    const formatted = (data || []).map(row => ({
      user_id: row.user_id,
      course_id: row.course_id,
      status: row.status,
      progress_percentage: row.progress_percentage,
      last_accessed: row.last_accessed,
      course_title: row.Courses ? row.Courses.title : null,
      difficulty_level: row.Courses ? row.Courses.difficulty_level : null
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/academy/progress/:userId/enroll  — daftar kursus
const enrollCourse = async (req, res) => {
  const { course_id } = req.body;
  if (!course_id) return res.status(400).json({ error: 'course_id wajib diisi' });
  try {
    // Cek apakah sudah terdaftar
    const { data: existing, error: checkError } = await supabase
      .from('User_Course_Progress')
      .select('*')
      .eq('user_id', req.params.userId)
      .eq('course_id', course_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!existing) {
      const { error: insError } = await supabase
        .from('User_Course_Progress')
        .insert([{ user_id: req.params.userId, course_id }]);

      if (insError) throw insError;
    }

    res.status(201).json({ message: 'Berhasil mendaftar kursus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/academy/progress/:userId/:courseId  — update progress
const updateProgress = async (req, res) => {
  const { progress_percentage, status } = req.body;
  try {
    const { error } = await supabase
      .from('User_Course_Progress')
      .update({
        progress_percentage: progress_percentage,
        status: status || 'Enrolled',
        last_accessed: new Date().toISOString()
      })
      .eq('user_id', req.params.userId)
      .eq('course_id', req.params.courseId);

    if (error) throw error;
    res.json({ message: 'Progress diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/academy/watched/:userId
const getWatchedVideos = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('User_Watched_Videos')
      .select('video_id')
      .eq('user_id', req.params.userId);

    if (error) throw error;
    res.json((data || []).map(row => row.video_id));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/academy/watched/:userId
const markVideoWatched = async (req, res) => {
  const { video_id } = req.body;
  if (!video_id) return res.status(400).json({ error: 'video_id wajib diisi' });
  try {
    // Cek apakah sudah ditonton
    const { data: existing, error: checkError } = await supabase
      .from('User_Watched_Videos')
      .select('*')
      .eq('user_id', req.params.userId)
      .eq('video_id', video_id)
      .maybeSingle();

    if (checkError) throw checkError;

    if (!existing) {
      const { error: insError } = await supabase
        .from('User_Watched_Videos')
        .insert([{ user_id: req.params.userId, video_id }]);

      if (insError) throw insError;
    }

    res.json({ message: 'Video ditandai selesai' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCourses, getCourseDetail, getUserProgress, enrollCourse, updateProgress, getWatchedVideos, markVideoWatched };
