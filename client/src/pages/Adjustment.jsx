import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Adjustment = () => {
  const [formData, setFormData] = useState({
    productId: '',
    locationId: '',
    countedQuantity: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ productId: '', locationId: '', countedQuantity: '', reason: '' });
      setTimeout(() => setSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            Inventory Adjustment
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Record manual stock counts and corrections
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#16171d] py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-[#2e303a]">

            {success && (
              <div className="mb-6 bg-green-900/40 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg text-sm text-center">
                Adjustment submitted successfully!
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-300">
                  Product ID
                </label>
                <div className="mt-1">
                  <input
                    id="productId"
                    name="productId"
                    type="text"
                    required
                    value={formData.productId}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="e.g. [DESK001] Desk"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-gray-300">
                  Location ID
                </label>
                <div className="mt-1">
                  <input
                    id="locationId"
                    name="locationId"
                    type="text"
                    required
                    value={formData.locationId}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="e.g. WH/Stock1"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="countedQuantity" className="block text-sm font-medium text-gray-300">
                  Counted Quantity
                </label>
                <div className="mt-1">
                  <input
                    id="countedQuantity"
                    name="countedQuantity"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.countedQuantity}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-300">
                  Reason
                </label>
                <div className="mt-1">
                  <textarea
                    id="reason"
                    name="reason"
                    rows="3"
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm resize-none"
                    placeholder="Explain the reason for adjustment"
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Adjustment;
