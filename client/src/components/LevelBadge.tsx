import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { CourseLevel } from "@/lib/types";

const LEVEL_STYLES: Record<CourseLevel, string> = {
  Beginner:
    "border-[rgb(177_196_165_/_38%)] bg-[rgb(117_138_106_/_22%)] text-[rgb(191_204_184)]",
  Intermediate:
    "border-[rgb(244_200_74_/_38%)] bg-[rgb(244_200_74_/_18%)] text-[rgb(250_214_119)]",
  Advanced:
    "border-[rgb(202_123_232_/_38%)] bg-[rgb(202_123_232_/_20%)] text-[rgb(222_170_243)]",
};

export function LevelBadge({
  level,
  className,
}: {
  level: CourseLevel;
  className?: string;
}) {
  return (
    <Badge
      className={cn(
        "h-7 rounded-full px-3 text-[0.82rem] font-semibold tracking-[-0.01em]",
        LEVEL_STYLES[level],
        className,
      )}
    >
      {level}
    </Badge>
  );
}
