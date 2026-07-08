import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import WeekStrip from '../components/WeekStrip.jsx';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await login(email, password);
      navigate(user.role === 'Admin' ? '/admin' : '/instructor');
    } catch {}
  };

  return (
    <div className="grid min-h-[calc(100vh-4rem-6rem)] grid-cols-1 lg:grid-cols-2">
      {/* Left: app description */}
      <div className="hidden flex-col justify-between bg-ink px-12 py-14 text-paper lg:flex">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-white/50">Scheduler</p>
          <h1 className="mt-6 max-w-sm font-display text-4xl leading-tight text-white">
            One instructor.
            <br />
            One day.
            <br />
            No exceptions.
          </h1>
          <p className="mt-4 max-w-sm text-sm text-white/60">
            Every lecture assignment is checked against the instructor's existing schedule before it's saved —
            so two courses can never claim the same person on the same day.
          </p>
        </div>

        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-white/50">Rahul Mehta — this week</p>
          <WeekStrip booked={[0, 2, 4]} clashIndex={2} />
          <p className="mt-3 max-w-xs text-xs text-white/50">
            Wednesday is already taken — the system blocks any second attempt to book it.
          </p>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex items-center justify-center px-6 py-14">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <h2 className="font-display text-2xl text-ink">Sign in</h2>
          <p className="mt-1 text-sm text-muted">Use your admin or instructor credentials.</p>

          <div className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="field-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field-input"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="field-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field-input"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-warn-light px-3 py-2 text-sm text-warn">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
