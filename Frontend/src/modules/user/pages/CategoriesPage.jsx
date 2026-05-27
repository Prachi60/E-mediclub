import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { FiUploadCloud } from 'react-icons/fi';
import { setSelectedCategory, setPrescriptionFilterActive } from '../store/productSlice';
import ProductCard from '../../../shared/components/ProductCard';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // Modal & Prescription Filtering States
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Selectors
  const { medicines, selectedCategory, selectedLocation, isPrescriptionFilterActive } = useSelector(state => state.products);

  // Direct derived route mapping
  const isDirectRoute = 
    location.pathname === '/medicines' || 
    location.pathname === '/wellness' || 
    location.pathname === '/ayurveda';

  const baseActiveCategory = isDirectRoute 
    ? (location.pathname === '/medicines' ? 'Medicines' : location.pathname === '/wellness' ? 'Wellness' : 'Ayurveda')
    : selectedCategory;

  const getCityKey = (loc) => {
    if (!loc) return 'Mumbai, Maharashtra';
    const normalized = loc.toLowerCase();
    if (normalized.includes('mumbai')) return 'Mumbai, Maharashtra';
    if (normalized.includes('bengaluru') || normalized.includes('bangalore')) return 'Bengaluru, Karnataka';
    if (normalized.includes('delhi')) return 'New Delhi, Delhi';
    if (normalized.includes('hyderabad')) return 'Hyderabad, Telangana';
    if (normalized.includes('pune')) return 'Pune, Maharashtra';
    if (normalized.includes('chennai')) return 'Chennai, Tamil Nadu';
    if (normalized.includes('kolkata')) return 'Kolkata, West Bengal';
    if (normalized.includes('ahmedabad')) return 'Ahmedabad, Gujarat';
    return 'Mumbai, Maharashtra'; // Default fallback
  };

  const cityKey = getCityKey(selectedLocation);

  // Dynamic Categories based on Location
  const locationCategories = {
    'Mumbai, Maharashtra': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'],
    'Bengaluru, Karnataka': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Sports Nutrition'],
    'New Delhi, Delhi': ['All', 'Medicines', 'Ayurveda', 'Respiratory Care', 'Wellness'],
    'Hyderabad, Telangana': ['All', 'Medicines', 'Ayurveda', 'Diabetes Care', 'Health Devices'],
    'Pune, Maharashtra': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Homeopathy'],
    'Chennai, Tamil Nadu': ['All', 'Medicines', 'Ayurveda', 'Geriatric Care', 'Health Devices'],
    'Kolkata, West Bengal': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Herbal Extracts'],
    'Ahmedabad, Gujarat': ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Cardiac Care']
  };

  const categoriesList = locationCategories[cityKey] || locationCategories['Mumbai, Maharashtra'];

  const activeCategory = categoriesList.includes(baseActiveCategory) ? baseActiveCategory : 'All';

  // Filter products by selected category
  const initialFiltered = activeCategory === 'All' 
    ? medicines 
    : medicines.filter(med => {
        if (activeCategory === 'Sports Nutrition') {
          return med.id === 'med-1' || med.id === 'med-9';
        }
        if (activeCategory === 'Respiratory Care') {
          return med.id === 'med-13' || med.id === 'med-3';
        }
        if (activeCategory === 'Diabetes Care') {
          return med.id === 'med-5' || med.id === 'med-12';
        }
        if (activeCategory === 'Homeopathy' || activeCategory === 'Herbal Extracts') {
          return med.id === 'med-3' || med.id === 'med-11';
        }
        if (activeCategory === 'Geriatric Care') {
          return med.id === 'med-12' || med.id === 'med-1' || med.id === 'med-2';
        }
        if (activeCategory === 'Cardiac Care') {
          return med.id === 'med-12' || med.id === 'med-5';
        }
        return med.category === activeCategory;
      });

  // Filter only items in prescription if prescription uploaded
  const filteredProducts = isPrescriptionFilterActive
    ? initialFiltered.filter(med => {
        if (activeCategory === 'Medicines') {
          return med.id === 'med-2'; // Dolo 650
        } else if (activeCategory === 'Wellness') {
          return med.id === 'med-1'; // Revital H
        } else if (activeCategory === 'Ayurveda') {
          return med.id === 'med-3'; // Chyawanprash Awaleha
        }
        return med.id === 'med-1' || med.id === 'med-2' || med.id === 'med-3';
      })
    : initialFiltered;

  // Dynamic products priorities by location
  const locationPriorities = {
    'Mumbai, Maharashtra': ['med-4', 'med-1', 'med-10', 'med-2', 'med-6', 'med-9'],
    'Bengaluru, Karnataka': ['med-3', 'med-6', 'med-11', 'med-1', 'med-9', 'med-2'],
    'New Delhi, Delhi': ['med-13', 'med-3', 'med-12', 'med-6', 'med-2', 'med-11'],
    'Hyderabad, Telangana': ['med-5', 'med-2', 'med-9', 'med-12', 'med-1', 'med-10'],
    'Pune, Maharashtra': ['med-8', 'med-1', 'med-4', 'med-3', 'med-6', 'med-11'],
    'Chennai, Tamil Nadu': ['med-6', 'med-9', 'med-12', 'med-2', 'med-1', 'med-10'],
    'Kolkata, West Bengal': ['med-3', 'med-8', 'med-11', 'med-6', 'med-1', 'med-2'],
    'Ahmedabad, Gujarat': ['med-2', 'med-4', 'med-5', 'med-12', 'med-9', 'med-6']
  };

  const priorityIds = locationPriorities[cityKey] || locationPriorities['Mumbai, Maharashtra'];

  const prioritizedFilteredProducts = [...filteredProducts].sort((a, b) => {
    const idxA = priorityIds.indexOf(a.id);
    const idxB = priorityIds.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const handleUploadSuccess = () => {
    dispatch(setPrescriptionFilterActive(true));
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-10">
      
      {/* 1. Category Selector Left Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium select-none">
        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-3 px-1">Health Categories</h3>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              dispatch(setSelectedCategory(cat));
              if (isDirectRoute) {
                navigate('/categories');
              }
            }}
            className={`text-left text-xs font-black px-4 py-3 rounded-2xl transition-all ${
              activeCategory === cat
                ? 'bg-forest text-white shadow-sm'
                : 'text-slate-600 hover:text-forest hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </aside>

      {/* 2. Category Selector Top Scrollbar - Mobile */}
      <nav className="md:hidden flex gap-2 overflow-x-auto no-scrollbar py-1.5 select-none -mx-4 px-4 bg-white border-y border-slate-100">
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              dispatch(setSelectedCategory(cat));
              if (isDirectRoute) {
                navigate('/categories');
              }
            }}
            className={`whitespace-nowrap px-4 py-2 text-xs font-black rounded-xl transition-all shrink-0 ${
              activeCategory === cat
                ? 'bg-forest text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* 3. Products List View Container */}
      <section className="flex-1 flex flex-col gap-4">
        
        {/* Prescription Quick Upload Banner Strip */}
        {isPrescriptionRoute() && (
          <div className="w-full bg-gradient-to-r from-teal-light/20 to-forest-mint border border-teal/10 rounded-3xl p-5 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none animate-fade-in mb-2">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-teal text-white flex items-center justify-center text-xl shrink-0 shadow-sm animate-pulse-subtle">
                📋
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wide">Quick Prescription Order</h3>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">Have a prescription? Upload it and we'll find the right products for you.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-teal hover:bg-teal-dark text-white text-xs font-black tracking-wider uppercase rounded-2xl shadow-sm transition-all duration-205 tap-scale cursor-pointer self-start sm:self-auto shrink-0"
            >
              <FiUploadCloud className="text-sm shrink-0" /> Upload Prescription
            </button>
          </div>
        )}

        {/* Prescription filter banner tag alert */}
        {isPrescriptionFilterActive && (
          <div className="w-full bg-teal-light/45 border border-teal/15 p-4 rounded-3xl flex items-center justify-between gap-3 text-xs font-semibold text-teal-dark select-none animate-fade-in">
            <span className="flex items-center gap-2 text-slate-700 font-bold">
              <span>📄</span> Prescribed medicines extracted from your uploaded prescription.
            </span>
            <button
              onClick={() => dispatch(setPrescriptionFilterActive(false))}
              className="px-3.5 py-1.5 bg-teal hover:bg-teal-dark text-white text-[9px] font-black uppercase tracking-wider rounded-xl shadow-sm cursor-pointer transition-colors"
            >
              Show All Products
            </button>
          </div>
        )}

        {/* Active Title and products count */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-800">
            {activeCategory === 'All' ? 'All Products' : activeCategory} Products
          </h2>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {filteredProducts.length} items found
          </span>
        </div>

        {/* Dynamic products list grid */}
        {prioritizedFilteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {prioritizedFilteredProducts.map((med) => (
              <ProductCard key={med.id} product={med} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl">📦</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Products Found</h4>
            <p className="text-xs text-slate-400 font-semibold">We are expanding our apothecary catalog. Check back soon!</p>
          </div>
        )}
      </section>

      {/* Prescription Upload Sheet Modal */}
      <PrescriptionUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
        onUploadSuccess={handleUploadSuccess}
      />

    </div>
  );

  // Helper checking prescription paths
  function isPrescriptionRoute() {
    return (
      location.pathname === '/medicines' || 
      location.pathname === '/wellness' || 
      location.pathname === '/ayurveda'
    );
  }
}
