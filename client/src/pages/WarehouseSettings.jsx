import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SearchButton from '../components/SearchButton';
import api from '../api/api';

const WarehouseSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    address: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchWarehouses = async () => {
    try {
      setFetching(true);
      const data = await api.get('/warehouses');
      setWarehouses(data.warehouses || []);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const filteredWarehouses = warehouses.filter(w =>
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (w.shortCode && w.shortCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortCode || !formData.address) {
      setMessage('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/warehouses', formData);
      setMessage('Warehouse saved successfully!');
      setFormData({ name: '', shortCode: '', address: '' });
      fetchWarehouses();
    } catch (err) {
      setMessage(err.message || 'Failed to save warehouse.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-12 pb-24 pt-8">
        {/* Form Section */}
        <div className="w-full max-w-2xl mx-auto">
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
                <Button type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="w-full">
          <div className="flex justify-between items-end mb-6 pb-4 border-b border-[#2e303a]">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Existing Warehouses
            </h2>
            <div>
              <SearchButton onSearch={setSearchQuery} />
            </div>
          </div>

          <div className="bg-[#16171d] rounded-xl border border-[#2e303a] overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-[#1f2028] border-b border-[#2e303a]">
                  <tr>
                    <th className="py-4 px-6 font-medium text-gray-400">Name</th>
                    <th className="py-4 px-6 font-medium text-gray-400">Short Code</th>
                    <th className="py-4 px-6 font-medium text-gray-400">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {fetching ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-6 text-center text-gray-500 animate-pulse">
                        Loading warehouses...
                      </td>
                    </tr>
                  ) : filteredWarehouses.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-6 text-center text-gray-500">
                        {searchQuery ? 'No warehouses match your search.' : 'No warehouses found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredWarehouses.map((wh, idx) => (
                      <tr key={wh.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== filteredWarehouses.length - 1 ? 'border-b border-dashed border-[#2e303a]' : ''}`}>
                        <td className="py-4 px-6 font-bold text-gray-200">{wh.name}</td>
                        <td className="py-4 px-6 font-medium text-purple-400">{wh.shortCode}</td>
                        <td className="py-4 px-6 text-gray-400 truncate max-w-xs">{wh.address || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
              <p className="text-sm text-gray-400">
                Showing <span className="text-white">1–{filteredWarehouses.length}</span> of {warehouses.length}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WarehouseSettings;

