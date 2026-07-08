export type Role = "Admin" | "Instructor";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced";

export const COURSE_LEVELS: CourseLevel[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
];

/** The user object returned in the login response body. */
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

/** An instructor as returned by GET /api/instructors (Mongo doc, no password). */
export interface Instructor {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface Course {
  _id: string;
  name: string;
  level: CourseLevel;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Lecture with a populated instructor (GET /api/courses/:id/lectures). */
export interface Lecture {
  _id: string;
  course: string;
  instructor: Pick<Instructor, "_id" | "name" | "email"> | null;
  batchName: string;
  lectureDate: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Lecture with a populated course (GET /api/lectures/mine). */
export interface MyLecture {
  _id: string;
  course: Pick<Course, "_id" | "name" | "level"> | null;
  instructor: string;
  batchName: string;
  lectureDate: string;
  createdAt?: string;
  updatedAt?: string;
}
