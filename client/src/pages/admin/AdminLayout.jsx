import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Sidebar from '../../components/Sidebar.jsx';

export default function AdminLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'Admin') return <Navigate to="/instructor" replace />;

  return (
    <div className="mx-auto flex max-w-6xl">
      <Sidebar />
      <main className="min-w-0 flex-1 px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
