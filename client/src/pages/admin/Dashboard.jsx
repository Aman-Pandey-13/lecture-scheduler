import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../lib/api.js';
import CourseCard from '../../components/CourseCard.jsx';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api
      .get('/courses')
      .then(({ data }) => active && setCourses(data))
      .catch(() => active && setError('Could not load courses. Is the server running?'))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl text-ink">Courses</h1>
          <p className="mt-1 text-sm text-muted">{courses.length} total</p>
        </div>
        <Link to="/admin/courses/new" className="btn-primary">
          Add course
        </Link>
      </div>

      {loading && <p className="text-sm text-muted">Loading courses…</p>}
      {error && <p className="rounded-md bg-warn-light px-3 py-2 text-sm text-warn">{error}</p>}

      {!loading && !error && courses.length === 0 && (
        <div className="rounded-lg border border-dashed border-line px-6 py-14 text-center">
          <p className="text-sm text-muted">No courses yet. Add your first one to start scheduling lectures.</p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
