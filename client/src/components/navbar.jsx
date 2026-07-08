import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="border-b border-line bg-surface">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6" aria-label="Primary">
        <Link to="/" className="font-display text-lg tracking-tight text-ink">
          Scheduler
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">
              {user.name} <span className="text-line">·</span> {user.role}
            </span>
            <button onClick={handleLogout} className="btn-secondary">
              Sign out
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn-primary">
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
