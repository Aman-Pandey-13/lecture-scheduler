import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addInstructor, getInstructors } from "@/api/instructors";
import type { AddInstructorInput } from "@/api/instructors";

export const instructorKeys = {
  all: ["instructors"] as const,
};

export function useInstructors() {
  return useQuery({
    queryKey: instructorKeys.all,
    queryFn: getInstructors,
  });
}

export function useAddInstructor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: AddInstructorInput) => addInstructor(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: instructorKeys.all });
    },
  });
}
