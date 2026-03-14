import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Trash2, Check, X } from 'lucide-react';

const AddReceipt = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState('Draft'); // Draft | Ready | Done
  const [formData, setFormData] = useState({
    receiveFrom: '',
    scheduleDate: '',
    responsible: user?.name || user?.email || 'admin',
  });
  const [products, setProducts] = useState([
    { id: 1, product: '[DESK001] Desk', quantity: 6 }
  ]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ product: '', quantity: 1 });

  const handleAddProduct = () => {
    if (!newProduct.product) return;
    setProducts([...products, { ...newProduct, id: Date.now() }]);
    setNewProduct({ product: '', quantity: 1 });
    setAddingProduct(false);
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleActionClick = () => {
    if (status === 'Draft') setStatus('Ready');
    else if (status === 'Ready') setStatus('Done');
  };

  const getActionButtonText = () => {
    if (status === 'Draft') return 'Mark as To Do';
    if (status === 'Ready') return 'Validate';
    return 'Validated';
  };

  const statuses = ['Draft', 'Ready', 'Done'];

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-24">
            <Button className="py-2! cursor-default">
              New
            </Button>
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Receipt
          </h2>
        </div>

        {/* Form Container */}
        <div className="bg-[#16171d] rounded-xl border border-[#2e303a] shadow-2xl overflow-hidden flex flex-col">

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-[#2e303a] bg-[#1a1b22] gap-4">
            <div className="flex gap-3">
              <div className="w-36">
                <Button
                  onClick={handleActionClick}
                  disabled={status === 'Done'}
                  className="py-2! text-sm!"
                >
                  {getActionButtonText()}
                </Button>
              </div>
              <div className="w-24">
                <Button className="py-2! text-sm! bg-[#1f2028]! rounded-lg border border-[#3e404a] text-gray-300 hover:text-white! hover:border-purple-500/50">
                  Print
                </Button>
              </div>
              <div className="w-24">
                <Button className="py-2! text-sm! bg-[#1f2028]! rounded-lg border border-[#3e404a] text-gray-300 hover:text-white! hover:border-red-500/50">
                  Cancel
                </Button>
              </div>
            </div>

            {/* Status Path (Breadcrumb) */}
            <div className="flex items-center bg-[#1f2028] px-4 py-2 rounded-full border border-[#2e303a]">
              {statuses.map((s, idx) => (
                <React.Fragment key={s}>
                  <span className={`text-sm font-bold tracking-wide ${status === s ? 'text-purple-400' : 'text-gray-500'}`}>
                    {s}
                  </span>
                  {idx < statuses.length - 1 && (
                    <ChevronRight size={16} className="text-gray-600 mx-2" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-200 mb-8">WH/IN/0005</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-12">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Receive From</label>
                  <input
                    type="text"
                    value={formData.receiveFrom}
                    onChange={(e) => setFormData({ ...formData, receiveFrom: e.target.value })}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Responsible</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Schedule Date</label>
                  <input
                    type="date"
                    value={formData.scheduleDate}
                    onChange={(e) => setFormData({ ...formData, scheduleDate: e.target.value })}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark]"
                  />
                </div>
              </div>
            </div>

            {/* Products Data */}
            <div className="mt-8">
              <div className="border-b border-[#2e303a] mb-4">
                <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                  <li className="mr-2">
                    <a href="#" className="inline-block p-4 text-purple-400 border-b-2 border-purple-400 rounded-t-lg active">Products</a>
                  </li>
                </ul>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead className="border-b border-[#3e404a]">
                    <tr>
                      <th className="py-3 px-2 font-medium text-gray-400 w-2/3">Product</th>
                      <th className="py-3 px-2 font-medium text-gray-400 w-1/3 text-right">Quantity</th>
                      <th className="py-3 px-2 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-b border-[#2e303a] hover:bg-[#1f2028] transition-colors group">
                        <td className="py-4 px-2 font-medium text-gray-200">{p.product}</td>
                        <td className="py-4 px-2 text-right text-gray-300 font-medium">{p.quantity}</td>
                        <td className="py-4 px-2 text-right">
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 outline-none focus:outline-none"
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {addingProduct ? (
                      <tr className="border-b border-[#2e303a] bg-[#1a1b22]">
                        <td className="py-2 px-2">
                          <input
                            type="text"
                            placeholder="Product name..."
                            value={newProduct.product}
                            onChange={(e) => setNewProduct({ ...newProduct, product: e.target.value })}
                            autoFocus
                            className="w-full bg-[#16171d] border border-[#3e404a] text-white px-3 py-1.5 rounded-md focus:outline-none focus:border-purple-500 text-sm"
                          />
                        </td>
                        <td className="py-2 px-2 text-right">
                          <input
                            type="number"
                            min="1"
                            value={newProduct.quantity}
                            onChange={(e) => setNewProduct({ ...newProduct, quantity: parseInt(e.target.value) || 0 })}
                            className="w-20 bg-[#16171d] border border-[#3e404a] text-white px-3 py-1.5 rounded-md focus:outline-none focus:border-purple-500 text-sm text-right inline-block"
                          />
                        </td>
                        <td className="py-2 px-2 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={handleAddProduct} className="p-1.5 text-green-400 hover:bg-green-400/10 rounded-md transition-colors outline-none focus:outline-none">
                              <Check size={16} />
                            </button>
                            <button onClick={() => setAddingProduct(false)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors outline-none focus:outline-none">
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan="3" className="py-4 px-2">
                          <button
                            type="button"
                            onClick={() => setAddingProduct(true)}
                            className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors inline-block outline-none focus:outline-none"
                          >
                            Add a Product
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
};

export default AddReceipt;
