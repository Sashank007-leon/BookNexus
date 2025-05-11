import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import BookDetails from "./pages/BookDetails";
import { ToastContainer } from "react-toastify";
import AdminDashboard from "./pages/AdminDashboard";
import Homepage from "./pages/Homepage";
import Footer from "./components/Footer";
import AllBooks from "./pages/AllBooks";
import CategoryBooksPage from "./pages/CategoryBooksPage";
import CheckoutPage from "./pages/CheckoutPage";
import MyOrdersPage from "./pages/MyOrdersPage";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/books" element={<AllBooks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/books/:bookId" element={<BookDetails />} />
          <Route
            path="/category/:categoryName"
            element={<CategoryBooksPage />}
          />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />

          {/* Admin Dashboard - Only accessible by admin */}
          <Route
            path="/admin/dashboard/*"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default App;
