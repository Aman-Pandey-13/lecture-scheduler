import { COURSE_LEVELS, type CourseLevel } from "@/lib/types";

const LEVEL_VARS: Record<CourseLevel, string> = {
  Beginner: "var(--level-1)",
  Intermediate: "var(--level-2)",
  Advanced: "var(--level-3)",
};

interface LevelBarChartProps {
  /** Count of courses per level. */
  data: Record<CourseLevel, number>;
  emptyLabel?: string;
}

/**
 * Horizontal bar chart of courses by level.
 * Level is an ordered dimension (Beginner → Advanced), so it uses a single-hue
 * blue ramp light→dark rather than categorical hues. Values are labelled
 * directly on each row, so no legend or value axis is needed.
 */
export function LevelBarChart({ data, emptyLabel }: LevelBarChartProps) {
  const max = Math.max(1, ...COURSE_LEVELS.map((l) => data[l]));
  const total = COURSE_LEVELS.reduce((sum, l) => sum + data[l], 0);

  if (total === 0) {
    return (
      <div className="flex h-40 items-center justify-center text-sm text-muted-foreground">
        {emptyLabel ?? "No data yet"}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {COURSE_LEVELS.map((level) => {
        const value = data[level];
        const pct = (value / max) * 100;
        return (
          <div key={level} className="group flex items-center gap-3">
            <span className="w-32 shrink-0 text-[1.02rem] text-foreground">
              {level}
            </span>
            <div className="relative h-3.5 flex-1 rounded-full bg-[#1a241a]">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out group-hover:brightness-105"
                style={{
                  width: `${Math.max(pct, value > 0 ? 6 : 0)}%`,
                  backgroundColor: LEVEL_VARS[level],
                }}
                title={`${value} ${value === 1 ? "course" : "courses"}`}
              />
            </div>
            <span className="w-6 shrink-0 text-right text-[1.02rem] font-semibold tabular-nums">
              {value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
