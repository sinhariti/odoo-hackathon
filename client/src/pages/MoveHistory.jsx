import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import SearchButton from '../components/SearchButton';
import { ChevronDown } from 'lucide-react';
import api from '../api/api';

const StatusPill = ({ status }) => {
  const styles = {
    draft: 'bg-gray-500/10 text-gray-400 border border-gray-500/20',
    ready: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    done: 'bg-green-500/10 text-green-400 border border-green-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    waiting: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full capitalize ${styles[status] || 'bg-gray-800 text-gray-300'}`}>
      {status || '—'}
    </span>
  );
};

const MoveHistory = () => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchMoves = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter) params.append('type', typeFilter);
      const queryStr = params.toString();
      const data = await api.get(`/stock-moves${queryStr ? `?${queryStr}` : ''}`);
      setMoves(data.moves || []);
    } catch (err) {
      setError(err.message || 'Failed to load move history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoves();
  }, [typeFilter]);

  const getContact = (picking) => {
    if (!picking) return '—';
    return picking.supplierName || picking.customerName || '—';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Client-side filters for status and search
  const filteredMoves = moves.filter((move) => {
    const status = move.picking?.status || '';
    const ref = move.picking?.reference || '';
    const contact = getContact(move.picking);
    const matchesStatus = !statusFilter || status === statusFilter;
    const matchesSearch = !searchQuery ||
      ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Row text color: green for In (receipt), red for Out (delivery)
  const getRowColor = (type) => {
    if (type === 'receipt') return 'text-green-400';
    if (type === 'delivery') return 'text-red-400';
    return 'text-gray-300';
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header & Controls */}
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Move History
          </h2>

          <div className="flex flex-col space-y-3 w-80">
            <div className="flex justify-end w-full">
              <SearchButton onSearch={setSearchQuery} />
            </div>

            {/* Type Filter */}
            <div className="relative">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="appearance-none block w-full px-4 py-2 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors sm:text-sm pr-10"
              >
                <option value="">All types</option>
                <option value="receipt">Receipts (In)</option>
                <option value="delivery">Deliveries (Out)</option>
                <option value="internal">Internal Transfers</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none block w-full px-4 py-2 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors sm:text-sm pr-10"
              >
                <option value="">All statuses</option>
                <option value="ready">Ready</option>
                <option value="done">Done</option>
                <option value="waiting">Waiting</option>
                <option value="cancelled">Cancelled</option>
                <option value="draft">Draft</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
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
                  <th className="py-4 px-6 font-medium text-gray-400">Reference</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Date</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Contact</th>
                  <th className="py-4 px-6 font-medium text-gray-400">From</th>
                  <th className="py-4 px-6 font-medium text-gray-400">To</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center">Quantity</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-gray-500 animate-pulse">
                      Loading move history...
                    </td>
                  </tr>
                ) : filteredMoves.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 px-6 text-center text-gray-500">
                      No moves found.
                    </td>
                  </tr>
                ) : (
                  filteredMoves.map((move, idx) => {
                    const rowColor = getRowColor(move.picking?.type);
                    return (
                      <tr key={move.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== filteredMoves.length - 1 ? 'border-b border-[#2e303a]' : ''}`}>
                        <td className={`py-4 px-6 font-semibold ${rowColor}`}>
                          {move.picking?.reference || `#${move.picking?.id || move.id}`}
                        </td>
                        <td className="py-4 px-6 text-gray-400">
                          {formatDate(move.picking?.scheduledDate || move.createdAt)}
                        </td>
                        <td className="py-4 px-6 font-medium text-gray-200">
                          {getContact(move.picking)}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {move.srcLocation?.name || '—'}
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {move.destLocation?.name || '—'}
                        </td>
                        <td className="py-4 px-6 text-center text-gray-300 font-medium">
                          {move.doneQty || move.demandQty || '—'}
                        </td>
                        <td className="py-4 px-6">
                          <StatusPill status={move.picking?.status} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">1–{filteredMoves.length}</span> of {moves.length}
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

export default MoveHistory;

