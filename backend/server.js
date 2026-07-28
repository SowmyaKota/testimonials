const express = require('express');
const cors = require('cors');
const path = require('path');

const submissionsRouter = require('./routes/submissions');
const moderationRouter = require('./routes/moderation');
const wallRouter = require('./routes/wall');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.use('/widget', express.static(path.join(__dirname, 'public/widget')));

app.use('/api/submissions', submissionsRouter);
app.use('/api/moderation', moderationRouter);
app.use('/api/wall', wallRouter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Testimonial API listening on http://localhost:${PORT}`);
});
