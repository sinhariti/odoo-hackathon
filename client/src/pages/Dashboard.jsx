import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import api from '../api/api';

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [kpi, setKpi] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, kpiRes, alertsRes] = await Promise.all([
          api.get('/dashboard/operations-summary'),
          api.get('/dashboard/kpis'),
          api.get('/dashboard/stock-alerts')
        ]);
        
        setSummary(summaryRes.data?.summary || summaryRes.summary || {});
        setKpi(kpiRes.data?.kpis || kpiRes.kpis || {});
        setAlerts(alertsRes.data?.alerts || alertsRes.alerts || []);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getTypeStats = (type) => {
    if (!summary || !summary[type]) return { total: 0, late: 0, waiting: 0 };
    const s = summary[type];
    const total = Object.values(s).reduce((sum, v) => sum + v, 0);
    // Inferring 'late' or 'waiting' if your backend adds those states. 
    // Fallback to draft/ready counts if waiting isn't explicitly returned
    const late = s.late || 0; 
    const waiting = s.waiting || s.draft || s.ready || 0;
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

        {/* Low Stock Alert Banner */}
        {!loading && alerts.length > 0 && (
          <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-lg flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-400">Low Stock Alert: {alerts.length} product(s)</h3>
              <div className="mt-2 text-sm text-red-200/80">
                <ul className="list-disc pl-5 space-y-1">
                  {alerts.map((alert, idx) => (
                    <li key={idx}>
                      <strong>{alert.product.name}</strong> at {alert.location?.name || 'Unknown'} — 
                      Current: {alert.currentQty}, Min: {alert.minQty} (Shortage: {alert.shortage})
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Receipt Card */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-64">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
              Receipts
            </h2>
            <div className="flex justify-between items-end flex-1">
              <div className="w-48">
                <Button onClick={() => console.log("Receipts clicked")}>
                  {loading ? '...' : `${receiptStats.total} total`}
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
                        <span className="text-gray-400 text-sm">To Process</span>
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-2">
                      <span className="text-blue-400 font-bold text-lg">{receiptStats.total}</span>
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
              Deliveries
            </h2>
            <div className="flex justify-between items-end flex-1">
              <div className="w-48">
                <Button onClick={() => console.log("Deliveries clicked")}>
                  {loading ? '...' : `${deliveryStats.total} total`}
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
                        <span className="text-gray-400 text-sm">To Process</span>
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

        {/* Top KPI row */}
        {!loading && kpi && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 mb-8">
            <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">Total Products</span>
              <span className="text-3xl font-bold text-white mt-2">{kpi.totalProducts || 0}</span>
            </div>
            <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">Low Stock Items</span>
              <span className={`text-3xl font-bold mt-2 ${kpi.lowStockCount > 0 ? 'text-red-400' : 'text-green-400'}`}>
                {kpi.lowStockCount || 0}
              </span>
            </div>
            <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">Pending Receipts</span>
              <span className="text-3xl font-bold text-blue-400 mt-2">{kpi.pendingReceipts || 0}</span>
            </div>
            <div className="bg-[#16171d] border border-[#2e303a] rounded-xl p-6 flex flex-col items-center justify-center">
              <span className="text-gray-400 text-sm font-medium">Pending Deliveries</span>
              <span className="text-3xl font-bold text-purple-400 mt-2">{kpi.pendingDeliveries || 0}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

