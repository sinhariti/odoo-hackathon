import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import odooLogo from '../assets/odoo_logo.webp';

const Login = () => {
  const [formData, setFormData] = useState({ loginId: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic frontend validation for demonstration
    // Since we don't have the backend connected here yet, we just simulate check
    if (!formData.loginId || !formData.password) {
      setError('Please enter both Login ID and Password');
      return;
    }

    // Mocking check creds (to be replaced with API call)
    if (formData.loginId === 'testuser' && formData.password === 'Password123!') {
      alert('Login successful');
    } else {
      setError('Invalid Login Id or Password');
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-300 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto"
          src={odooLogo}
          alt="App Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          Welcome back
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Sign in to your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#16171d] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2e303a]">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm transition-all animate-pulse">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="loginId" className="block text-sm font-medium text-gray-300">
                Login ID
              </label>
              <div className="mt-1">
                <input
                  id="loginId"
                  name="loginId"
                  type="text"
                  required
                  value={formData.loginId}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="Enter your login ID"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-purple-400 hover:text-purple-300 transition-colors">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <Button type="submit">
                Sign in
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2e303a]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#16171d] text-gray-400">
                  New to the platform?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/signup" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
