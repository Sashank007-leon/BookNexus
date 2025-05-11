import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button } from '@mui/material';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', form);
      const userData = res.data;

      login(userData);
      toast.success('Login Successful!');

      // Redirect logic
      if (userData.isAdmin) {
        navigate('/admin/dashboard');
      } else {
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-10 py-12 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Login
        </h2>

        <div className="mb-6">
          <TextField
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
            fullWidth
            required
          />
        </div>

        <div className="mb-6">
          <TextField
            name="password"
            value={form.password}
            onChange={handleChange}
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            required
          />
        </div>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ paddingY: 1.5, textTransform: 'none', fontWeight: 'bold' }}
        >
          Login
        </Button>

        <p className="mt-6 text-center text-gray-600 text-sm">
          Not registered?{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
