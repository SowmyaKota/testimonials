const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const offset = (page - 1) * limit;

  const rows = db
    .prepare(
      `SELECT id, name, company, testimonial_text, rating, photo_url, created_at
       FROM testimonials
       WHERE status = 'approved'
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`
    )
    .all(limit, offset);

  const { count } = db
    .prepare(`SELECT COUNT(*) as count FROM testimonials WHERE status = 'approved'`)
    .get();

  res.json({
    testimonials: rows,
    page,
    limit,
    total: count,
    hasMore: offset + rows.length < count,
  });
});

module.exports = router;
