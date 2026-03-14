import React from 'react';
import Navbar from '../components/Navbar';
import SearchButton from '../components/SearchButton';

const Stock = () => {
  const stockData = [
    { id: 1, product: 'Desk', cost: '3000 Rs', onHand: 50, freeToUse: 45 },
    { id: 2, product: 'Table', cost: '3000 Rs', onHand: 50, freeToUse: 50 },
  ];

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6 pb-4 border-b border-[#2e303a]">
          <h2 className="text-3xl font-extrabold text-purple-400 tracking-tight">
            Stock
          </h2>
          <div>
            <SearchButton onSearch={(query) => console.log("Searching for:", query)} />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-[#16171d] rounded-xl border border-[#2e303a] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-[#1f2028] border-b border-[#2e303a]">
                <tr>
                  <th className="py-4 px-6 font-medium text-gray-400 w-1/4">Product</th>
                  <th className="py-4 px-6 font-medium text-gray-400 w-1/4">Per Unit Cost</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center w-1/4">On Hand</th>
                  <th className="py-4 px-6 font-medium text-gray-400 text-center w-1/4">Free to Use</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((item, idx) => (
                  <tr key={item.id} className={`hover:bg-[#1f2028] transition-colors ${idx !== stockData.length - 1 ? 'border-b border-dashed border-[#2e303a]' : ''}`}>
                    <td className="py-4 px-6 font-medium text-gray-200">{item.product}</td>
                    <td className="py-4 px-6 text-gray-400">{item.cost}</td>
                    <td className="py-4 px-6 text-center text-gray-300 font-medium">{item.onHand}</td>
                    <td className="py-4 px-6 text-center text-gray-300 font-medium">{item.freeToUse}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#2e303a] bg-[#1a1b22]">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white">1–{stockData.length}</span> of {stockData.length}
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

        {/* Subtitle / Empty State Placeholder */}
        <div className="mt-20 text-center">
          <p className="text-gray-400 font-medium">
            User must be able to update the stock from here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Stock;
