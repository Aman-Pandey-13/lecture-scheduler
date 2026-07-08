# Lecture Scheduler — Client

React + Vite + Tailwind frontend for the lecture scheduling app.

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_URL if your backend runs elsewhere
npm run dev
```

Runs on http://localhost:5173 by default. Requires the backend (`server/`) running on http://localhost:5000.

## Pages

- `/` — public landing page
- `/login` — sign in (admin or instructor)
- `/admin` — course dashboard (protected, Admin only)
- `/admin/instructors` — instructor list + add form
- `/admin/courses/new` — add course
- `/admin/courses/:id` — course detail, assign lecture batches (clash-checked)
- `/instructor` — logged-in instructor's own lecture list

## Design tokens

Defined in `tailwind.config.js`: pine-green accent (`accent`), muted rust for
clash/error states (`warn`), Fraunces for display type, Inter for UI text,
IBM Plex Mono for dates and codes. The `WeekStrip` component is the app's
signature visual — a seven-day strip used to represent conflict-free
scheduling on the login and home screens.
