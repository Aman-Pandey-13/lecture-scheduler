import { useState } from "react";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarPlus, Loader2, TriangleAlert, Users } from "lucide-react";
import { toast } from "sonner";
import { useScheduleLecture } from "@/hooks/useLectures";
import { useInstructors } from "@/hooks/useInstructors";
import { getApiErrorMessage } from "@/api/axios";
import {
  scheduleLectureSchema,
  type ScheduleLectureValues,
} from "@/lib/validators";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ScheduleLectureForm({ courseId }: { courseId: string }) {
  const instructorsQuery = useInstructors();
  const scheduleLecture = useScheduleLecture(courseId);
  const [clashMessage, setClashMessage] = useState<string | null>(null);

  const instructors = instructorsQuery.data ?? [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ScheduleLectureValues>({
    resolver: zodResolver(scheduleLectureSchema),
    defaultValues: {
      instructorId: "",
      batchName: "",
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  const onSubmit = (values: ScheduleLectureValues) => {
    setClashMessage(null);
    scheduleLecture.mutate(values, {
      onSuccess: () => {
        toast.success("Lecture scheduled");
        reset({
          instructorId: "",
          batchName: "",
          date: format(new Date(), "yyyy-MM-dd"),
        });
      },
      onError: (error) => {
        // The double-booking rule: surface the API's 409 message verbatim,
        // inline next to the date field — this is the app's headline moment.
        if (axios.isAxiosError(error) && error.response?.status === 409) {
          const message =
            error.response.data?.message ??
            "This instructor is already booked on that date.";
          setClashMessage(message);
          toast.error("Scheduling conflict");
          return;
        }
        toast.error(getApiErrorMessage(error, "Could not schedule lecture"));
      },
    });
  };

  const noInstructors =
    !instructorsQuery.isLoading && instructors.length === 0;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="lecture-instructor">Instructor</Label>
        <Controller
          control={control}
          name="instructorId"
          render={({ field }) => (
            <Select
              value={field.value || null}
              onValueChange={(v) => {
                field.onChange(v ?? "");
                setClashMessage(null);
              }}
              items={instructors.map((i) => ({ label: i.name, value: i._id }))}
            >
              <SelectTrigger
                id="lecture-instructor"
                className="w-full"
                disabled={noInstructors}
              >
                <SelectValue
                  placeholder={
                    noInstructors ? "No instructors yet" : "Select an instructor"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {instructors.map((instructor) => (
                  <SelectItem key={instructor._id} value={instructor._id}>
                    {instructor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.instructorId && (
          <p className="text-xs text-destructive">
            {errors.instructorId.message}
          </p>
        )}
        {noInstructors && (
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="size-3.5" />
            Add an instructor first to schedule lectures.
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lecture-batch">Batch name</Label>
        <Input
          id="lecture-batch"
          placeholder="e.g. Fall 2026 – Cohort A"
          aria-invalid={Boolean(errors.batchName)}
          {...register("batchName")}
        />
        {errors.batchName && (
          <p className="text-xs text-destructive">{errors.batchName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lecture-date">Lecture date</Label>
        <Input
          id="lecture-date"
          type="date"
          aria-invalid={Boolean(errors.date) || Boolean(clashMessage)}
          {...register("date", {
            onChange: () => setClashMessage(null),
          })}
        />
        {errors.date && (
          <p className="text-xs text-destructive">{errors.date.message}</p>
        )}
        {/* Inline clash error — the exact 409 from the API, shown at the date field. */}
        {clashMessage && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
          >
            <TriangleAlert className="mt-0.5 size-4 shrink-0" />
            <span>{clashMessage}</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={scheduleLecture.isPending || noInstructors}
      >
        {scheduleLecture.isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <CalendarPlus className="size-4" />
        )}
        {scheduleLecture.isPending ? "Scheduling…" : "Schedule lecture"}
      </Button>
    </form>
  );
}
