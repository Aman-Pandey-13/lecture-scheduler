import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../lib/api.js';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ instructorId: '', date: '', batchName: '' });
  const [submitting, setSubmitting] = useState(false);
  const [clashError, setClashError] = useState(null);

  const loadAll = () => {
    setLoading(true);
    Promise.all([
      api.get(`/courses/${id}`),
      api.get(`/courses/${id}/lectures`),
      api.get('/instructors'),
    ])
      .then(([courseRes, lecturesRes, instructorsRes]) => {
        setCourse(courseRes.data);
        setLectures(lecturesRes.data);
        setInstructors(instructorsRes.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(loadAll, [id]);

  const handleAssign = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setClashError(null);
    try {
      await api.post(`/courses/${id}/lectures`, form);
      setForm({ instructorId: '', date: '', batchName: '' });
      loadAll();
    } catch (err) {
      // 409 is the clash rejection from the backend — the whole point of this app
      setClashError(err.response?.data?.message || 'Could not assign this lecture.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading course…</p>;
  if (!course) return <p className="text-sm text-warn">Course not found.</p>;

  return (
    <div>
      <div className="mb-8 flex items-start gap-6">
        <div className="h-20 w-32 shrink-0 overflow-hidden rounded-md bg-accent-light">
          {course.image && <img src={course.image} alt="" className="h-full w-full object-cover" />}
        </div>
        <div>
          <span className="rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
            {course.level}
          </span>
          <h1 className="mt-2 font-display text-2xl text-ink">{course.name}</h1>
          <p className="mt-1 max-w-lg text-sm text-muted">{course.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Lecture list */}
        <div className="lg:col-span-3">
          <h2 className="mb-4 font-display text-lg text-ink">Lecture batches</h2>
          <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-card">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-line bg-paper text-xs uppercase tracking-wide text-muted">
                  <th className="px-4 py-3 font-medium">Batch</th>
                  <th className="px-4 py-3 font-medium">Instructor</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {lectures.map((lec) => (
                  <tr key={lec._id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-ink">{lec.batchName || '—'}</td>
                    <td className="px-4 py-3 text-ink">{lec.instructor?.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {new Date(lec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
                {lectures.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-muted">
                      No lecture batches yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Assign form */}
        <div className="lg:col-span-2">
          <h2 className="mb-4 font-display text-lg text-ink">Assign a lecture</h2>
          <form onSubmit={handleAssign} className="rounded-lg border border-line bg-surface p-5 shadow-card">
            <div className="space-y-4">
              <div>
                <label htmlFor="batchName" className="field-label">Batch name</label>
                <input
                  id="batchName"
                  required
                  value={form.batchName}
                  onChange={(e) => setForm({ ...form, batchName: e.target.value })}
                  className="field-input"
                  placeholder="Batch 1"
                />
              </div>

              <div>
                <label htmlFor="instructorId" className="field-label">Instructor</label>
                <select
                  id="instructorId"
                  required
                  value={form.instructorId}
                  onChange={(e) => setForm({ ...form, instructorId: e.target.value })}
                  className="field-input"
                >
                  <option value="" disabled>Select an instructor</option>
                  {instructors.map((ins) => (
                    <option key={ins._id} value={ins._id}>{ins.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className="field-label">Date</label>
                <input
                  id="date"
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="field-input"
                />
              </div>
            </div>

            {clashError && (
              <p role="alert" className="mt-4 rounded-md bg-warn-light px-3 py-2 text-sm text-warn">
                {clashError}
              </p>
            )}

            <button type="submit" disabled={submitting} className="btn-primary mt-5 w-full">
              {submitting ? 'Checking availability…' : 'Assign lecture'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
