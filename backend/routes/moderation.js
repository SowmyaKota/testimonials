const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const status = req.query.status;
  let rows;

  if (status && ['pending', 'approved', 'rejected'].includes(status)) {
    rows = db
      .prepare('SELECT * FROM testimonials WHERE status = ? ORDER BY created_at DESC')
      .all(status);
  } else {
    rows = db.prepare('SELECT * FROM testimonials ORDER BY created_at DESC').all();
  }

  res.json(rows);
});

router.patch('/:id/approve', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare(`UPDATE testimonials SET status = 'approved' WHERE id = ?`)
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
  res.json(updated);
});

router.patch('/:id/reject', (req, res) => {
  const { id } = req.params;
  const result = db
    .prepare(`UPDATE testimonials SET status = 'rejected' WHERE id = ?`)
    .run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  const updated = db.prepare('SELECT * FROM testimonials WHERE id = ?').get(id);
  res.json(updated);
});

module.exports = router;
