import React from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 max-w-7xl mx-auto w-full">

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Receipt Card */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-64">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
              Receipt
            </h2>

            <div className="flex justify-between items-end flex-1">
              {/* Button aligns to bottom left */}
              <div className="w-48">
                <Button onClick={() => console.log("Receipts clicked")}>
                  4 to receive
                </Button>
              </div>

              {/* Status List aligns to bottom right */}
              <div className="flex flex-col space-y-2 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-red-400 font-bold text-lg">1</span>
                  <span className="text-gray-400 text-sm">Late</span>
                </div>
                
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-purple-400 font-bold text-lg">4</span>
                  <span className="text-gray-400 text-sm">operations</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Card */}
          <div className="bg-[#16171d] border border-[#2e303a] rounded-3xl p-8 shadow-2xl flex flex-col justify-between h-64">
            <h2 className="text-2xl font-bold text-white mb-6 tracking-wide">
              Delivery
            </h2>

            <div className="flex justify-between items-end flex-1">
              {/* Button aligns to bottom left */}
              <div className="w-48">
                <Button onClick={() => console.log("Deliveries clicked")}>
                  4 to deliver
                </Button>
              </div>

              {/* Status List aligns to bottom right */}
              <div className="flex flex-col space-y-2 text-right">
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-red-400 font-bold text-lg">1</span>
                  <span className="text-gray-400 text-sm">Late</span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-yellow-400 font-bold text-lg">2</span>
                  <span className="text-gray-400 text-sm">Waiting</span>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <span className="text-purple-400 font-bold text-lg">4</span>
                  <span className="text-gray-400 text-sm">operations</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
