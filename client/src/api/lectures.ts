import { api } from "./axios";
import type { Lecture, MyLecture } from "@/lib/types";

export async function getCourseLectures(courseId: string): Promise<Lecture[]> {
  const { data } = await api.get<Lecture[]>(`/api/courses/${courseId}/lectures`);
  return data;
}

export interface ScheduleLectureInput {
  instructorId: string;
  date: string; // YYYY-MM-DD
  batchName: string;
}

export async function scheduleLecture(
  courseId: string,
  input: ScheduleLectureInput,
): Promise<Lecture> {
  const { data } = await api.post<Lecture>(
    `/api/courses/${courseId}/lectures`,
    input,
  );
  return data;
}

export async function getMyLectures(): Promise<MyLecture[]> {
  const { data } = await api.get<MyLecture[]>("/api/lectures/mine");
  return data;
}
