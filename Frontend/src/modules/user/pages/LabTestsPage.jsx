import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiCalendar, FiClock, FiShield, FiFileText, FiSearch, 
  FiFilter, FiX, FiCheckCircle, FiChevronRight, FiMapPin, FiActivity, FiUploadCloud
} from 'react-icons/fi';
import LabTestCard from '../../../shared/components/LabTestCard';
import PrescriptionUpload from '../../../shared/components/PrescriptionUpload';

export default function LabTestsPage() {
  const navigate = useNavigate();
  // Redux Selectors
  const { labTests, labBookings, labs = [] } = useSelector(state => state.products);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHomeCollection, setFilterHomeCollection] = useState(false);
  const [filterFastReport, setFilterFastReport] = useState(false); // Reports within 12 Hrs
  const [filterPriceLimit, setFilterPriceLimit] = useState(3000);
  const [filterLab, setFilterLab] = useState('All');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Trigger loading skeleton on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, filterHomeCollection, filterFastReport, filterPriceLimit, filterLab]);

  // Filter tests list
  const filteredTests = labTests.filter(test => {
    // Search Query
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      test.testsIncluded.toLowerCase().includes(searchQuery.toLowerCase());

    // Home Collection
    const matchesHomeCollection = !filterHomeCollection || test.homeCollection;

    // Fast Report (Report in 6 Hrs, 8 Hrs, 12 Hrs)
    const matchesFastReport = !filterFastReport || 
      test.timeframe.includes('6 Hrs') || 
      test.timeframe.includes('8 Hrs') || 
      test.timeframe.includes('12 Hrs');

    // Price
    const currentPrice = test.discountPrice || test.price;
    const matchesPrice = currentPrice <= filterPriceLimit;

    // Specific Lab
    const matchesLab = filterLab === 'All' || test.labName.includes(filterLab);

    return matchesSearch && matchesHomeCollection && matchesFastReport && matchesPrice && matchesLab;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10 select-none relative font-sans">
      
      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Diagnostic Lab Tests</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Accurate clinical analysis and home collection certified under NABL & ISO 9001 guidelines.
          </p>
        </div>
        <button 
          onClick={() => setShowUploadModal(true)}
          className="bg-teal hover:bg-teal-dark text-white font-black text-xs px-5 py-2.5 rounded-2xl flex items-center gap-1.5 shadow-sm self-start md:self-auto cursor-pointer border-0 uppercase tracking-wider transition-colors shrink-0"
        >
          <FiUploadCloud className="text-sm shrink-0" />
          <span>Upload Prescription</span>
        </button>
      </div>

      {/* 2. Timeline active lab package bookings */}
      {labBookings.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest px-1">Upcoming Diagnostic Collections</h3>
          <div className="flex flex-col gap-3">
            {labBookings.map((bk) => (
              <div 
                key={bk.id}
                className="bg-white p-4 rounded-3xl border border-teal/15 bg-teal-light/20 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal text-white flex items-center justify-center text-lg font-bold shrink-0">
                    🧪
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{bk.packageName}</h4>
                    <p className="text-[10px] text-slate-405 font-bold uppercase mt-0.5">Reference No: {bk.id} • Scheduled</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-teal" />
                    <span>{bk.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-teal" />
                    <span>{bk.timeSlot.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full">
                    Home Collector Assigned
                  </span>
                  <button 
                    onClick={() => navigate('/profile')}
                    className="bg-teal hover:bg-teal-dark text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1 cursor-pointer border-0"
                  >
                    <FiFileText /> VIEW DETAILS
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Scrollable Clinical Laboratories Browsing Panel */}
      {labs.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest px-1">Certified Partner Laboratories</h3>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-3 -mx-4 px-4">
            {labs.map((lab) => (
              <div 
                key={lab.id}
                onClick={() => navigate(`/labs/${lab.id}`)}
                className="bg-white p-4 rounded-3xl border border-slate-100 hover:border-teal/30 shadow-premium hover:shadow-premium-hover shrink-0 w-64 cursor-pointer transition-all duration-300 flex flex-col justify-between gap-3 group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-teal-light/20 text-teal flex items-center justify-center text-lg font-black shrink-0 shadow-inner">
                      {lab.logo}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[11.5px] font-black text-slate-800 leading-tight group-hover:text-teal transition-colors truncate w-36">
                        {lab.name}
                      </h4>
                      <span className="text-[8.5px] text-slate-400 font-bold block mt-0.5">Reg: {lab.regNumber}</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-amber-500 font-black flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded shrink-0">
                    ★ {lab.rating}
                  </span>
                </div>

                <div className="flex justify-between items-center text-[9px] text-slate-450 font-extrabold uppercase border-t border-slate-50 pt-2.5">
                  <span className="bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">NABL & ISO</span>
                  <span className="text-slate-500">{lab.experience}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Filtering Panel & Search Input */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          {/* Main search bar */}
          <div className="relative w-full md:flex-1">
            <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search diagnostic packages (e.g. sugar, thyroid, lipid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Toggle Mobile */}
            <button 
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex-1 md:flex-none py-3 px-4 border border-slate-150 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <FiFilter className="text-teal" /> 
              <span>DIAGNOSTIC FILTERS</span>
              {showFiltersMobile ? <FiX className="text-[10px] shrink-0" /> : null}
            </button>
          </div>
        </div>

        {/* Expandable Lab Filters Deck */}
        <AnimatePresence>
          {(showFiltersMobile || window.innerWidth >= 1024) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-50 overflow-hidden"
            >
              {/* Filter: Home Collection */}
              <div className="flex flex-col justify-center h-full pt-2">
                <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-650">
                  <input 
                    type="checkbox"
                    checked={filterHomeCollection}
                    onChange={(e) => setFilterHomeCollection(e.target.checked)}
                    className="w-4 h-4 rounded text-teal accent-teal border-slate-300 focus:ring-teal-light cursor-pointer"
                  />
                  <span>🏠 FREE HOME COLLECTION</span>
                </label>
              </div>

              {/* Filter: Express Timing */}
              <div className="flex flex-col justify-center h-full pt-2">
                <label className="relative flex items-center gap-2.5 cursor-pointer text-xs font-bold text-slate-650">
                  <input 
                    type="checkbox"
                    checked={filterFastReport}
                    onChange={(e) => setFilterFastReport(e.target.checked)}
                    className="w-4 h-4 rounded text-teal accent-teal border-slate-300 focus:ring-teal-light cursor-pointer"
                  />
                  <span>⏱️ FAST REPORT (≤12 Hrs)</span>
                </label>
              </div>

              {/* Filter: Lab Provider */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Lab Provider</label>
                <select 
                  value={filterLab}
                  onChange={(e) => setFilterLab(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                >
                  <option value="All">All Laboratories</option>
                  <option value="E Mediclub">E Mediclub Labs</option>
                  <option value="Metropolis">Metropolis Diagnostics</option>
                  <option value="Thyrocare">Thyrocare Wellness</option>
                </select>
              </div>

              {/* Filter: Price range */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-450 tracking-wider">
                  <span>Maximum Package Price</span>
                  <span className="text-teal font-black">₹{filterPriceLimit}</span>
                </div>
                <input 
                  type="range"
                  min="300"
                  max="3000"
                  step="100"
                  value={filterPriceLimit}
                  onChange={(e) => setFilterPriceLimit(parseInt(e.target.value))}
                  className="w-full accent-teal mt-2 cursor-pointer"
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Health diagnostics instructions block banner */}
      <section className="bg-forest-light/60 p-4 rounded-[28px] border border-forest/10 flex items-center gap-3.5 text-xs text-forest-dark font-semibold">
        <span className="text-2xl animate-pulse-subtle">🩸</span>
        <div>
          <h4 className="font-extrabold text-sm text-forest-dark">E Mediclub Safe Lab Guarantee</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">
            Sterile single-use vacuum vials. Temperature-controlled shipping. MD pathologist verified digital reports.
          </p>
        </div>
      </section>

      {/* 6. Diagnostic Packages Display Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
          <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest">Available Diagnostic Packages</h3>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{filteredTests.length} tests found</span>
        </div>

        {isLoading ? (
          /* Shimmer skeletons loader grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4 animate-pulse-subtle">
                <div className="flex justify-between items-center">
                  <div className="w-1/3 h-3 bg-slate-200 rounded" />
                  <div className="w-1/4 h-3 bg-slate-150 rounded" />
                </div>
                <div className="w-3/4 h-4 bg-slate-200 rounded mt-1" />
                <div className="w-1/2 h-3.5 bg-slate-150 rounded mt-1" />
                <div className="h-10 bg-slate-50 border border-slate-100 rounded-2xl mt-2" />
                <div className="flex justify-between items-center mt-3 border-t border-slate-50 pt-3">
                  <div className="w-1/4 h-5 bg-slate-200 rounded" />
                  <div className="w-1/3 h-8 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTests.map((test) => (
              <LabTestCard key={test.id} test={test} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl">🧪</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Diagnostic Packages Match Filters</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
              We offer comprehensive blood panels and specialist testing. Try adjusting your price limits or search criteria.
            </p>
            <button 
              onClick={() => {
                setSearchQuery('');
                setFilterHomeCollection(false);
                setFilterFastReport(false);
                setFilterPriceLimit(3000);
                setFilterLab('All');
              }}
              className="mt-2 py-2 px-6 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* Prescription Upload Sheet Modal */}
      <PrescriptionUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />

    </div>
  );
}
