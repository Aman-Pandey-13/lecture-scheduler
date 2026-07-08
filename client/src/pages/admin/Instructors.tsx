import { Users } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { InstructorTable } from "@/components/InstructorTable";
import { AddInstructorDialog } from "@/components/AddInstructorDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useInstructors } from "@/hooks/useInstructors";
import { useCourses } from "@/hooks/useCourses";
import { lectureKeys } from "@/hooks/useLectures";
import { getCourseLectures } from "@/api/lectures";

export default function Instructors() {
  const { data, isLoading, isError, refetch } = useInstructors();
  const coursesQuery = useCourses();
  const lectureQueries = useQueries({
    queries: (coursesQuery.data ?? []).map((course) => ({
      queryKey: lectureKeys.byCourse(course._id),
      queryFn: () => getCourseLectures(course._id),
      staleTime: 30_000,
    })),
  });

  const lectureCountByInstructor = lectureQueries
    .flatMap((query) => query.data ?? [])
    .reduce<Record<string, number>>((acc, lecture) => {
      const id = lecture.instructor?._id;
      if (!id) return acc;
      acc[id] = (acc[id] ?? 0) + 1;
      return acc;
    }, {});

  return (
    <div className="space-y-8">
      <PageHeader
        title="Instructors"
        description="Everyone who can be assigned to lecture batches."
        actions={<AddInstructorDialog />}
      />

      {isLoading ? (
        <div className="space-y-3 rounded-3xl border border-border p-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={Users}
          title="Couldn't load instructors"
          description="Something went wrong while fetching the instructor list."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No instructors yet"
          description="Add your first instructor to start scheduling lectures."
          action={<AddInstructorDialog />}
        />
      ) : (
        <InstructorTable
          instructors={data}
          lectureCountByInstructor={lectureCountByInstructor}
        />
      )}
    </div>
  );
}
