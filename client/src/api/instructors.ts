import { api } from "./axios";
import type { Instructor } from "@/lib/types";

export async function getInstructors(): Promise<Instructor[]> {
  const { data } = await api.get<Instructor[]>("/api/instructors");
  return data;
}

export interface AddInstructorInput {
  name: string;
  email: string;
  password: string;
}

export async function addInstructor(input: AddInstructorInput): Promise<Instructor> {
  const { data } = await api.post<Instructor>("/api/instructors", input);
  return data;
}
