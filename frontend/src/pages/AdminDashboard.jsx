import { Navigate, Route, Routes } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import ManageBooks from '../components/admin/ManageBooks';
import ViewOrders from '../components/admin/ViewOrders';

const AdminDashboard = () => {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="books" />} />
          <Route path="books" element={<ManageBooks />} />
          <Route path="orders" element={<ViewOrders />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboard;
