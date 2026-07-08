import { BookOpen } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { CourseCard } from "@/components/CourseCard";
import { AddCourseDialog } from "@/components/AddCourseDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useCourses } from "@/hooks/useCourses";

export default function Courses() {
  const { data, isLoading, isError, refetch } = useCourses();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Courses"
        description="Each course holds multiple lecture batches you can schedule."
        actions={<AddCourseDialog />}
      />

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="overflow-hidden rounded-3xl border border-border">
              <Skeleton className="h-40 w-full rounded-none" />
              <div className="space-y-2 p-5">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={BookOpen}
          title="Couldn't load courses"
          description="Something went wrong while fetching your courses."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses yet"
          description="Create your first course to start building lecture batches."
          action={<AddCourseDialog />}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
