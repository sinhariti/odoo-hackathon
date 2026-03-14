import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchButton from '../components/SearchButton';
import api from '../api/api';

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const data = await api.get('/stock-quants/summary');
        const rows = (data.summary || []).map((item) => ({
          id: item.product?.id || item.productId,
          product: item.product?.name || 'Unknown',
          sku: item.product?.sku || '',
          uom: item.product?.uom || '',
          onHand: parseInt(item.totalQty, 10) || 0,
          freeToUse: parseInt(item.totalQty, 10) || 0,
        }));
        setStockData(rows);
      } catch (err) {
        setError(err.message || 'Failed to load stock data');
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const filteredData = stockData.filter((item) =>
    item.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6 pb-4 border-b border-[#2e303a]">
          <h2 className="text-3xl font-extrabold tracking-tight">
            Stock
          </h2>
          <div>
            <SearchButton onSearch={(query) => setSearchQuery(query)} />
          </div>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Data Table */}
        <div className="bg-[#16171d] rounded-xl border border-[#2e303a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#1f2028] border-b border-[#2e303a]">
                <tr>
                  <th className="py-4 px-6 font-medium text-gray-400 w-1/4">Product</th>
                  <th className="py-4 px-6 font-medium text-gray-400 w-1/4">SKU</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center w-1/4">On Hand</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center w-1/4">Free to Use</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-8 px-6 text-center text-gray-500 animate-pulse">
                      Loading stock data...
                    </td>
                  </tr>
                ) : filteredData.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 px-6 text-center text-gray-500">
                      {searchQuery ? 'No products match your search.' : 'No stock data available.'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, idx) => (
                    <tr key={item.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== filteredData.length - 1 ? 'border-b border-dashed border-[#2e303a]' : ''}`}>
                      <td className="py-4 px-6 font-medium text-gray-200">{item.product}</td>
                      <td className="py-4 px-6 text-gray-400">{item.sku || '—'}</td>
                      <td className="py-4 px-6 text-center text-gray-300 font-medium">{item.onHand}</td>
                      <td className="py-4 px-6 text-center text-gray-300 font-medium">{item.freeToUse}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">1–{filteredData.length}</span> of {stockData.length}
            </p>
            <div className="flex space-x-2">
              <button disabled className="px-4 py-2 border border-[#2e303a] rounded-lg text-sm font-medium text-gray-500 cursor-not-allowed flex items-center gap-1">
                &larr; Prev
              </button>
              <button className="px-4 py-2 border border-[#3e404a] bg-[#2e303a] rounded-lg text-sm font-medium text-white hover:bg-[#3e404a] transition-colors flex items-center gap-1">
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Stock;

