import { format, parseISO } from "date-fns";
import { CalendarDays, CalendarX } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState } from "@/components/EmptyState";
import { LevelBadge } from "@/components/LevelBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMyLectures } from "@/hooks/useLectures";

export default function MyLectures() {
  const { data, isLoading, isError, refetch } = useMyLectures();

  const today = new Date(new Date().toDateString());
  const sorted = [...(data ?? [])].sort(
    (a, b) =>
      parseISO(a.lectureDate).getTime() - parseISO(b.lectureDate).getTime(),
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="My lectures"
        description="Every lecture batch assigned to you, across all courses."
      />

      {isLoading ? (
        <div className="space-y-3 rounded-xl border p-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState
          icon={CalendarX}
          title="Couldn't load your lectures"
          description="Something went wrong while fetching your schedule."
          action={
            <Button variant="outline" onClick={() => refetch()}>
              Try again
            </Button>
          }
        />
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="No lectures assigned yet"
          description="When an administrator schedules you for a lecture, it will appear here."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((lecture) => {
                const isPast = parseISO(lecture.lectureDate) < today;
                return (
                  <TableRow key={lecture._id} className={isPast ? "opacity-60" : ""}>
                    <TableCell className="font-medium">
                      {lecture.course?.name ?? "Course"}
                    </TableCell>
                    <TableCell>
                      {lecture.course?.level && (
                        <LevelBadge level={lecture.course.level} />
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {lecture.batchName}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground">
                      {format(parseISO(lecture.lectureDate), "EEE, MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
