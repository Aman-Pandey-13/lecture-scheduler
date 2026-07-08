import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../lib/api.js';

export default function AddCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', level: 'Beginner', description: '' });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('level', form.level);
      payload.append('description', form.description);
      if (image) payload.append('image', image);

      const { data } = await api.post('/courses', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate(`/admin/courses/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create course.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl text-ink">Add course</h1>
      <p className="mt-1 text-sm text-muted">Lecture batches and instructor assignments come next, once this is saved.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="course-name" className="field-label">Course name</label>
          <input
            id="course-name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="field-input"
            placeholder="Data Structures"
          />
        </div>

        <div>
          <label htmlFor="level" className="field-label">Level</label>
          <select
            id="level"
            value={form.level}
            onChange={(e) => setForm({ ...form, level: e.target.value })}
            className="field-input"
          >
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="field-label">Description</label>
          <textarea
            id="description"
            required
            rows={4}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="field-input resize-none"
            placeholder="What this course covers, in a couple of sentences."
          />
        </div>

        <div>
          <label htmlFor="image" className="field-label">Cover image</label>
          <input
            id="image"
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-muted file:mr-4 file:rounded-md file:border file:border-line file:bg-surface file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink hover:file:bg-paper"
          />
        </div>

        {error && <p className="rounded-md bg-warn-light px-3 py-2 text-sm text-warn">{error}</p>}

        <div className="flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Saving…' : 'Save course'}
          </button>
        </div>
      </form>
    </div>
  );
}
