import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReusableTable from '../../admin/components/ReusableTable';
import { addProduct, editProduct, deleteProduct } from '../store/vendorSlice';
import { FiPackage, FiPlus, FiTrash2, FiEdit2, FiCheck, FiLayout } from 'react-icons/fi';

export default function VendorProductManagement() {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.vendor);

  // Modal active states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState("Allopathy");
  const [packSize, setPackSize] = useState("");
  const [discPercent, setDiscPercent] = useState("");
  const [image, setImage] = useState("");

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setName("");
    setPrice("");
    setStock("");
    setCategory("Allopathy");
    setPackSize("");
    setDiscPercent("");
    setImage("");
    setShowAddModal(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setName(prod.name);
    setPrice(prod.price);
    setStock(prod.stock);
    setCategory(prod.category);
    setPackSize(prod.packSize);
    setDiscPercent(prod.discPercent);
    setImage(prod.image || "");
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const payload = {
      name,
      price: Number(price),
      stock: Number(stock),
      category,
      packSize: packSize || 'Strip of 10 tablets',
      discPercent: Number(discPercent) || 0,
      image: image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
    };

    if (editingProduct) {
      dispatch(editProduct({ id: editingProduct.id, ...payload }));
    } else {
      dispatch(addProduct(payload));
    }

    setShowAddModal(false);
  };

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  // Define columns
  const columns = [
    { 
      key: 'name', 
      header: 'Medicine',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'} 
            alt={row.name} 
            className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0 select-none"
          />
          <div>
            <span className="font-extrabold text-slate-800 block text-xs truncate max-w-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">{row.packSize}</span>
          </div>
        </div>
      )
    },
    { key: 'category', header: 'Therapy Class' },
    { 
      key: 'price', 
      header: 'Listing Price',
      render: (row) => <span className="font-black text-slate-700">₹{row.price}</span>
    },
    { 
      key: 'stock', 
      header: 'Inventory Stock',
      render: (row) => (
        <span className={`font-black ${row.stock < 30 ? 'text-coral' : 'text-slate-800'}`}>
          {row.stock} units
        </span>
      )
    },
    { 
      key: 'discPercent', 
      header: 'Discount %',
      render: (row) => <span className="text-teal font-extrabold">{row.discPercent || 0}% OFF</span>
    }
  ];

  // Actions column trigger
  const tableActions = (row) => (
    <>
      <button 
        onClick={() => handleOpenEditModal(row)}
        className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all cursor-pointer tap-scale"
      >
        <FiEdit2 className="text-xs shrink-0" />
      </button>
      <button 
        onClick={() => handleDelete(row.id)}
        className="p-2 bg-coral-light/40 hover:bg-coral-light text-coral rounded-xl transition-all cursor-pointer tap-scale"
      >
        <FiTrash2 className="text-xs shrink-0" />
      </button>
    </>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header deck */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Medicine Catalog</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review your custom formulations, pricing catalogs, and replenish units stocks.
          </p>
        </div>
        <button 
          onClick={handleOpenAddModal}
          className="flex items-center gap-1.5 px-4.5 py-2.5 bg-teal text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm hover:bg-teal-dark transition-all cursor-pointer tap-scale"
        >
          <FiPlus /> Add Medicine
        </button>
      </div>

      {/* Main Table view */}
      <ReusableTable 
        columns={columns}
        data={products}
        searchPlaceholder="Search store inventory..."
        searchKey="name"
        actions={tableActions}
        fileName="emediclub-merchant-catalog"
      />

      {/* Add / Edit modal container */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-10 relative overflow-hidden"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiLayout className="text-teal" /> {editingProduct ? 'Edit Medicine Details' : 'Publish Medicine'}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3 mb-6">
                Fill details below to update your digital storefront.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Medicine / Product Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Shelcal 500 Calcium Tablets"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Listing Price (₹)</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 140"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Initial Stock Units</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 50"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Therapy Class</label>
                    <select 
                      value={category} 
                      onChange={(e) => setCategory(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black uppercase tracking-wide outline-none focus:border-teal"
                    >
                      <option value="Allopathy">Allopathy</option>
                      <option value="Ayurveda">Ayurveda</option>
                      <option value="Wellness">Wellness</option>
                      <option value="Homeopathy">Homeopathy</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Discount %</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 10"
                      value={discPercent}
                      onChange={(e) => setDiscPercent(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Pack Details</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Strip of 15 tablets"
                    value={packSize}
                    onChange={(e) => setPackSize(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Image link URL (Optional)</label>
                  <input 
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mt-4 border-t border-slate-50 pt-5">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                  >
                    {editingProduct ? 'Save Changes' : 'Publish Product'}
                  </button>
                </div>
              </form>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
