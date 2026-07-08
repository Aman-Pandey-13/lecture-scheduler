import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatTileProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  hint?: string;
  loading?: boolean;
}

export function StatTile({
  label,
  value,
  icon: Icon,
  hint,
  loading,
}: StatTileProps) {
  return (
    <Card className="gap-0 rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-[0.88rem] tracking-[0.04em] text-muted-foreground">
          {label}
        </span>
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#162216] text-primary">
          <Icon className="size-4" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mt-3 h-9 w-16" />
      ) : (
        <div className="mt-2 font-heading text-5xl leading-none font-semibold tracking-[-0.03em] tabular-nums">
          {value}
        </div>
      )}
      {hint && !loading && (
        <p className="mt-2 text-xs tracking-[0.06em] text-muted-foreground">{hint}</p>
      )}
    </Card>
  );
}
