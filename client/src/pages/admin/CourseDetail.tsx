import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, ImageIcon } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { LevelBadge } from "@/components/LevelBadge";
import { LectureTable } from "@/components/LectureTable";
import { ScheduleLectureForm } from "@/components/ScheduleLectureForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { resolveImageUrl } from "@/api/axios";
import { useCourse } from "@/hooks/useCourses";
import { useCourseLectures } from "@/hooks/useLectures";

export default function CourseDetail() {
  const { id = "" } = useParams();
  const courseQuery = useCourse(id);
  const lecturesQuery = useCourseLectures(id);

  const course = courseQuery.data;
  const imageUrl = resolveImageUrl(course?.image);

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="-ml-2 text-muted-foreground"
        render={<Link to="/admin/courses" />}
      >
        <ArrowLeft className="size-4" />
        Back to courses
      </Button>

      {/* Course header */}
      {courseQuery.isLoading ? (
        <Skeleton className="h-44 w-full rounded-xl" />
      ) : courseQuery.isError || !course ? (
        <EmptyState
          icon={ImageIcon}
          title="Course not found"
          description="This course may have been removed or the link is incorrect."
          action={
            <Button variant="outline" render={<Link to="/admin/courses" />}>
              Back to courses
            </Button>
          }
        />
      ) : (
        <>
          <Card className="gap-0 py-0">
            <div className="flex flex-col sm:flex-row">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={course.name}
                  className="h-44 w-full object-cover sm:w-64"
                />
              ) : (
                <div className="flex h-44 w-full items-center justify-center bg-muted text-muted-foreground sm:w-64">
                  <ImageIcon className="size-8" />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center gap-3 p-6">
                <LevelBadge level={course.level} className="w-fit" />
                <h1 className="font-heading text-2xl font-semibold tracking-tight">
                  {course.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {course.description}
                </p>
              </div>
            </div>
          </Card>

          {/* Lectures + schedule form */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
              <h2 className="font-heading text-lg font-medium">
                Lecture batches
              </h2>
              {lecturesQuery.isLoading ? (
                <div className="space-y-3 rounded-xl border p-4">
                  {[0, 1, 2].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : lecturesQuery.isError ? (
                <EmptyState
                  icon={CalendarDays}
                  title="Couldn't load lectures"
                  action={
                    <Button
                      variant="outline"
                      onClick={() => lecturesQuery.refetch()}
                    >
                      Try again
                    </Button>
                  }
                />
              ) : !lecturesQuery.data || lecturesQuery.data.length === 0 ? (
                <EmptyState
                  icon={CalendarDays}
                  title="No lectures scheduled"
                  description="Use the form to schedule the first lecture batch for this course."
                />
              ) : (
                <LectureTable lectures={lecturesQuery.data} />
              )}
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle>Schedule a lecture</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScheduleLectureForm courseId={id} />
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
