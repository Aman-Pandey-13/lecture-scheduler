import { api } from "./axios";
import type { Course, CourseLevel } from "@/lib/types";

export async function getCourses(): Promise<Course[]> {
  const { data } = await api.get<Course[]>("/api/courses");
  return data;
}

export async function getCourse(id: string): Promise<Course> {
  const { data } = await api.get<Course>(`/api/courses/${id}`);
  return data;
}

export interface AddCourseInput {
  name: string;
  level: CourseLevel;
  description: string;
  image?: File | null;
}

export async function addCourse(input: AddCourseInput): Promise<Course> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("level", input.level);
  form.append("description", input.description);
  if (input.image) {
    form.append("image", input.image);
  }
  const { data } = await api.post<Course>("/api/courses", form);
  return data;
}
