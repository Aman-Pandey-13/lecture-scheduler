import { Link } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Link
      to={`/admin/courses/${course._id}`}
      className="group block overflow-hidden rounded-lg border border-line bg-surface shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[16/9] w-full bg-accent-light">
        {course.image ? (
          <img
            src={course.image}
            alt={`Cover for ${course.name}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl text-accent-dark">
            {course.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-1.5 flex items-center justify-between gap-2">
          <h3 className="font-display text-base text-ink">{course.name}</h3>
          <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-xs font-medium text-muted">
            {course.level}
          </span>
        </div>
        <p className="line-clamp-2 text-sm text-muted">{course.description}</p>
        <p className="mt-3 font-mono text-xs text-accent-dark">
          {course.lectureCount ?? 0} lecture{course.lectureCount === 1 ? '' : 's'} scheduled
        </p>
      </div>
    </Link>
  );
}
