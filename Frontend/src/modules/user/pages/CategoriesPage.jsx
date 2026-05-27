import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCategory } from '../store/productSlice';
import ProductCard from '../../../shared/components/ProductCard';

export default function CategoriesPage() {
  const dispatch = useDispatch();

  // Selectors
  const { medicines, selectedCategory } = useSelector(state => state.products);

  // Available categories list
  const categoriesList = ['All', 'Medicines', 'Ayurveda', 'Wellness', 'Health Devices'];

  // Filter products by selected category
  const filteredProducts = selectedCategory === 'All' 
    ? medicines 
    : medicines.filter(med => med.category === selectedCategory);

  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-10">
      
      {/* 1. Category Selector Left Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col gap-2 w-64 shrink-0 bg-white p-5 rounded-3xl border border-slate-100 shadow-premium select-none">
        <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider mb-3 px-1">Health Categories</h3>
        {categoriesList.map((cat) => (
          <button
            key={cat}
            onClick={() => dispatch(setSelectedCategory(cat))}
            className={`text-left text-xs font-black px-4 py-3 rounded-2xl transition-all ${
              selectedCategory === cat
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
            onClick={() => dispatch(setSelectedCategory(cat))}
            className={`whitespace-nowrap px-4 py-2 text-xs font-black rounded-xl transition-all shrink-0 ${
              selectedCategory === cat
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
        {/* Active Title and products count */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-base font-extrabold text-slate-800">
            {selectedCategory === 'All' ? 'All Products' : selectedCategory} Products
          </h2>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {filteredProducts.length} items found
          </span>
        </div>

        {/* Dynamic products list grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredProducts.map((med) => (
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

    </div>
  );
}
