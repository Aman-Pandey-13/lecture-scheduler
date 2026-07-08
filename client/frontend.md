# Lecture Scheduler — Frontend Plan (React + Vite)

Plan for a professional, modern admin/instructor web app on top of the existing Express/MongoDB API in `../server`. Read this together with the root `README.md` (API reference, data models, auth flow).

---

## 1. Goals

- Public **marketing/hero landing page** that explains the product and links to login.
- **Admin dashboard**: manage instructors, courses, and lecture batches, with live clash-prevention feedback.
- **Instructor dashboard**: read-only view of "my lectures" (date + course).
- Feels like a real SaaS product — not a bare CRUD form: clean typography, consistent spacing, motion on state changes, empty/loading/error states everywhere, responsive down to mobile.

---

## 2. Tech Stack (current, actively maintained as of 2026)

| Purpose | Choice | Why |
|---|---|---|
| Build tool | **Vite** | Fast dev server/HMR, standard for new React apps |
| Framework | **React 19** | Latest stable, works cleanly with Vite's `react` template |
| Language | **TypeScript** | Type-safe API contracts against the Express backend |
| Styling | **Tailwind CSS v4** | Utility-first, fast to build a consistent design system |
| Component library | **shadcn/ui** | Copy-in (not npm-locked) accessible components built on Radix + Tailwind — gives a professional look fast and stays fully customizable |
| Icons | **lucide-react** | Pairs with shadcn/ui, clean line icons |
| Routing | **React Router v7** | Standard client-side routing, data APIs (loaders/actions) optional |
| Server state / caching | **TanStack Query v5** | Handles API fetch/cache/invalidation (course list, instructor list, lectures) far better than manual `useEffect` |
| Forms & validation | **React Hook Form + Zod** | Robust validation for add-course / add-instructor / schedule-lecture forms, matches backend required fields |
| HTTP client | **Axios** | Interceptor support for attaching JWT + centralized error handling |
| Auth/session state | **Zustand** (small store) | Lightweight global store for `{ token, user }`, persisted to `localStorage` |
| Date handling | **date-fns** | Formatting/parsing lecture dates, clash-date display |
| Toast/notifications | **sonner** | Clean toast for success/error (e.g. "409 instructor already booked") |
| Motion | **motion** (formerly Framer Motion) | Page transitions, hero animation, subtle micro-interactions |
| Charts (optional, admin overview) | **Recharts** | If an admin stats/overview panel is added (lectures per week, courses by level) |

Install once scaffolded:
```bash
npm create vite@latest client -- --template react-ts
cd client
npm install react-router-dom @tanstack/react-query axios zustand \
  react-hook-form zod @hookform/resolvers date-fns sonner motion lucide-react
npx shadcn@latest init
```

---

## 3. Design Direction

- **Look & feel**: modern SaaS dashboard — think Linear/Vercel dashboard energy. Neutral base (slate/zinc) + one confident accent color for CTAs and active states. Generous whitespace, rounded-xl cards, soft shadows, no visual noise.
- **Typography**: one variable font (e.g. Inter or Geist) — large confident headings on the hero, tight functional type in the dashboard tables/forms.
- **Layout**: hero/marketing page is full-width single-column sections; dashboard pages use a persistent sidebar (nav) + topbar (user menu, logout) + content area, collapsible sidebar on mobile.
- **States to design for on every data view**: loading (skeleton), empty (friendly empty state with CTA), error (retry action), success (toast).
- **Feedback for the core business rule**: when an admin tries to double-book an instructor, surface the exact `409` message from the API inline near the date field, not just a toast — this is the single most important UX moment in the app since it's the spec's headline feature.
- **Accessibility**: shadcn/ui + Radix gives keyboard nav and ARIA out of the box — don't fight it with custom overlays.

Before implementing pages, load Claude Code's `dataviz` skill for any stat tiles/charts on the admin overview (color rules, tile layout, sparkline conventions) — this project's `Skill` tool already has `dataviz` available.

---

## 4. Routes / Pages Map

| Route | Access | Page | Purpose |
|---|---|---|---|
| `/` | Public | **Hero / Landing** | Product pitch, feature highlights (instructor mgmt, clash-free scheduling, course batches), CTA → `/login` |
| `/login` | Public | **Login** | Email + password → calls `POST /api/auth/login`, stores JWT, redirects by role (`Admin` → `/admin`, `Instructor` → `/instructor`) |
| `/admin` | Admin only | **Admin Overview** | Stat tiles (total courses, instructors, lectures this week), quick links |
| `/admin/instructors` | Admin only | **Instructors** | Table of instructors (`GET /api/instructors`) + "Add Instructor" dialog/form (`POST /api/instructors`) |
| `/admin/courses` | Admin only | **Courses** | Grid/list of courses with image, level badge (`GET /api/courses`) + "Add Course" dialog with image upload (`POST /api/courses`) |
| `/admin/courses/:id` | Admin only | **Course Detail** | Course info + its lecture batches table (`GET /api/courses/:courseId/lectures`) + "Schedule Lecture" form (instructor select + date picker) (`POST /api/courses/:courseId/lectures`); inline clash error shown here |
| `/instructor` | Instructor only | **My Lectures** | Table/calendar of the logged-in instructor's lectures with course name + date (`GET /api/lectures/mine`) |
| `*` | Public | **404** | Not found, link home |

