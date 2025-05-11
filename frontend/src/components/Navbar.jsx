import { Button } from "@mui/material";
import {
  FaBook,
  FaShoppingCart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUser,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const handleLogout = () => {
    clearCart();
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-8 flex flex-col sm:flex-row sm:justify-between sm:items-center sticky top-0 z-50 gap-4 sm:gap-0">
      {/* Logo/Home Link: Disable for Admin */}
      {!user?.isAdmin && (
        <div className="flex justify-between items-center">
          <Link to="/" className="text-3xl font-bold text-blue-600">
            BookNexus
          </Link>
        </div>
      )}

      {/* Right side links */}
      <div className="flex items-center gap-6">
        {/* All Books Link: Only show if user is NOT admin */}
        {!user?.isAdmin && (
          <Link
            to="/books"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <FaBook className="mr-2 text-lg" />
            <span className="hidden sm:inline">All Books</span>
          </Link>
        )}

        {user && (
          <span className="text-gray-700 hidden sm:inline">
            Hello,{" "}
            <span className="font-semibold text-blue-600">
              {user.name || user.username}
            </span>
          </span>
        )}

        {/* Admin Route - Dashboard */}
        {user?.isAdmin && (
          <Link
            to="/admin/dashboard"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <FaTachometerAlt className="mr-2 text-lg" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        )}

        {/* User Routes (For non-admin users) */}
        {user && !user.isAdmin && (
          <>
            <Link
              to="/my-orders"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              My Orders
            </Link>

            {/* Cart button */}
            <Link
              to="/cart"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              <FaShoppingCart className="mr-2 text-lg" />
              <span className="hidden sm:inline">Cart</span>
            </Link>
          </>
        )}

        {/* Login/Logout Button */}
        {user ? (
          <Button
            onClick={handleLogout}
            variant="outlined"
            color="error"
            startIcon={<FaSignOutAlt />}
            className="!capitalize"
          >
            Logout
          </Button>
        ) : (
          <Link
            to="/login"
            className="flex items-center text-gray-700 hover:text-blue-600 transition-colors duration-200"
          >
            <FaUser className="mr-2 text-lg" />
            <span className="hidden sm:inline">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
