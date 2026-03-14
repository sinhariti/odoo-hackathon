import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import SearchButton from '../components/SearchButton';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';

const StatusPill = ({ status }) => {
  const styles = {
    draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    waiting: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    ready: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    done: 'bg-green-500/10 text-green-400 border border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
  };

  const statusKey = (status || '').toLowerCase();

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${styles[statusKey] || 'bg-gray-800 text-gray-300'}`}>
      {status || 'Unknown'}
    </span>
  );
};

// Kanban Column Component
const KanbanColumn = ({ title, items, navigate }) => {
  return (
    <div className="flex-1 bg-[#16171d] rounded-xl border border-[#2e303a] p-4 min-w-[300px] flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-[#2e303a]">
        <h3 className="font-bold text-gray-300 tracking-wide">{title}</h3>
        <span className="bg-[#1f2028] text-gray-400 text-xs font-bold px-2 py-1 rounded-full border border-[#3e404a]">
          {items.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {items.map(item => (
          <div key={item.id} onClick={() => navigate(`/operations/delivery/${item.id}`)} className="bg-[#1f2028] p-4 rounded-lg border border-[#3e404a] hover:border-purple-500/50 transition-colors shadow-sm cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-gray-200 text-sm group-hover:text-purple-400 transition-colors">{item.reference || `#${item.id}`}</span>
              <StatusPill status={item.status} />
            </div>

            <p className="text-gray-300 text-sm font-medium mb-3 truncate">{item.customerName || '—'}</p>

            <div className="flex justify-between text-xs text-gray-500">
              <div className="flex flex-col space-y-1">
                <span>From: <span className="text-gray-400 font-medium">{item.srcLocation?.name || '—'}</span></span>
                <span>To: <span className="text-gray-400 font-medium">{item.destLocation?.name || '—'}</span></span>
              </div>
              <div className="text-right flex flex-col justify-end">
                <span>{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}</span>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No deliveries here
          </div>
        )}
      </div>
    </div>
  );
};

const Delivery = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'kanban'
  const [searchQuery, setSearchQuery] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const data = await api.get('/deliveries');
        setDeliveries(data.deliveries || []);
      } catch (err) {
        console.error('Failed to load deliveries', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeliveries();
  }, []);

  // Filter logic based on search
  const filteredDeliveries = deliveries.filter(d =>
    (d.reference || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (d.customerName || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full flex flex-col">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 pb-4 border-b border-[#2e303a] gap-4">
          <div className="flex items-center gap-6">
            <div className="w-24">
              <Link to="/operations/delivery/new">
                <Button className="py-2!">
                  NEW
                </Button>
              </Link>
            </div>
            <h2 className="text-3xl font-extrabold text-[#ffff] tracking-tight">
              Delivery
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <SearchButton onSearch={setSearchQuery} />

            {/* View Toggles Container */}
            <div className="flex items-center bg-[#1f2028] border border-[#2e303a] rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-all ${viewMode === 'list'
                  ? 'bg-[#2e303a] text-[#ffb0b0] shadow-sm border border-[#3e404a]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#2e303a]/50'
                  }`}
                title="List View"
              >
                <LayoutList size={20} />
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-2 rounded-md transition-all ${viewMode === 'kanban'
                  ? 'bg-[#2e303a] text-[#ffb0b0] shadow-sm border border-[#3e404a]'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-[#2e303a]/50'
                  }`}
                title="Kanban View"
              >
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* List View */}
          {viewMode === 'list' && (
            <div className="bg-[#16171d] rounded-xl border border-[#2e303a] overflow-hidden flex-shrink-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="bg-[#1f2028] border-b border-[#2e303a]">
                    <tr>
                      <th className="py-4 px-6 font-medium text-gray-400">Reference</th>
                      <th className="py-4 px-6 font-medium text-gray-400">From</th>
                      <th className="py-4 px-6 font-medium text-gray-400">To</th>
                      <th className="py-4 px-6 font-medium text-gray-400">Contact</th>
                      <th className="py-4 px-6 font-medium text-gray-400">Schedule date</th>
                      <th className="py-4 px-6 font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500 animate-pulse">
                          Loading deliveries...
                        </td>
                      </tr>
                    ) : filteredDeliveries.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-8 text-center text-gray-500">
                          {searchQuery ? 'No deliveries matching your search.' : 'No deliveries found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredDeliveries.map((item, idx) => (
                        <tr key={item.id} onClick={() => navigate(`/operations/delivery/${item.id}`)} className={`cursor-pointer hover:bg-[#1f2028] transition-colors ${idx !== filteredDeliveries.length - 1 ? 'border-b border-[#2e303a]' : ''}`}>
                          <td className="py-4 px-6 font-bold text-[#ffb0b0]/90">{item.reference || `#${item.id}`}</td>
                          <td className="py-4 px-6 text-gray-400">{item.srcLocation?.name || '—'}</td>
                          <td className="py-4 px-6 text-gray-300 font-medium">{item.destLocation?.name || '—'}</td>
                          <td className="py-4 px-6 font-medium text-gray-200">{item.customerName || '—'}</td>
                          <td className="py-4 px-6 text-gray-400">{item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}</td>
                          <td className="py-4 px-6 text-gray-400"><StatusPill status={item.status} /></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
              <KanbanColumn
                title="Draft"
                items={filteredDeliveries.filter(d => (d.status || '').toLowerCase() === 'draft')}
                navigate={navigate}
              />
              <KanbanColumn
                title="Waiting"
                items={filteredDeliveries.filter(d => (d.status || '').toLowerCase() === 'waiting')}
                navigate={navigate}
              />
              <KanbanColumn
                title="Ready"
                items={filteredDeliveries.filter(d => (d.status || '').toLowerCase() === 'ready')}
                navigate={navigate}
              />
              <KanbanColumn
                title="Done"
                items={filteredDeliveries.filter(d => (d.status || '').toLowerCase() === 'done')}
                navigate={navigate}
              />
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default Delivery;
