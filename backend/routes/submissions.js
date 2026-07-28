const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { name, email, company, testimonial_text, rating, photo_url } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Name is required.' });
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!testimonial_text || !testimonial_text.trim()) {
    return res.status(400).json({ error: 'Testimonial text is required.' });
  }
  const ratingNum = Number(rating);
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Rating must be a whole number from 1 to 5.' });
  }

  const existing = db
    .prepare(
      `SELECT id FROM testimonials WHERE email = ? AND testimonial_text = ? LIMIT 1`
    )
    .get(email.trim(), testimonial_text.trim());

  if (existing) {
    return res.status(409).json({
      error: 'It looks like you already submitted this exact testimonial.',
    });
  }

  const insert = db.prepare(`
    INSERT INTO testimonials (name, email, company, testimonial_text, rating, photo_url, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `);

  const result = insert.run(
    name.trim(),
    email.trim(),
    company ? company.trim() : null,
    testimonial_text.trim(),
    ratingNum,
    photo_url || null
  );

  const created = db
    .prepare('SELECT * FROM testimonials WHERE id = ?')
    .get(result.lastInsertRowid);

  res.status(201).json(created);
});

module.exports = router;
