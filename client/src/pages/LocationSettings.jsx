import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SearchButton from '../components/SearchButton';
import api from '../api/api';

const LocationSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    shortCode: '',
    warehouseId: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [warehousesLoading, setWarehousesLoading] = useState(true);

  // Location Table State
  const [locations, setLocations] = useState([]);
  const [fetchingLocations, setFetchingLocations] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLocations = async () => {
    try {
      setFetchingLocations(true);
      const data = await api.get('/locations');
      setLocations(data.locations || []);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setFetchingLocations(false);
    }
  };

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const data = await api.get('/warehouses');
        setWarehouses(data.warehouses || []);
      } catch (err) {
        console.error('Failed to fetch warehouses:', err);
      } finally {
        setWarehousesLoading(false);
      }
    };
    fetchWarehouses();
    fetchLocations();
  }, []);

  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (loc.shortCode && loc.shortCode.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (loc.warehouse?.name && loc.warehouse.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.shortCode || !formData.warehouseId) {
      setMessage('All fields are required.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/locations', formData);
      setMessage('Location saved successfully!');
      setFormData({ name: '', shortCode: '', warehouseId: '' });
      fetchLocations();
    } catch (err) {
      setMessage(err.message || 'Failed to save location.');
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
              Location
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Create or update a specific stock location
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
                    placeholder="e.g. Shelf A, Aisle 3"
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
                    placeholder="e.g. LOC-A3"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="warehouseId" className="block text-sm font-medium text-gray-300">
                  Warehouse
                </label>
                <div className="mt-1 relative">
                  <select
                    id="warehouseId"
                    name="warehouseId"
                    required
                    value={formData.warehouseId}
                    onChange={handleChange}
                    className="appearance-none block w-full px-4 py-3 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors sm:text-sm pr-10"
                  >
                    <option value="" disabled className="text-gray-500">
                      {warehousesLoading ? 'Loading warehouses...' : 'Select parent warehouse'}
                    </option>
                    {warehouses.map((wh) => (
                      <option key={wh.id} value={wh.id}>{wh.name} ({wh.shortCode})</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
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
              Existing Locations
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
                    <th className="py-4 px-6 font-medium text-gray-400">Warehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {fetchingLocations ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-6 text-center text-gray-500 animate-pulse">
                        Loading locations...
                      </td>
                    </tr>
                  ) : filteredLocations.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 px-6 text-center text-gray-500">
                        {searchQuery ? 'No locations match your search.' : 'No locations found.'}
                      </td>
                    </tr>
                  ) : (
                    filteredLocations.map((loc, idx) => (
                      <tr key={loc.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== filteredLocations.length - 1 ? 'border-b border-dashed border-[#2e303a]' : ''}`}>
                        <td className="py-4 px-6 font-bold text-gray-200">{loc.name}</td>
                        <td className="py-4 px-6 font-medium text-purple-400">{loc.shortCode || '—'}</td>
                        <td className="py-4 px-6 text-gray-400 max-w-xs">{loc.warehouse?.name || '—'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
              <p className="text-sm text-gray-400">
                Showing <span className="text-white">1–{filteredLocations.length}</span> of {locations.length}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LocationSettings;

