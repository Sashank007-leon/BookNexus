import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const active = (path) => location.pathname === path ? 'bg-blue-100 text-blue-600' : '';

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-md p-4">
      <h2 className="text-xl font-bold mb-6 text-blue-600">Admin Panel</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/admin/dashboard/books" className={`p-2 rounded ${active("/admin/dashboard/books")}`}>Manage Books</Link>
        <Link to="/admin/dashboard/orders" className={`p-2 rounded ${active("/admin/dashboard/orders")}`}>View Orders</Link>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
