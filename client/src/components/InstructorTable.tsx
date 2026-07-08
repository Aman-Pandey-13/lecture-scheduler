import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Instructor } from "@/lib/types";

function initials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function InstructorTable({
  instructors,
  lectureCountByInstructor,
}: {
  instructors: Instructor[];
  lectureCountByInstructor?: Record<string, number>;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-[linear-gradient(180deg,rgb(18_26_18_/_65%),rgb(10_15_10_/_88%))]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Lectures</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {instructors.map((instructor) => (
            <TableRow key={instructor._id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar size="sm">
                    <AvatarFallback>{initials(instructor.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-[1.06rem] leading-none font-semibold tracking-[-0.01em]">
                    {instructor.name}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[1.02rem] leading-none text-muted-foreground">
                {instructor.email}
              </TableCell>
              <TableCell className="text-right text-[1rem] leading-none font-semibold text-foreground">
                {lectureCountByInstructor?.[instructor._id] ?? 0}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
