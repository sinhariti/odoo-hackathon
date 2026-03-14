import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import api from '../api/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const data = await api.get('/dashboard/operations-summary');
        setSummary(data.summary || {});
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const getTypeStats = (type) => {
    if (!summary || !summary[type]) return { total: 0, late: 0, waiting: 0 };
    const s = summary[type];
    const total = Object.values(s).reduce((sum, v) => sum + v, 0);
    const late = s.late || 0;
    const waiting = s.waiting || 0;
    return { total, late, waiting };
  };

  const receiptStats = getTypeStats('receipt');
  const deliveryStats = getTypeStats('delivery');

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Receipt Card */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-64">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
              Receipt
            </h2>
            <div className="flex justify-between items-end flex-1">
              <div className="w-48">
                <Button onClick={() => console.log("Receipts clicked")}>
                  {loading ? '...' : `${receiptStats.total} to receive`}
                </Button>
              </div>
              <div className="flex flex-col space-y-2 text-right">
                {loading ? (
                  <span className="text-gray-500 text-sm animate-pulse">Loading...</span>
                ) : (
                  <>
                    {receiptStats.late > 0 && (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-red-400 font-bold text-lg">{receiptStats.late}</span>
                        <span className="text-gray-400 text-sm">Late</span>
                      </div>
                    )}
                    {receiptStats.waiting > 0 && (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-yellow-400 font-bold text-lg">{receiptStats.waiting}</span>
                        <span className="text-gray-400 text-sm">Waiting</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-purple-400 font-bold text-lg">{receiptStats.total}</span>
                      <span className="text-gray-400 text-sm">operations</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-64">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
              Delivery
            </h2>
            <div className="flex justify-between items-end flex-1">
              <div className="w-48">
                <Button onClick={() => console.log("Deliveries clicked")}>
                  {loading ? '...' : `${deliveryStats.total} to deliver`}
                </Button>
              </div>
              <div className="flex flex-col space-y-2 text-right">
                {loading ? (
                  <span className="text-gray-500 text-sm animate-pulse">Loading...</span>
                ) : (
                  <>
                    {deliveryStats.late > 0 && (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-red-400 font-bold text-lg">{deliveryStats.late}</span>
                        <span className="text-gray-400 text-sm">Late</span>
                      </div>
                    )}
                    {deliveryStats.waiting > 0 && (
                      <div className="flex items-center justify-end space-x-2">
                        <span className="text-yellow-400 font-bold text-lg">{deliveryStats.waiting}</span>
                        <span className="text-gray-400 text-sm">Waiting</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-purple-400 font-bold text-lg">{deliveryStats.total}</span>
                      <span className="text-gray-400 text-sm">operations</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

