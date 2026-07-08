import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCourseLectures,
  getMyLectures,
  scheduleLecture,
} from "@/api/lectures";
import type { ScheduleLectureInput } from "@/api/lectures";

export const lectureKeys = {
  byCourse: (courseId: string) => ["lectures", "course", courseId] as const,
  mine: ["lectures", "mine"] as const,
};

export function useCourseLectures(courseId: string) {
  return useQuery({
    queryKey: lectureKeys.byCourse(courseId),
    queryFn: () => getCourseLectures(courseId),
    enabled: Boolean(courseId),
  });
}

export function useScheduleLecture(courseId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ScheduleLectureInput) =>
      scheduleLecture(courseId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: lectureKeys.byCourse(courseId) });
    },
  });
}

export function useMyLectures() {
  return useQuery({
    queryKey: lectureKeys.mine,
    queryFn: getMyLectures,
  });
}
