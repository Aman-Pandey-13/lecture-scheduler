import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Hero from "@/pages/Hero";
import Login from "@/pages/Login";
import AdminOverview from "@/pages/admin/AdminOverview";
import Instructors from "@/pages/admin/Instructors";
import Courses from "@/pages/admin/Courses";
import CourseDetail from "@/pages/admin/CourseDetail";
import MyLectures from "@/pages/instructor/MyLectures";
import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Hero />} />
      </Route>
      <Route path="/login" element={<Login />} />

      {/* Admin */}
      <Route element={<ProtectedRoute role="Admin" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/admin" element={<AdminOverview />} />
          <Route path="/admin/instructors" element={<Instructors />} />
          <Route path="/admin/courses" element={<Courses />} />
          <Route path="/admin/courses/:id" element={<CourseDetail />} />
        </Route>
      </Route>

      {/* Instructor */}
      <Route element={<ProtectedRoute role="Instructor" />}>
        <Route element={<DashboardLayout />}>
          <Route path="/instructor" element={<MyLectures />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
