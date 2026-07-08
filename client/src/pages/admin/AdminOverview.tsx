import { Link } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import {
  endOfWeek,
  format,
  isWithinInterval,
  parseISO,
  startOfWeek,
} from "date-fns";
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  CalendarDays,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatTile } from "@/components/StatTile";
import { LevelBarChart } from "@/components/LevelBarChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCourses } from "@/hooks/useCourses";
import { useInstructors } from "@/hooks/useInstructors";
import { getCourseLectures } from "@/api/lectures";
import { lectureKeys } from "@/hooks/useLectures";
import { COURSE_LEVELS, type CourseLevel, type Lecture } from "@/lib/types";

export default function AdminOverview() {
  const coursesQuery = useCourses();
  const instructorsQuery = useInstructors();
  const courses = coursesQuery.data ?? [];

  // Fetch lectures for every course so we can aggregate schedule stats.
  const lectureQueries = useQueries({
    queries: courses.map((course) => ({
      queryKey: lectureKeys.byCourse(course._id),
      queryFn: () => getCourseLectures(course._id),
      staleTime: 30_000,
    })),
  });

  const lecturesLoading =
    coursesQuery.isLoading || lectureQueries.some((q) => q.isLoading);

  const courseNameById = new Map(courses.map((c) => [c._id, c.name]));

  const allLectures: (Lecture & { courseName?: string })[] = lectureQueries
    .flatMap((q, i) => {
      const courseId = courses[i]?._id;
      return (q.data ?? []).map((lec) => ({
        ...lec,
        courseName: courseId ? courseNameById.get(courseId) : undefined,
      }));
    });

  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });
  const lecturesThisWeek = allLectures.filter((lec) =>
    isWithinInterval(parseISO(lec.lectureDate), {
      start: weekStart,
      end: weekEnd,
    }),
  ).length;

  // Courses grouped by level for the distribution chart.
  const byLevel = COURSE_LEVELS.reduce(
    (acc, level) => {
      acc[level] = courses.filter((c) => c.level === level).length;
      return acc;
    },
    {} as Record<CourseLevel, number>,
  );

  // Upcoming lectures (today onward), soonest first.
  const upcoming = allLectures
    .filter((lec) => parseISO(lec.lectureDate) >= new Date(now.toDateString()))
    .sort(
      (a, b) =>
        parseISO(a.lectureDate).getTime() - parseISO(b.lectureDate).getTime(),
    )
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Overview"
        description="A snapshot of your instructors, courses, and scheduled lectures."
      />

      {/* Stat tiles */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          label="Courses"
          value={courses.length}
          icon={BookOpen}
          loading={coursesQuery.isLoading}
        />
        <StatTile
          label="Instructors"
          value={instructorsQuery.data?.length ?? 0}
          icon={Users}
          loading={instructorsQuery.isLoading}
        />
        <StatTile
          label="Lectures scheduled"
          value={allLectures.length}
          icon={CalendarDays}
          loading={lecturesLoading}
        />
        <StatTile
          label="This week"
          value={lecturesThisWeek}
          icon={CalendarClock}
          hint={`${format(weekStart, "MMM d")} – ${format(weekEnd, "MMM d")}`}
          loading={lecturesLoading}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        {/* Level distribution */}
        <Card className="rounded-2xl lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-[2rem] tracking-[-0.02em]">Courses by level</CardTitle>
          </CardHeader>
          <CardContent>
            {coursesQuery.isLoading ? (
              <div className="space-y-3">
                {[0, 1, 2].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            ) : (
              <LevelBarChart
                data={byLevel}
                emptyLabel="Add a course to see the breakdown"
              />
            )}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="rounded-2xl lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-[2rem] tracking-[-0.02em]">Quick actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="h-auto w-full justify-between rounded-xl border-border bg-[#111912]/75 px-4 py-3 text-[1rem]"
              render={<Link to="/admin/instructors" />}
            >
              <span className="flex items-center gap-2">
                <Users className="size-4" />
                Manage instructors
              </span>
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              className="h-auto w-full justify-between rounded-xl border-border bg-[#111912]/75 px-4 py-3 text-[1rem]"
              render={<Link to="/admin/courses" />}
            >
              <span className="flex items-center gap-2">
                <BookOpen className="size-4" />
                Manage courses
              </span>
              <ArrowRight className="size-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming lectures */}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-[2rem] tracking-[-0.02em]">Upcoming lectures</CardTitle>
        </CardHeader>
        <CardContent>
          {lecturesLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : upcoming.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No upcoming lectures scheduled.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-2xl border border-border/80">
              {upcoming.map((lec) => (
                <li
                  key={lec._id}
                  className="flex items-center justify-between gap-4 border-b border-border/80 px-4 py-4 last:border-b-0"
                >
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex w-12 shrink-0 flex-col items-center rounded-lg bg-[#111a11] py-2">
                      <span className="text-[0.64rem] font-semibold tracking-[0.14em] text-primary uppercase">
                        {format(parseISO(lec.lectureDate), "EEE")}
                      </span>
                      <span className="font-heading text-2xl leading-none font-semibold tracking-[-0.03em]">
                        {format(parseISO(lec.lectureDate), "d")}
                      </span>
                      <span className="text-[0.62rem] text-muted-foreground uppercase">
                        {format(parseISO(lec.lectureDate), "MMM")}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[1.05rem] font-semibold">
                        {lec.batchName}
                      </p>
                      <p className="truncate text-sm text-muted-foreground">
                        {lec.courseName ?? "Course"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex size-7 items-center justify-center rounded-full bg-[#1a231b] text-[0.65rem] font-semibold text-[#9ca896]">
                      {lec.instructor?.name
                        ?.split(" ")
                        .map((p) => p[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() ?? "?"}
                    </span>
                    <span className="hidden min-w-20 text-right sm:inline">
                      {lec.instructor?.name ?? "Unassigned"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
