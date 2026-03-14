import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import api from '../api/api';

const Adjustment = () => {
  const [formData, setFormData] = useState({
    productId: '',
    locationId: '',
    countedQty: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [fetchingData, setFetchingData] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [productsRes, locationsRes] = await Promise.all([
          api.get('/products'),
          api.get('/locations')
        ]);
        setProducts(productsRes?.products || []);
        setLocations(locationsRes?.locations || []);
      } catch (err) {
        console.error("Failed to fetch dropdown data:", err);
      } finally {
        setFetchingData(false);
      }
    };
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.productId || !formData.locationId || formData.countedQty === '') {
      setError('Product ID, Location ID, and Counted Quantity are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // 1. Create the adjustment
      const response = await api.post('/adjustments', {
        productId: parseInt(formData.productId, 10),
        locationId: parseInt(formData.locationId, 10),
        countedQty: parseFloat(formData.countedQty) || 0,
        reason: formData.reason
      });

      // Assuming backend returns the newly created adjustment object with an 'id'
      const adjustmentId = response.id || response.data?.id || response.adjustment?.id;

      if (adjustmentId) {
        // 2. Validate the adjustment
        await api.post(`/adjustments/${adjustmentId}/validate`);
      }

      setSuccess(true);
      setFormData({ productId: '', locationId: '', countedQty: '', reason: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit adjustment.');
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="mb-6 bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm transition-all animate-pulse text-center">
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>

              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-gray-300">
                  Product
                </label>
                <div className="mt-1">
                  <select
                    id="productId"
                    name="productId"
                    required
                    value={formData.productId}
                    onChange={handleChange}
                    disabled={fetchingData}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                  >
                    <option value="" disabled className="bg-[#1f2028]">Select a product...</option>
                    {products.map(p => (
                      <option key={p.id} value={p.id} className="bg-[#1f2028]">
                        [{p.sku}] {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="locationId" className="block text-sm font-medium text-gray-300">
                  Location
                </label>
                <div className="mt-1">
                  <select
                    id="locationId"
                    name="locationId"
                    required
                    value={formData.locationId}
                    onChange={handleChange}
                    disabled={fetchingData}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm"
                  >
                    <option value="" disabled className="bg-[#1f2028]">Select a location...</option>
                    {locations.map(l => (
                      <option key={l.id} value={l.id} className="bg-[#1f2028]">
                        {l.warehouse?.name ? `[${l.warehouse.name}] ` : ''}{l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="countedQuantity" className="block text-sm font-medium text-gray-300">
                  Counted Quantity
                </label>
                <div className="mt-1">
                  <input
                    id="countedQty"
                    name="countedQty"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.countedQty}
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