Route protection: a `<ProtectedRoute role="Admin">` / `<ProtectedRoute role="Instructor">` wrapper reads the Zustand auth store; unauthenticated → redirect to `/login`; wrong role → redirect to their own dashboard.

---

## 5. Folder Structure

```
client/
├── src/
│   ├── main.tsx
│   ├── App.tsx                 # router setup
│   ├── api/
│   │   ├── axios.ts            # instance + JWT interceptor
│   │   ├── auth.ts
│   │   ├── instructors.ts
│   │   ├── courses.ts
│   │   └── lectures.ts
│   ├── store/
│   │   └── authStore.ts        # zustand: { token, user, login, logout }
│   ├── components/
│   │   ├── ui/                 # shadcn/ui generated components
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx   # sidebar + topbar
│   │   │   └── PublicLayout.tsx
│   │   ├── ProtectedRoute.tsx
│   │   ├── InstructorTable.tsx
│   │   ├── CourseCard.tsx
│   │   ├── LectureTable.tsx
│   │   ├── AddInstructorDialog.tsx
│   │   ├── AddCourseDialog.tsx
│   │   └── ScheduleLectureForm.tsx
│   ├── pages/
│   │   ├── Hero.tsx
│   │   ├── Login.tsx
│   │   ├── admin/
│   │   │   ├── AdminOverview.tsx
│   │   │   ├── Instructors.tsx
│   │   │   ├── Courses.tsx
│   │   │   └── CourseDetail.tsx
│   │   ├── instructor/
│   │   │   └── MyLectures.tsx
│   │   └── NotFound.tsx
│   ├── hooks/                  # useInstructors, useCourses, useLectures (TanStack Query wrappers)
│   └── lib/
│       └── validators.ts       # Zod schemas matching backend required fields
├── index.html
├── vite.config.ts
└── package.json
```

---

## 6. API Integration Notes (match current backend exactly)

- Base URL: `http://localhost:5000` (env var `VITE_API_URL`).
- Auth header: `Authorization: Bearer <token>` attached via Axios interceptor from the Zustand store.
- `POST /api/courses` must be sent as `multipart/form-data` (fields: `name`, `level`, `description`, `image` file) — do not JSON.stringify the image field.
- `POST /api/courses/:courseId/lectures` body: `{ instructorId, date, batchName }`. On `409`, show the API's message verbatim (it already names the clashing date) — this is the double-booking rule, don't reword it.
- `GET /api/lectures/mine` requires the instructor's own JWT — do not attempt an admin-viewing-instructor's-schedule feature unless the backend adds it.
- Roles come from the JWT payload (`{ userId, role }`) returned at login — persist `user.role` from the login response body, not by decoding the token client-side.

---

## 7. Build Milestones

1. Scaffold Vite + TS + Tailwind + shadcn/ui, set up routing shell and layouts.
2. Auth: login page, axios interceptor, Zustand store, `ProtectedRoute`.
3. Hero/landing page (marketing content + motion).
4. Admin: Instructors page (list + add).
5. Admin: Courses page (list + add with image upload).
6. Admin: Course Detail page (lectures table + schedule form + inline clash handling) — this is the core feature, test it thoroughly.
7. Instructor: My Lectures page.
8. Polish pass: loading/empty/error states, responsive check, toasts, 404 page.
9. Use the `run` skill to launch the app and click through the golden path (add instructor → add course → schedule lecture → trigger a clash → view as instructor) before calling it done.

---

## 8. Prompt to give Claude to build this

Copy-paste the block below as your next message once you want Claude to actually build the frontend:

```
Build the React + Vite frontend for this project exactly as planned in client/frontend.md.

Read client/frontend.md and the root README.md first for the tech stack, routes,
folder structure, and API contract — follow them precisely rather than re-deciding
architecture. The backend is already running in server/ (Express + MongoDB) with
working endpoints for auth, instructors, courses, and lectures, including the
cross-course double-booking clash check on POST /api/courses/:courseId/lectures.

Requirements:
- Scaffold Vite + React + TypeScript in client/, install the exact stack listed
  in frontend.md section 2 (Tailwind v4, shadcn/ui, React Router v7, TanStack
  Query v5, React Hook Form + Zod, Axios, Zustand, date-fns, sonner, motion,
  lucide-react).
- Implement every route in frontend.md section 4: hero, login, admin overview,
  instructors, courses, course detail (with schedule-lecture form and inline
  clash error), and instructor "my lectures". Include a 404 page.
- Use the folder structure in section 5 as a guide (adjust only if there's a
  clearly better idiomatic fit).
- Design must feel professional: consistent spacing/typography, a persistent
  sidebar dashboard layout for admin/instructor views, loading skeletons, empty
  states, and toasts on success/error. Use the `dataviz` skill before building
  any stat tiles/charts on the admin overview page.
- Wire real API calls per section 6 — no mocked data. Test the login flow,
  role-based redirects, and the double-booking clash scenario end to end against
  the running backend.
- After building, use the `run` skill to launch the app and manually verify the
  golden path (add instructor → add course → schedule a lecture → attempt a
  clashing schedule and confirm the inline error → log in as that instructor and
  confirm their lecture list is correct) before reporting done.
```
