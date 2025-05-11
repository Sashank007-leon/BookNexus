import { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { TextField, Button } from '@mui/material';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      toast.success('Registration Successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration Failed');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gradient-to-br from-blue-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white px-10 py-12 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-4xl font-bold mb-8 text-center text-blue-700">
          Create Account
        </h2>

        <div className="mb-6">
          <TextField
            name="name"
            value={form.name}
            onChange={handleChange}
            label="Full Name"
            variant="outlined"
            fullWidth
            required
          />
        </div>

        <div className="mb-6">
          <TextField
            name="email"
            value={form.email}
            onChange={handleChange}
            label="Email"
            type="email"
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
          Register
        </Button>
      </form>
    </div>
  );
};

export default Register;
