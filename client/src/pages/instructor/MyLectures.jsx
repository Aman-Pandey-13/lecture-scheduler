import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../lib/api.js';

export default function MyLectures() {
  const { user } = useAuth();
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    api
      .get('/lectures/mine')
      .then(({ data }) => setLectures(data))
      .catch(() => setError('Could not load your lectures.'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Instructor') return <Navigate to="/admin" replace />;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="font-display text-2xl text-ink">My lectures</h1>
      <p className="mt-1 text-sm text-muted">Everything assigned to you, earliest first.</p>

      {loading && <p className="mt-6 text-sm text-muted">Loading…</p>}
      {error && <p className="mt-6 rounded-md bg-warn-light px-3 py-2 text-sm text-warn">{error}</p>}

      {!loading && !error && (
        <div className="mt-6 divide-y divide-line rounded-lg border border-line bg-surface shadow-card">
          {lectures.map((lec) => {
            const date = new Date(lec.date);
            return (
              <div key={lec._id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-14 shrink-0 text-center">
                  <p className="font-mono text-xs uppercase text-muted">
                    {date.toLocaleDateString('en-IN', { month: 'short' })}
                  </p>
                  <p className="font-display text-xl text-ink">
                    {date.toLocaleDateString('en-IN', { day: '2-digit' })}
                  </p>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{lec.course?.name}</p>
                  <p className="text-xs text-muted">{lec.batchName}</p>
                </div>
                <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs text-muted">
                  {lec.course?.level}
                </span>
              </div>
            );
          })}

          {lectures.length === 0 && (
            <div className="px-5 py-14 text-center">
              <p className="text-sm text-muted">No lectures assigned to you yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
