import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const WarehouseSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    address: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortCode || !formData.address) {
      setMessage('All fields are required.');
      return;
    }

    // Mock save
    console.log("Saving warehouse", formData);
    setMessage('Warehouse saved successfully!');
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 flex justify-center items-start pt-16">
        <div className="w-full max-w-xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Warehouse
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Create or update warehouse details
            </p>
          </div>

          <div className="bg-[#16171d] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2e303a]">
            <form className="space-y-6" onSubmit={handleSubmit}>

              {message && (
                <div className={`px-4 py-3 rounded-lg text-sm transition-all ${message.includes('success') ? 'bg-green-900/50 border border-green-500 text-green-200' : 'bg-red-900/50 border border-red-500 text-red-200 animate-pulse'}`}>
                  {message}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="e.g. Main Distribution Center"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="shortCode" className="block text-sm font-medium text-gray-300">
                  Short Code
                </label>
                <div className="mt-1">
                  <input
                    id="shortCode"
                    name="shortCode"
                    type="text"
                    required
                    value={formData.shortCode}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="e.g. WH-MAIN"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-300">
                  Address
                </label>
                <div className="mt-1">
                  <textarea
                    id="address"
                    name="address"
                    required
                    rows={3}
                    value={formData.address}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm resize-none"
                    placeholder="Full street address"
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WarehouseSettings;
