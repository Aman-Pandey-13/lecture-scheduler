import { useEffect, useState } from 'react';
import api from '../../lib/api.js';

export default function Instructors() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const loadInstructors = () => {
    setLoading(true);
    api
      .get('/instructors')
      .then(({ data }) => setInstructors(data))
      .catch(() => setError('Could not load instructors.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadInstructors, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await api.post('/instructors', form);
      setForm({ name: '', email: '', password: '' });
      setFormOpen(false);
      loadInstructors();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add instructor.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Instructors</h1>
          <p className="mt-1 text-sm text-muted">{instructors.length} total</p>
        </div>
        <button onClick={() => setFormOpen((v) => !v)} className="btn-primary">
          {formOpen ? 'Cancel' : 'Add instructor'}
        </button>
      </div>

      {formOpen && (
        <form onSubmit={handleSubmit} className="mb-8 rounded-lg border border-line bg-surface p-6 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="name" className="field-label">Name</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="ins-email" className="field-label">Email</label>
              <input
                id="ins-email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="field-input"
              />
            </div>
            <div>
              <label htmlFor="ins-password" className="field-label">Temporary password</label>
              <input
                id="ins-password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="field-input"
              />
            </div>
          </div>
          {error && <p className="mt-4 rounded-md bg-warn-light px-3 py-2 text-sm text-warn">{error}</p>}
          <button type="submit" disabled={submitting} className="btn-primary mt-5">
            {submitting ? 'Adding…' : 'Add instructor'}
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading instructors…</p>
      ) : (
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((ins) => (
                <tr key={ins._id} className="border-b border-line last:border-0">
                  <td className="px-5 py-3 text-ink">{ins.name}</td>
                  <td className="px-5 py-3 font-mono text-xs text-muted">{ins.email}</td>
                </tr>
              ))}
              {instructors.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-5 py-8 text-center text-muted">
                    No instructors yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
