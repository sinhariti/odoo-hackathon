import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import PrintPageButton from '../components/PrintPageButton';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, Trash2, Check, X } from 'lucide-react';
import api from '../api/api';

const AddDelivery = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  // Pickings state
  const [pickingId, setPickingId] = useState(null);
  const [reference, setReference] = useState('New');
  const [status, setStatus] = useState('Draft'); // Draft | Waiting | Ready | Done

  // Form Data
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    scheduleDate: '',
    responsible: user?.name || user?.email || 'admin',
    operationType: 'Delivery Orders',
  });

  // Background Data
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [outOfStockProduct, setOutOfStockProduct] = useState(null);

  // Added Products
  const [products, setProducts] = useState([]);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ productId: '', quantity: 1 });

  // Fetch reference data eagerly, and picking data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, locRes] = await Promise.all([
          api.get('/products'),
          api.get('/locations')
        ]);
        setAvailableProducts(prodRes.products || []);
        setAvailableLocations(locRes.locations || []);

        if (id) {
          const paramsId = parseInt(id);
          const { picking } = await api.get(`/deliveries/${paramsId}`);
          setPickingId(picking.id);
          setReference(picking.reference || `#${picking.id}`);
          setStatus(picking.status.charAt(0).toUpperCase() + picking.status.slice(1));
          setFormData({
            deliveryAddress: picking.customerName || '',
            scheduleDate: picking.scheduledDate ? picking.scheduledDate.split('T')[0] : '',
            responsible: picking.createdBy?.name || user?.name || user?.email || 'admin',
            operationType: 'Delivery Orders'
          });
          const mappedProducts = (picking.moves || []).map(m => ({
            id: m.id,
            productId: m.productId,
            product: m.product ? `[${m.product.sku || ''}] ${m.product.name}` : 'Unknown',
            quantity: m.demandQty
          }));
          setProducts(mappedProducts);
        }
      } catch (err) {
        setError('Failed to load initial data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user?.name, user?.email]);

  const handleAddProduct = async () => {
    if (!newProduct.productId) return;
    const prodDef = availableProducts.find(p => p.id === parseInt(newProduct.productId));
    const prodName = prodDef ? `[${prodDef.sku || ''}] ${prodDef.name}` : 'Unknown';

    if (pickingId) {
      try {
        setSaving(true);
        const { move } = await api.post(`/deliveries/${pickingId}/lines`, {
          productId: parseInt(newProduct.productId),
          demandQty: newProduct.quantity || 1
        });
        setProducts([...products, {
          id: move.id, // real backend id
          productId: move.productId,
          product: prodName,
          quantity: move.demandQty
        }]);
      } catch (err) {
        setError(err.message || 'Failed to add product to delivery');
      } finally {
        setSaving(false);
      }
    } else {
      setProducts([...products, {
        id: Date.now(), // temp id
        productId: parseInt(newProduct.productId),
        product: prodName,
        quantity: newProduct.quantity || 1
      }]);
    }

    setNewProduct({ productId: '', quantity: 1 });
    setAddingProduct(false);
    setOutOfStockProduct(null); // Clear out of stock highlight on new product
  };

  const handleDeleteProduct = async (id) => {
    if (pickingId) {
      try {
        setSaving(true);
        await api.delete(`/deliveries/${pickingId}/lines/${id}`);
        setProducts(products.filter(p => p.id !== id));
      } catch (err) {
        setError(err.message || 'Failed to remove product from delivery');
      } finally {
        setSaving(false);
      }
    } else {
      setProducts(products.filter(p => p.id !== id));
    }
    setOutOfStockProduct(null);
  };

  const markAsTodo = async () => {
    setSaving(true);
    setError('');
    setOutOfStockProduct(null);
    try {
      if (pickingId) {
        await api.put(`/deliveries/${pickingId}`, {
          status: 'waiting',
          customerName: formData.deliveryAddress,
          scheduledDate: formData.scheduleDate || null
        });
        setStatus('Waiting');
        setSaving(false);
        return;
      }

      const customerLoc = availableLocations.find(l => l.type === 'customer');
      const internalLoc = availableLocations.find(l => l.type === 'internal');

      const payload = {
        customerName: formData.deliveryAddress,
        srcLocationId: internalLoc ? internalLoc.id : 1, // Fallback
        destLocationId: customerLoc ? customerLoc.id : null,
        scheduledDate: formData.scheduleDate || null,
      };

      const { picking } = await api.post('/deliveries', payload);

      for (const line of products) {
        await api.post(`/deliveries/${picking.id}/lines`, {
          productId: line.productId,
          demandQty: line.quantity
        });
      }

      await api.put(`/deliveries/${picking.id}`, { status: 'waiting' });

      setPickingId(picking.id);
      setReference(picking.reference || `#${picking.id}`);
      setStatus('Waiting');
    } catch (err) {
      setError(err.message || 'Failed to save delivery');
    } finally {
      setSaving(false);
    }
  };

  const checkAvailability = async () => {
    if (!pickingId) return;
    setSaving(true);
    setError('');
    setOutOfStockProduct(null);
    try {
      await api.put(`/deliveries/${pickingId}`, { status: 'ready' });
      setStatus('Ready');
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setSaving(false);
    }
  };

  const validatePicking = async () => {
    if (!pickingId) return;
    setSaving(true);
    setError('');
    setOutOfStockProduct(null);
    try {
      await api.post(`/deliveries/${pickingId}/validate`);
      setStatus('Done');
    } catch (err) {
      const errMsg = err.message || 'Validation failed';
      setError(errMsg);
      // Parse insufficient stock error to highlight the row
      if (errMsg.includes('Insufficient stock for product:')) {
        const productName = errMsg.split('Insufficient stock for product:')[1].trim();
        setOutOfStockProduct(productName);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleActionClick = () => {
    if (status === 'Draft') {
      markAsTodo();
    } else if (status === 'Waiting') {
      checkAvailability();
    } else if (status === 'Ready') {
      validatePicking();
    }
  };

  const handleCancel = async () => {
    if (!pickingId) {
      navigate('/operations/delivery');
      return;
    }
    setSaving(true);
    setError('');
    setOutOfStockProduct(null);
    try {
      await api.post(`/deliveries/${pickingId}/cancel`);
      navigate('/operations/delivery');
    } catch (err) {
      setError(err.message || 'Failed to cancel delivery');
      setSaving(false);
    }
  };

  const getActionButtonText = () => {
    if (saving) return 'Saving...';
    if (status === 'Draft') return 'Mark as Todo';
    if (status === 'Waiting') return 'Check Availability';
    if (status === 'Ready') return 'Validate';
    return 'Validated';
  };

  const statuses = ['Draft', 'Waiting', 'Ready', 'Done'];

  return (
    <div className="min-h-screen bg-[#08060d] text-gray-300 font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 p-8 max-w-5xl mx-auto w-full flex flex-col">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-24">
            <Button className="py-2! cursor-default">
              {id ? 'Edit' : 'New'}
            </Button>
          </div>
          <h2 className="text-3xl font-extrabold text-[#ffff] tracking-tight">
            Delivery
          </h2>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form Container */}
        <div className="bg-[#16171d] rounded-xl border border-[#2e303a] shadow-2xl overflow-hidden flex flex-col">

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b border-[#2e303a] bg-[#1a1b22] gap-4">
            <div className="flex gap-3">
              <div className="w-40">
                <Button
                  onClick={handleActionClick}
                  disabled={status === 'Done' || saving || (status === 'Draft' && !formData.deliveryAddress)}
                  className="py-2! text-sm!"
                >
                  {getActionButtonText()}
                </Button>
              </div>
              <div className="w-24">
                <PrintPageButton disabled={status !== 'Done'} />
              </div>
              <div className="w-24">
                <Button
                  onClick={handleCancel}
                  className="py-2! text-sm! bg-[#1f2028]! rounded-lg border border-[#3e404a] text-gray-300 hover:text-white! hover:border-red-500/50"
                >
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
                    <ChevronRight size={16} className="text-gray-600 mx-1" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Form Body */}
          <div className="p-8">
            <h3 className="text-2xl font-bold text-gray-200 mb-8">{reference}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8 mb-12">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Delivery Address</label>
                  <input
                    type="text"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    disabled={status !== 'Draft'}
                    placeholder="Customer Name/Address"
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Responsible</label>
                  <input
                    type="text"
                    value={formData.responsible}
                    onChange={(e) => setFormData({ ...formData, responsible: e.target.value })}
                    disabled={status !== 'Draft'}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors disabled:text-gray-500"
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
                    disabled={status !== 'Draft'}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors [color-scheme:dark] disabled:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Operation Type</label>
                  <select
                    value={formData.operationType}
                    onChange={(e) => setFormData({ ...formData, operationType: e.target.value })}
                    disabled={status !== 'Draft'}
                    className="w-full bg-transparent border-b border-[#3e404a] text-white py-2 focus:outline-none focus:border-purple-500 transition-colors appearance-none disabled:text-gray-500"
                  >
                    <option value="Delivery Orders" className="bg-[#1f2028]">Delivery Orders</option>
                    <option value="Internal Transfers" className="bg-[#1f2028]">Internal Transfers</option>
                    <option value="Dropship Orders" className="bg-[#1f2028]">Dropship Orders</option>
                  </select>
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
                    {products.map((p) => {
                      const isOutOfStock = outOfStockProduct && p.product.includes(outOfStockProduct);
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-[#2e303a] transition-colors group ${isOutOfStock ? 'bg-red-900/30 border-red-500/50' : 'hover:bg-[#1f2028]'
                            }`}
                        >
                          <td className={`py-4 px-2 font-medium ${isOutOfStock ? 'text-red-300' : 'text-gray-200'}`}>
                            {p.product}
                          </td>
                          <td className={`py-4 px-2 text-right font-medium ${isOutOfStock ? 'text-red-300' : 'text-gray-300'}`}>
                            {p.quantity}
                          </td>
                          <td className="py-4 px-2 text-right">
                            {(status === 'Draft' || status === 'Ready') && (
                              <button
                                onClick={() => handleDeleteProduct(p.id)}
                                className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 outline-none focus:outline-none"
                                title="Delete product"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}

                    {(status === 'Draft' || status === 'Ready') && (
                      addingProduct ? (
                        <tr className="border-b border-[#2e303a] bg-[#1a1b22]">
                          <td className="py-2 px-2">
                            <select
                              value={newProduct.productId}
                              onChange={(e) => setNewProduct({ ...newProduct, productId: e.target.value })}
                              autoFocus
                              className="w-full bg-[#16171d] border border-[#3e404a] text-white px-3 py-1.5 rounded-md focus:outline-none focus:border-purple-500 text-sm [&>option]:bg-[#1f2028]"
                            >
                              <option value="">Select a product...</option>
                              {availableProducts.map((ap) => (
                                <option key={ap.id} value={ap.id}>
                                  {ap.sku ? `[${ap.sku}] ` : ''}{ap.name}
                                </option>
                              ))}
                            </select>
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
                      )
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

export default AddDelivery;
