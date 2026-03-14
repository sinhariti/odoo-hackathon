import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import SearchButton from '../components/SearchButton';
import { ChevronDown, ArrowRight, ArrowRightLeft } from 'lucide-react';

const mockMoves = [
  { id: '#9', direction: 'In', status: 'Ready', party: 'Patel Imports', from: 'Vendor Location', to: 'Overflow WH', scheduled: '23 Feb 25', doneOn: '—' },
  { id: '#7', direction: 'Out', status: 'Ready', party: 'Alpha Retail', from: 'East WH', to: 'Drop Point', scheduled: '20 Feb 25', doneOn: '—' },
  { id: '#6', direction: 'In', status: 'Done', party: 'Sharma & Co.', from: 'Airport WH', to: 'Main Store', scheduled: '18 Feb 25', doneOn: '19 Feb 25' },
  { id: '#5', direction: 'Out', status: 'Cancelled', party: 'Nexus Corp', from: 'Main Store', to: 'Client Hub', scheduled: '16 Feb 25', doneOn: '—' },
  { id: '#3', direction: 'In', status: 'Waiting', party: 'Mehta Supplies', from: 'Port Hub', to: 'East WH', scheduled: '15 Feb 25', doneOn: '—' },
  { id: '#2', direction: 'Out', status: 'Done', party: 'Global Tech', from: 'Main Store', to: 'Customer Site', scheduled: '12 Feb 25', doneOn: '12 Feb 25' },
];

const Pill = ({ type, text }) => {
  const styles = {
    // Directions
    In: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Out: 'bg-green-500/10 text-green-400 border border-green-500/20',

    // Statuses
    Ready: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    Done: 'bg-green-500/10 text-green-400 border border-green-500/20',
    Cancelled: 'bg-red-500/10 text-red-400 border border-red-500/20',
    Waiting: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[type] || 'bg-gray-800 text-gray-300'}`}>
      {text}
    </span>
  );
};

const MoveHistory = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Derived stats (mock based on wireframe numbers to match visualization)
  const stats = {
    total: 12,
    in: 5,
    out: 4,
    pending: 4
  };

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">

        {/* Header & Controls Section */}
        <div className="flex justify-between items-start mb-10">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mt-2">
            Move history
          </h2>

          <div className="flex flex-col space-y-3 w-80">
            {/* Search Input using the SearchButton Component */}
            <div className="flex justify-end w-full">
              <SearchButton onSearch={setSearchQuery} />
            </div>

            {/* Filters */}
            <div className="relative">
              <select className="appearance-none block w-full px-4 py-2 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors sm:text-sm pr-10">
                <option>All types</option>
                <option>Receipts (In)</option>
                <option>Deliveries (Out)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>

            <div className="relative">
              <select className="appearance-none block w-full px-4 py-2 border border-[#2e303a] rounded-lg bg-[#1f2028] text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors sm:text-sm pr-10">
                <option>All statuses</option>
                <option>Ready</option>
                <option>Done</option>
                <option>Waiting</option>
                <option>Cancelled</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats Row */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-gray-400 text-sm font-medium">Total moves</p>
            <p className="text-3xl font-semibold text-white mt-1">{stats.total}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">In (receipts)</p>
            <p className="text-3xl font-semibold text-blue-400 mt-1">{stats.in}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Out (deliveries)</p>
            <p className="text-3xl font-semibold text-green-400 mt-1">{stats.out}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Pending action</p>
            <p className="text-3xl font-semibold text-white mt-1">{stats.pending}</p>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#16171d] rounded-xl border border-[#2e303a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#1f2028] border-b border-[#2e303a]">
                <tr>
                  <th className="py-4 px-6 font-medium text-gray-400">ID</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Direction</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Status</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Party</th>
                  <th className="py-4 px-6 font-medium text-gray-400">From &rarr; To</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Scheduled</th>
                  <th className="py-4 px-6 font-medium text-gray-400">Done on</th>
                </tr>
              </thead>
              <tbody>
                {mockMoves.map((move, idx) => (
                  <tr key={move.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== mockMoves.length - 1 ? 'border-b border-[#2e303a]' : ''}`}>
                    <td className="py-4 px-6 text-gray-400">{move.id}</td>
                    <td className="py-4 px-6">
                      <Pill type={move.direction} text={move.direction} />
                    </td>
                    <td className="py-4 px-6">
                      <Pill type={move.status} text={move.status} />
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-200">{move.party}</td>
                    <td className="py-4 px-6 text-gray-300 font-medium flex items-center gap-2">
                      {move.from} <ArrowRight className="text-gray-500 w-4 h-4" /> {move.to}
                    </td>
                    <td className="py-4 px-6 text-gray-400">{move.scheduled}</td>
                    <td className="py-4 px-6 text-gray-400">{move.doneOn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">1–{mockMoves.length}</span> of {stats.total}
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
