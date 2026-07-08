import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/admin', label: 'Courses', end: true },
  { to: '/admin/instructors', label: 'Instructors' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 shrink-0 border-r border-line bg-surface px-4 py-8">
      <nav aria-label="Admin sections">
        <ul className="space-y-1">
          {LINKS.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-accent-light text-accent-dark' : 'text-muted hover:bg-paper hover:text-ink'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
