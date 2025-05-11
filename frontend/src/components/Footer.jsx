import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 mt-12 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 mb-2">BookNexus</h2>
          <p className="text-gray-600 text-sm">
            Your one-stop shop for all your reading adventures. Discover, explore, and enjoy books from every genre.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/cart" className="hover:text-blue-600">Cart</Link></li>
            <li><Link to="/login" className="hover:text-blue-600">Login</Link></li>
            <li><Link to="/register" className="hover:text-blue-600">Register</Link></li>
          </ul>
        </div>

        {/* Contact / Social */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Get in Touch</h3>
          <p className="text-gray-600 text-sm mb-2">Email: support@booknexus.com</p>
          <p className="text-gray-600 text-sm mb-2">Phone: +1 (555) 123-4567</p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">Facebook</a>
            <a href="#" className="text-blue-600 hover:text-blue-800">Twitter</a>
            <a href="#" className="text-blue-600 hover:text-blue-800">Instagram</a>
          </div>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm py-4 border-t border-gray-200">
        &copy; {new Date().getFullYear()} BookNexus. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
