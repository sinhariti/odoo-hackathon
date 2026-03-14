import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import odooLogo from '../assets/odoo_logo.webp';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = Enter Email, 2 = Enter OTP
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSendOtp = (e) => {
    e.preventDefault();

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Mock API call to send OTP
    setError('');
    setStep(2);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();

    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    // Mock API call to verify OTP
    setSuccess(true);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#08060d] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 text-gray-300 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <img
          className="mx-auto h-16 w-auto drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]"
          src={odooLogo}
          alt="App Logo"
        />
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
          {step === 1 ? 'Reset Password' : 'Verify OTP'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          {step === 1
            ? "Enter your email to receive a One-Time Password."
            : <span>OTP sent to email: <span className="text-white font-medium">{email}</span></span>
          }
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#16171d] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2e303a]">

          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm transition-all animate-pulse">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email ID
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="Enter your email ID"
                  />
                </div>
              </div>

              <div>
                <Button type="submit">
                  Send OTP
                </Button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              {error && (
                <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm transition-all animate-pulse">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-green-900/50 border border-green-500 text-green-200 px-4 py-3 rounded-lg text-sm transition-all">
                  OTP Confirmed successfully! You can now reset your password.
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-300">
                  Enter OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm text-center tracking-widest font-mono text-lg"
                    placeholder="------"
                    maxLength={6}
                    disabled={success}
                  />
                </div>
              </div>

              {!success && (
                <div>
                  <Button type="submit">
                    Confirm
                  </Button>
                </div>
              )}

              {!success && (
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors bg-transparent border-none cursor-pointer"
                  >
                    Change email address
                  </button>
                </div>
              )}
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2e303a]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#16171d] text-gray-400">
                  Remembered your password?
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

export default ForgotPassword;
