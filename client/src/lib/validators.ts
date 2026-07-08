import { z } from "zod";
import { COURSE_LEVELS } from "@/lib/types";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const addInstructorSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type AddInstructorValues = z.infer<typeof addInstructorSchema>;

export const addCourseSchema = z.object({
  name: z.string().min(2, "Course name is required"),
  level: z.enum(COURSE_LEVELS as [string, ...string[]]),
  description: z.string().min(10, "Give a short description (10+ characters)"),
});
export type AddCourseValues = z.infer<typeof addCourseSchema>;

export const scheduleLectureSchema = z.object({
  instructorId: z.string().min(1, "Select an instructor"),
  batchName: z.string().min(1, "Batch name is required"),
  date: z.string().min(1, "Pick a date"),
});
export type ScheduleLectureValues = z.infer<typeof scheduleLectureSchema>;
