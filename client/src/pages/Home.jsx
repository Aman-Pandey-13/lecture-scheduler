import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import WeekStrip from '../components/WeekStrip.jsx';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={user.role === 'Admin' ? '/admin' : '/instructor'} replace />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent-dark">Lecture scheduling</p>
          <h1 className="mt-4 font-display text-5xl leading-[1.1] text-ink">
            Schedules that
            <br />
            can't collide.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
            Admins assign courses, batches, and instructors. Every date is checked against that instructor's
            existing bookings first — so a clash is caught before it's ever saved, not after.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/login" className="btn-primary">
              Sign in
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-surface p-8 shadow-card">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted">Example: Priya Shah</p>
          <div className="space-y-4">
            <div>
              <p className="mb-2 text-sm text-ink">Week of Jan 5</p>
              <WeekStrip booked={[0, 3]} />
            </div>
            <div className="border-t border-line pt-4">
              <p className="mb-2 text-sm text-ink">Attempting a second booking on Monday</p>
              <WeekStrip booked={[0, 3]} clashIndex={0} />
              <p className="mt-2 text-xs text-warn">Blocked — Priya already has a lecture that day.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
