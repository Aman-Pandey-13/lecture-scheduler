import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addCourse, getCourse, getCourses } from "@/api/courses";
import type { AddCourseInput } from "@/api/courses";

export const courseKeys = {
  all: ["courses"] as const,
  detail: (id: string) => ["courses", id] as const,
};

export function useCourses() {
  return useQuery({
    queryKey: courseKeys.all,
    queryFn: getCourses,
  });
}

export function useCourse(id: string) {
  return useQuery({
    queryKey: courseKeys.detail(id),
    queryFn: () => getCourse(id),
    enabled: Boolean(id),
  });
}

export function useAddCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddCourseInput) => addCourse(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courseKeys.all });
    },
  });
}
