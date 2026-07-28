# CLAUDE.md - Agent setup / instructions used for this project

This file documents how Claude was directed while building this project, per the assignment's requirement to commit agent configuration rather than gitignore it.

## Context given to the agent
- The full assignment brief (P0/P1/P2 scope, constraints, non-goals, evaluation criteria).
- Explicit instruction to use React (frontend), Node.js/Express (backend), and to keep the
  implementation understandable enough to explain line-by-line in a follow-up call.

## How work was split
1. Backend first: SQLite schema -> submissions route -> moderation route -> wall route -> server wiring.
   Backend was built and sanity-checked (endpoint by endpoint, via curl) before any frontend code
   was written, so the API contract was settled before the UI was built against it.
2. Embeddable widget (P1) as a standalone vanilla-JS file, deliberately kept separate from the
   React app, since it has to run on arbitrary third-party pages that aren't running React.
3. Frontend: three pages (SubmissionForm, Dashboard, Wall) each calling a single shared `api.js`
   helper, rather than scattering `fetch` calls across components.
4. Supporting docs (README, this file, JOURNAL.md) written last, once the app's actual final
   shape (what got built vs. cut) was known.

## Prompting approach
- Asked for one module/route at a time rather than the whole app in one shot, so each piece
  could be reasoned about and checked before moving on.
- Asked for inline comments explaining *why*, not just *what* (e.g. why duplicate-detection
  happens in the route instead of a DB constraint; why CORS is wide open; why the widget is
  vanilla JS and not React) specifically so they'd hold up under "why does this line exist"
  questions in a follow-up call.

## Verification performed
- Backend endpoints were tested directly with `curl` (health check, submit, list-pending) during
  development to confirm the request/response shapes before wiring the frontend to them.
- NOTE: full end-to-end verification (submit -> approve -> appears on wall, and the widget
  actually rendering in a browser) still needs to be run locally with `npm install` + `npm run dev`
  in an environment with internet access - the environment used to generate this code had no
  network access to install npm packages or run a browser, so that final verification pass is
  the developer's responsibility before submission. See JOURNAL.md.

## What I (the candidate) still need to do before submitting
- Actually run both `npm install` steps, start both servers, and manually walk through the full
  P0 loop myself in a browser.
- Read every file below and be ready to explain any line of it - particularly db.js, the three
  route files, api.js, and widget.js, since those carry most of the actual logic.
- Fill in JOURNAL.md with my own honest reflections, not just what's here.
- Decide on and implement (or consciously skip and note in the journal) the P2 stretch items.
