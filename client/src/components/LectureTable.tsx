import { format, parseISO } from "date-fns";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Lecture } from "@/lib/types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function LectureTable({ lectures }: { lectures: Lecture[] }) {
  const sorted = [...lectures].sort(
    (a, b) =>
      parseISO(a.lectureDate).getTime() - parseISO(b.lectureDate).getTime(),
  );

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Batch</TableHead>
            <TableHead>Instructor</TableHead>
            <TableHead className="text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((lecture) => (
            <TableRow key={lecture._id}>
              <TableCell className="font-medium">
                {lecture.batchName}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {lecture.instructor
                        ? initials(lecture.instructor.name)
                        : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-muted-foreground">
                    {lecture.instructor?.name ?? "Unassigned"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {format(parseISO(lecture.lectureDate), "EEE, MMM d, yyyy")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
