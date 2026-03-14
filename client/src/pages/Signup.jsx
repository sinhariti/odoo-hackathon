import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import odooLogo from '../assets/odoo_logo.webp';

const Signup = () => {
  const [formData, setFormData] = useState({
    loginId: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on change
  };

  const validateInput = () => {
    // 1. Login ID length 6-12 chars
    if (formData.loginId.length < 6 || formData.loginId.length > 12) {
      return "Login ID must be between 6 and 12 characters.";
    }

    // 2. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid Email ID.";
    }

    // 3. Password min 8 chars, 1 small, 1 large, 1 special
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      return "Password must be >8 characters, with at least 1 uppercase, 1 lowercase, and 1 special character.";
    }

    // 4. Password Match
    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return null; // Valid
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationError = validateInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    alert('Frontend Validation Passed! Ready for API call.');
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
          Create an account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Join us today to get started
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#16171d] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2e303a]">
          <form className="space-y-5" onSubmit={handleSubmit}>
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
                  placeholder="Must be 6-12 characters"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                  placeholder="you@example.com"
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
                  placeholder="Strong password required"
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

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Re-Enter Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm pr-10"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors bg-transparent border-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit">
                Sign up
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
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
