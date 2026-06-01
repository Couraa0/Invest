const { poolPromise, sql } = require('../config/db');

// GET /api/academy/courses
const getCourses = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .query('SELECT * FROM Courses ORDER BY created_at DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/academy/courses/:courseId
const getCourseDetail = async (req, res) => {
  try {
    const pool = await poolPromise;
    const courseRes = await pool.request()
      .input('courseId', sql.UniqueIdentifier, req.params.courseId)
      .query('SELECT * FROM Courses WHERE id = @courseId');
    if (!courseRes.recordset.length) return res.status(404).json({ error: 'Course tidak ditemukan' });

    const modulesRes = await pool.request()
      .input('courseId', sql.UniqueIdentifier, req.params.courseId)
      .query('SELECT * FROM Course_Modules WHERE course_id = @courseId ORDER BY sequence_order ASC');

    res.json({ ...courseRes.recordset[0], modules: modulesRes.recordset });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/academy/progress/:userId
const getUserProgress = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .query(`
        SELECT p.*, c.title as course_title, c.difficulty_level
        FROM User_Course_Progress p
        JOIN Courses c ON p.course_id = c.id
        WHERE p.user_id = @userId
        ORDER BY p.last_accessed DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/academy/progress/:userId/enroll  — daftar kursus
const enrollCourse = async (req, res) => {
  const { course_id } = req.body;
  if (!course_id) return res.status(400).json({ error: 'course_id wajib diisi' });
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .input('courseId', sql.UniqueIdentifier, course_id)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM User_Course_Progress WHERE user_id = @userId AND course_id = @courseId)
          INSERT INTO User_Course_Progress (user_id, course_id) VALUES (@userId, @courseId)
      `);
    res.status(201).json({ message: 'Berhasil mendaftar kursus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/academy/progress/:userId/:courseId  — update progress
const updateProgress = async (req, res) => {
  const { progress_percentage, status } = req.body;
  try {
    const pool = await poolPromise;
    await pool.request()
      .input('userId', sql.UniqueIdentifier, req.params.userId)
      .input('courseId', sql.UniqueIdentifier, req.params.courseId)
      .input('progress', sql.Int, progress_percentage)
      .input('status', sql.VarChar, status || 'Enrolled')
      .query(`
        UPDATE User_Course_Progress SET
          progress_percentage = @progress,
          status = @status,
          last_accessed = CURRENT_TIMESTAMP
        WHERE user_id = @userId AND course_id = @courseId
      `);
    res.json({ message: 'Progress diperbarui' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCourses, getCourseDetail, getUserProgress, enrollCourse, updateProgress };
