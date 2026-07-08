import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';

import AdminLayout from './pages/admin/AdminLayout.jsx';
import Dashboard from './pages/admin/Dashboard.jsx';
import Instructors from './pages/admin/Instructors.jsx';
import AddCourse from './pages/admin/AddCourse.jsx';
import CourseDetail from './pages/admin/CourseDetail.jsx';

import MyLectures from './pages/instructor/MyL00000000000000000000000000000000000ectures.jsx';

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="instructors" element={<Instructors />} />
            <Route path="courses/new" element={<AddCourse />} />
            <Route path="courses/:id" element={<CourseDetail />} />
          </Route>

          <Route path="/instructor" element={<MyLectures />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
}
