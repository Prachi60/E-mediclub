import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { FiPackage, FiGrid, FiPlus, FiUploadCloud, FiTrash2, FiCheckCircle } from 'react-icons/fi';

// Dummy static categories
const initialCategories = ['Allopathy', 'Ayurveda', 'Wellness', 'Homeopathy', 'Personal Care'];

export default function ProductManagement() {
  const dispatch = useDispatch();
  const { products } = useSelector(state => state.products); // Reads standard customer medicines list
  
  // Local states
  const [localProducts, setLocalProducts] = useState(products || []);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [editingStockId, setEditingStockId] = useState(null);
  const [stockVal, setStockVal] = useState(0);

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCategoryName || categories.includes(newCategoryName)) return;
    setCategories([...categories, newCategoryName]);
    setNewCategoryName("");
  };

  const handleDeleteProduct = (id) => {
    setLocalProducts(localProducts.filter(p => p.id !== id));
  };

  const handleSaveStock = (id) => {
    setLocalProducts(localProducts.map(p => 
      p.id === id ? { ...p, stock: Number(stockVal) } : p
    ));
    setEditingStockId(null);
  };

  // Simulate bulk processing CSV import files
  const handleProcessBulkUpload = () => {
    setUploadSuccess(true);
    setTimeout(() => {
      const mockCsvProducts = [
        { id: 901, name: 'Saridon Headache Relief', price: 42, stock: 120, category: 'Allopathy', packSize: 'Strip of 10 tablets', discPercent: 12 },
        { id: 902, name: 'Accu-Chek Instant Blood Glucose', price: 950, stock: 45, category: 'Wellness', packSize: '1 Monitor with 10 Strips', discPercent: 15 },
        { id: 903, name: 'Himalaya Liv 52 DS Liver Care', price: 170, stock: 90, category: 'Ayurveda', packSize: 'Bottle of 60 tablets', discPercent: 8 },
        { id: 904, name: 'Zandu Pancharishta Digestive Tonic', price: 220, stock: 65, category: 'Ayurveda', packSize: 'Bottle of 450ml', discPercent: 10 },
        { id: 905, name: 'Carihill Tablets for Platelet Increase', price: 350, stock: 30, category: 'Allopathy', packSize: 'Strip of 15 tablets', discPercent: 5 },
      ];
      setLocalProducts([...mockCsvProducts, ...localProducts]);
      setUploadSuccess(false);
      setShowBulkUpload(false);
    }, 1500);
  };

  // Define Grid Columns
  const columns = [
    { 
      key: 'name', 
      header: 'Clinical Product',
      render: (row) => (
        <div className="flex items-center gap-3">
          <img 
            src={row.image || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=80&auto=format&fit=crop&q=80'} 
            alt={row.name} 
            className="w-8 h-8 rounded-lg object-cover border border-slate-100 shrink-0"
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
        <div className="flex items-center gap-2">
          {editingStockId === row.id ? (
            <div className="flex items-center gap-1">
              <input 
                type="number" 
                value={stockVal} 
                onChange={(e) => setStockVal(e.target.value)}
                className="w-16 px-1.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-2xs outline-none font-black"
              />
              <button 
                onClick={() => handleSaveStock(row.id)}
                className="text-teal hover:underline text-[9px] font-black uppercase cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className={`font-black ${row.stock < 15 ? 'text-coral' : 'text-slate-800'}`}>
                {row.stock} units
              </span>
              <button 
                onClick={() => { setEditingStockId(row.id); setStockVal(row.stock); }}
                className="text-[9px] text-slate-400 hover:text-teal font-extrabold cursor-pointer"
              >
                Edit
              </button>
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'discPercent', 
      header: 'Discount %',
      render: (row) => <span className="text-teal font-extrabold">{row.discPercent || 0}% OFF</span>
    }
  ];

  // Action column triggers
  const tableActions = (row) => (
    <button 
      onClick={() => handleDeleteProduct(row.id)}
      className="p-2 bg-coral-light/40 hover:bg-coral-light text-coral rounded-xl transition-all cursor-pointer tap-scale"
    >
      <FiTrash2 className="text-sm shrink-0" />
    </button>
  );

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Pharmacy Catalog Engine</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review live pharmaceutical listings, categories registries, and bulk uploads templates.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black tracking-wider uppercase rounded-2xl transition-all cursor-pointer tap-scale"
          >
            <FiUploadCloud /> Bulk Upload
          </button>
        </div>
      </div>

      {/* Main Catalog View Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Product table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <ReusableTable 
            columns={columns}
            data={localProducts}
            searchPlaceholder="Search product by name..."
            searchKey="name"
            filterOptions={{ key: 'category', label: 'Class', options: categories }}
            actions={tableActions}
            fileName="emediclub-clinical-catalog"
          />
        </div>

        {/* Right Side: Category Registry & Settings */}
        <div className="flex flex-col gap-5">
          
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiGrid className="text-teal" /> Category Registry
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Add therapy groupings or pharmaceutical classifications.
            </p>

            {/* List tags */}
            <div className="flex flex-wrap gap-1.5 mb-5">
              {categories.map((cat, idx) => (
                <span 
                  key={idx} 
                  className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl text-[10px] font-black text-slate-600 uppercase tracking-wide"
                >
                  {cat}
                </span>
              ))}
            </div>

            {/* Add tag form */}
            <form onSubmit={handleAddCategory} className="flex gap-2 border-t border-slate-50 pt-4">
              <input 
                type="text" 
                placeholder="New category..." 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-semibold outline-none focus:border-teal"
              />
              <button 
                type="submit"
                className="p-2.5 bg-teal text-white rounded-xl shadow-sm hover:bg-teal-dark transition-all cursor-pointer tap-scale"
              >
                <FiPlus />
              </button>
            </form>
          </div>

        </div>

      </section>

      {/* CSV Bulk Upload Modal Dashboard */}
      <AnimatePresence>
        {showBulkUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBulkUpload(false)}
              className="fixed inset-0 bg-slate-900"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-md w-full p-6 sm:p-8 z-10 text-center relative overflow-hidden"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
                <FiUploadCloud className="text-teal" /> Bulk Import Console
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-3 mb-6">
                Drag drop spreadsheets to append medical inventories.
              </p>

              {uploadSuccess ? (
                <div className="py-8 flex flex-col items-center gap-3.5 animate-pulse">
                  <FiCheckCircle className="text-5xl text-teal" />
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Importing formulations data...</h4>
                  <p className="text-2xs text-slate-400 uppercase font-extrabold tracking-widest">Injecting 5 popular listings profiles</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  
                  {/* Upload Drop Zone */}
                  <div className="border-2 border-dashed border-slate-200 hover:border-teal rounded-2xl py-10 px-5 bg-slate-50 hover:bg-teal-light/10 transition-colors flex flex-col items-center justify-center gap-2.5 cursor-pointer">
                    <FiUploadCloud className="text-4xl text-slate-400" />
                    <span className="text-xs font-black text-slate-700 uppercase tracking-wide">Select your drug catalog file</span>
                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Supports: .csv, .xls, .xlsx files</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <button
                      onClick={() => setShowBulkUpload(false)}
                      className="py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleProcessBulkUpload}
                      className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                    >
                      Process Upload
                    </button>
                  </div>

                </div>
              )}

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
