# Journal

> **Note to self before submitting:** fill in the bracketed sections below with your own words.
> This needs to reflect what YOU actually understood and decided, not just what was built -
> the follow-up call will be based on this and the code, not on how polished this file sounds.

## What I built and why (P0)
I built the four core pieces in this order: database schema, then the three API routes
(submissions, moderation, wall), then the three frontend pages (submit, dashboard, wall).
I tested the backend with curl before writing any frontend code so I could see exactly what
shape of data each endpoint returned before building UI around it.

[Add: anything you'd explain differently, or any part of this order you'd change if you did it again.]

## Key decisions and tradeoffs
- **SQLite over Postgres/MongoDB:** zero setup, single file, no external account needed - the
  right tradeoff for a 6-10 hour assignment with one business and no real scale requirement.
- **Widget as vanilla JS, not React:** a third-party site embedding this widget almost certainly
  isn't running React, so a self-contained `<script>` tag that injects plain DOM was the only
  approach that works on *any* site regardless of their stack.
- **Duplicate detection as an app-level check, not a DB constraint:** lets me return a friendly
  error message instead of a raw database error, and leaves room for looser duplicate rules later
  (e.g. same email + similar text) without a schema migration.
- **No auth, as instructed:** the dashboard route is unprotected. In a real product this would
  sit behind a login; here it's a conscious, brief-approved simplification.

[Add: was there a decision you made differently than what's written here, or something you
disagreed with while reviewing the code and would build differently?]

## What I cut and why
- P2 (AI feature, live deploy) - [state honestly whether you did this or not, and if not, what
  you would build first with more time - e.g. an AI-generated one-line summary of long
  testimonials using a free Gemini/OpenRouter key, since the wall/widget would benefit most
  from short, scannable testimonial text].
- Photo upload is a URL field, not real file upload - actual file storage (S3/Cloudinary-style)
  felt like a lower priority than getting the core loop and widget solid within the time box.

[Add/adjust based on what you actually finished.]

## How I used AI tools
[Be specific and honest here - this is explicitly graded ("Agent collaboration weighs more than
raw feature count"). Cover:]
- Which tool(s) you used.
- How you split the work into tasks (e.g. backend module by module, then frontend).
- Where you asked for explanations rather than just accepting code.
- Anything you changed, rejected, or wrote yourself after reviewing what came back.
- Any point where the agent's first attempt was wrong or wasn't what you wanted, and what you did about it.

## How I verified things work
[Fill in after you actually run it locally:]
- [ ] `npm install` succeeded in both `backend/` and `frontend/`
- [ ] Ran `npm start` in backend, confirmed `/health` responds
- [ ] Ran `npm run dev` in frontend, submission form loads
- [ ] Submitted a testimonial, saw it appear in Dashboard under "Pending"
- [ ] Approved it, confirmed it appears on `/wall`
- [ ] Rejected a separate test submission, confirmed it does NOT appear on `/wall`
- [ ] Opened `demo/embed-demo.html`, confirmed the widget renders and shows approved testimonials
- [ ] Tried submitting with an invalid email / empty fields, confirmed validation errors show

## If I had more time
[Your honest take - e.g. real file upload for photos, sentiment tagging via a free LLM API,
optimistic UI updates on approve/reject instead of waiting for the request to resolve, a proper
design pass on the widget's visual polish, unit tests for the validation logic.]
