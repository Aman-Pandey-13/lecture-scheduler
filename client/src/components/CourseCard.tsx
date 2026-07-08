import { Link } from "react-router-dom";
import { ArrowRight, ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { LevelBadge } from "@/components/LevelBadge";
import { resolveImageUrl } from "@/api/axios";
import type { Course } from "@/lib/types";

const LEVEL_BANDS: Record<Course["level"], string> = {
  Beginner: "from-[#49554f] to-[#2f3832]",
  Intermediate: "from-[#2f446f] to-[#2d3c63]",
  Advanced: "from-[#4c2946] to-[#3f6830]",
};

export function CourseCard({ course }: { course: Course }) {
  const imageUrl = resolveImageUrl(course.image);

  return (
    <Link to={`/admin/courses/${course._id}`} className="group block">
      <Card className="h-full gap-0 rounded-3xl py-0 transition-all hover:border-primary/35 hover:shadow-[0_20px_40px_rgb(0_0_0_/_36%)]">
        <div className={`relative h-40 overflow-hidden bg-gradient-to-r ${LEVEL_BANDS[course.level]}`}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={course.name}
              className="absolute inset-0 h-full w-full object-cover opacity-68"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground/80">
              <ImageIcon className="size-8" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b100b]/35 via-transparent to-transparent" />
          <div className="absolute top-3 left-3">
            <LevelBadge level={course.level} />
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-3 p-5">
          <h3 className="font-heading text-[1.95rem] leading-tight font-semibold tracking-[-0.03em]">
            {course.name}
          </h3>
          <p className="line-clamp-2 text-[1.02rem] leading-7 text-muted-foreground">
            {course.description}
          </p>
          <div className="mt-auto flex items-center justify-between pt-1">
            <span className="text-[1.05rem] text-muted-foreground">
              Manage
            </span>
            <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Card>
    </Link>
  );
}
