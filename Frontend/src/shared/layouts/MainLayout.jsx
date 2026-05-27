import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FiSearch, FiShoppingBag, FiMapPin, FiUser, FiMenu, FiChevronDown, 
  FiX, FiHome, FiActivity, FiCalendar, FiShoppingCart, FiPercent, FiTrash2 
} from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import Logo from '../components/Logo';
import { logout } from '../../modules/auth/store/authSlice';
import { setSelectedLocation, setSearchTerm } from '../../modules/user/store/productSlice';
import { updateQuantity, removeFromCart } from '../../modules/user/store/cartSlice';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Redux Selectors
  const { user, isAuthenticated } = useSelector(state => state.auth);
  const { items, total } = useSelector(state => state.cart);
  const { selectedLocation, searchTerm } = useSelector(state => state.products);

  // Component UI States
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchInput, setSearchInput] = useState(searchTerm);

  // Monitor scroll for premium visual indicators
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update input when Redux search query changes
  useEffect(() => {
    setSearchInput(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    dispatch(setSearchTerm(searchInput));
    navigate('/search');
  };

  const handleLocationSelect = (city) => {
    dispatch(setSelectedLocation(city));
    setShowLocationPopup(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setShowMobileSidebar(false);
    navigate('/');
  };

  const popularCities = [
    'Mumbai, Maharashtra', 'New Delhi, Delhi', 'Bengaluru, Karnataka', 
    'Hyderabad, Telangana', 'Pune, Maharashtra', 'Chennai, Tamil Nadu', 
    'Kolkata, West Bengal', 'Ahmedabad, Gujarat'
  ];

  const totalItemsCount = items.reduce((acc, item) => acc + item.qty, 0);

  // Determine active path for bottom navigation
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0 bg-transparent font-sans">
      
      {/* 1. Header / Navbar */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled ? 'bg-white shadow-premium py-2' : 'bg-white border-b border-slate-100 py-3'
      }`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileSidebar(true)} 
              className="p-1 text-slate-600 md:hidden hover:bg-slate-100 rounded-lg transition-colors"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="cursor-pointer" onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}>
              <Logo showText={true} />
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-2xl relative">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <FiSearch className="w-5 h-5" />
              </span>
              <input
                type="text"
                placeholder="Search medicines, wellness items, doctor specialties..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-100 rounded-full text-slate-700 text-sm outline-none transition-all"
              />
            </div>
            <button 
              type="submit" 
              className="absolute right-1 top-1 bottom-1 px-5 bg-forest hover:bg-forest-dark text-white font-medium rounded-full text-xs transition-colors"
            >
              Search
            </button>
          </form>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 md:gap-5">
            {/* Location selector trigger */}
            <button 
              onClick={() => setShowLocationPopup(true)} 
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-forest-light/60 hover:bg-forest-light text-forest text-xs font-semibold rounded-full transition-all"
            >
              <FiMapPin className="text-teal" />
              <span className="truncate max-w-[120px]">{selectedLocation.split(',')[0]}</span>
              <FiChevronDown className="w-3.5 h-3.5" />
            </button>

            {/* Login / Auth */}
            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-4">
                <button 
                  onClick={() => navigate('/profile')} 
                  className="flex items-center gap-2 hover:text-forest text-slate-600 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user?.name}</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={() => navigate('/login')} 
                  className="px-4 py-2 border border-forest text-forest hover:bg-forest-light font-bold text-xs rounded-full transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}

            {/* Shopping Cart Badge */}
            <button 
              onClick={() => navigate('/cart')} 
              className="relative p-2 text-slate-600 hover:text-forest hover:bg-slate-50 rounded-full transition-colors"
            >
              <FiShoppingBag className="w-6 h-6" />
              {totalItemsCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-coral text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white animate-pulse-subtle">
                  {totalItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Tab Bar below Navbar */}
        <div className="border-t border-slate-100 mt-2.5 pt-2 hidden md:block">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button 
              onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}
              className={`hover:text-forest transition-colors ${location.pathname === '/' ? 'text-forest border-b-2 border-forest pb-1' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => { navigate('/categories'); }}
              className={`hover:text-forest transition-colors ${location.pathname.startsWith('/categories') ? 'text-forest border-b-2 border-forest pb-1' : ''}`}
            >
              Medicines
            </button>
            <button 
              onClick={() => navigate('/lab-tests')}
              className={`hover:text-forest transition-colors ${location.pathname.startsWith('/lab-tests') ? 'text-forest border-b-2 border-forest pb-1' : ''}`}
            >
              Lab Tests
            </button>
            <button 
              onClick={() => navigate('/doctor-appointments')}
              className={`hover:text-forest transition-colors ${location.pathname.startsWith('/doctor-appointments') ? 'text-forest border-b-2 border-forest pb-1' : ''}`}
            >
              Doctor Consultations
            </button>
            <button 
              onClick={() => navigate('/orders')}
              className={`hover:text-forest transition-colors ${location.pathname.startsWith('/orders') ? 'text-forest border-b-2 border-forest pb-1' : ''}`}
            >
              Track Orders
            </button>
          </div>
        </div>

        {/* Mobile Search and Location Header */}
        <div className="px-4 mt-2.5 md:hidden flex flex-col gap-2">
          {/* Location button - Mobile */}
          <div className="flex items-center justify-between bg-slate-50 rounded-lg p-2 border border-slate-100">
            <button 
              onClick={() => setShowLocationPopup(true)} 
              className="flex items-center gap-2 text-slate-700 text-xs font-semibold"
            >
              <FiMapPin className="text-teal" />
              <span>Deliver to: <strong className="text-forest">{selectedLocation.split(',')[0]}</strong></span>
              <FiChevronDown className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-teal bg-teal-light px-2 py-0.5 rounded font-black">EXPRESS</span>
          </div>

          {/* Search field - Mobile */}
          <form onSubmit={handleSearchSubmit} className="relative flex w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
              <FiSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search medicines, wellness, lab tests..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent focus:border-teal-500 focus:bg-white rounded-xl text-slate-700 text-xs outline-none transition-all"
            />
          </form>
        </div>
      </header>

      {/* 2. Main Page Content wrapper */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-8">
        <Outlet />
      </main>

      {/* 3. Sticky Mobile Bottom Navigation ( Tata 1mg inspired) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-100 py-1.5 px-3 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.03)] rounded-t-2xl">
        <button 
          onClick={() => { dispatch(setSearchTerm('')); navigate('/'); }}
          className={`flex flex-col items-center gap-1 ${isActive('/') ? 'text-forest font-bold' : 'text-slate-400'}`}
        >
          <FiHome className="w-5 h-5" />
          <span className="text-[10px]">Home</span>
        </button>
        <button 
          onClick={() => navigate('/categories')}
          className={`flex flex-col items-center gap-1 ${isActive('/categories') ? 'text-forest font-bold' : 'text-slate-400'}`}
        >
          <FiActivity className="w-5 h-5" />
          <span className="text-[10px]">Medicines</span>
        </button>
        <button 
          onClick={() => navigate('/lab-tests')}
          className={`flex flex-col items-center gap-1 ${isActive('/lab-tests') ? 'text-forest font-bold' : 'text-slate-400'}`}
        >
          <FiCalendar className="w-5 h-5" />
          <span className="text-[10px]">Lab Tests</span>
        </button>
        <button 
          onClick={() => navigate('/doctor-appointments')}
          className={`flex flex-col items-center gap-1 ${isActive('/doctor-appointments') ? 'text-forest font-bold' : 'text-slate-400'}`}
        >
          <FiUser className="w-5 h-5" />
          <span className="text-[10px]">Doctors</span>
        </button>
        <button 
          onClick={() => navigate('/profile')}
          className={`flex flex-col items-center gap-1 ${isActive('/profile') ? 'text-forest font-bold' : 'text-slate-400'}`}
        >
          <div className="relative">
            <FiShoppingCart className="w-5 h-5" />
            {totalItemsCount > 0 && (
              <span className="absolute -top-1.5 -right-2.5 bg-coral text-white text-[8px] font-black w-4.5 h-4.5 flex items-center justify-center rounded-full border-2 border-white">
                {totalItemsCount}
              </span>
            )}
          </div>
          <span className="text-[10px]">Cart ({totalItemsCount})</span>
        </button>
      </nav>

      {/* 4. Floating Mobile Cart Banner (Sticky when items exist and user is not on Cart/Checkout pages) */}
      {totalItemsCount > 0 && !location.pathname.startsWith('/cart') && !location.pathname.startsWith('/checkout') && (
        <motion.div 
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-[58px] left-4 right-4 md:hidden z-30 bg-teal text-white p-3 rounded-2xl shadow-premium flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <FiShoppingBag className="w-5 h-5" />
            <div>
              <p className="text-xs font-bold">{totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} in cart</p>
              <p className="text-[10px] opacity-90">Total: ₹{total}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/cart')} 
            className="bg-white text-teal px-4 py-1.5 text-xs font-black rounded-lg shadow-sm"
          >
            Checkout
          </button>
        </motion.div>
      )}

      {/* 5. Location Popup Drawer (Tata 1mg Style) */}
      <AnimatePresence>
        {showLocationPopup && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLocationPopup(false)}
              className="fixed inset-0 z-50 bg-black bg-opacity-40"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-lg bg-white rounded-3xl p-6 shadow-premium-hover border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <FiMapPin className="text-teal" /> Choose your delivery location
                </h3>
                <button onClick={() => setShowLocationPopup(false)} className="text-slate-400 hover:text-slate-600">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Instant Search input */}
              <div className="relative mb-5">
                <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter pincode or city name"
                  defaultValue={selectedLocation}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLocationSelect(e.target.value);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 focus:border-teal-500 rounded-xl text-slate-700 text-sm outline-none transition-all"
                />
              </div>

              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">Popular Cities</p>
                <div className="grid grid-cols-2 gap-2">
                  {popularCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleLocationSelect(city)}
                      className={`text-left text-xs font-semibold px-3 py-2 border rounded-xl hover:border-teal hover:bg-teal-light transition-all flex items-center gap-1.5 ${
                        selectedLocation === city ? 'border-teal bg-teal-light text-teal-dark font-bold' : 'border-slate-100 text-slate-600'
                      }`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                      {city.split(',')[0]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-forest-light/40 p-3 rounded-2xl flex items-center gap-2.5 text-xs text-forest">
                <FiActivity className="w-5 h-5 text-teal flex-shrink-0 animate-bounce" />
                <span>Express home samples collection is currently available in these cities.</span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 6. Mobile Slide-in Drawer Menu */}
      <AnimatePresence>
        {showMobileSidebar && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileSidebar(false)}
              className="fixed inset-0 z-50 bg-black bg-opacity-40"
            />
            {/* Sidebar drawer */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 bottom-0 left-0 z-50 w-72 bg-white flex flex-col shadow-premium"
            >
              {/* Header inside drawer */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-forest text-white">
                <Logo showText={true} />
                <button onClick={() => setShowMobileSidebar(false)} className="text-white hover:opacity-85">
                  <FiX className="w-6 h-6" />
                </button>
              </div>

              {/* Profiles details in drawer */}
              <div className="p-4 bg-forest-light/40 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-forest text-white flex items-center justify-center font-bold">
                  {isAuthenticated ? user?.name?.[0]?.toUpperCase() : '?'}
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-800">
                    {isAuthenticated ? `Hi, ${user?.name}` : 'Welcome Guest'}
                  </h4>
                  <p className="text-[10px] text-slate-500">
                    {isAuthenticated ? user?.phone : 'Log in to book tests'}
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-2">
                <button 
                  onClick={() => { navigate('/'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiHome className="text-teal" /> Home
                </button>
                <button 
                  onClick={() => { navigate('/categories'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiActivity className="text-teal" /> Buy Medicines
                </button>
                <button 
                  onClick={() => { navigate('/lab-tests'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiCalendar className="text-teal" /> Diagnostic Lab Tests
                </button>
                <button 
                  onClick={() => { navigate('/doctor-appointments'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiUser className="text-teal" /> Consult Doctors
                </button>
                <button 
                  onClick={() => { navigate('/orders'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiShoppingBag className="text-teal" /> My Orders
                </button>
                <button 
                  onClick={() => { navigate('/profile'); setShowMobileSidebar(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-slate-700 text-sm font-semibold rounded-xl hover:bg-slate-50"
                >
                  <FiUser className="text-teal" /> My Profile
                </button>
              </div>

              {/* Footer action inside drawer */}
              <div className="p-4 border-t border-slate-100">
                {isAuthenticated ? (
                  <button 
                    onClick={handleLogout} 
                    className="w-full py-2 bg-coral text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Log Out
                  </button>
                ) : (
                  <button 
                    onClick={() => { navigate('/login'); setShowMobileSidebar(false); }}
                    className="w-full py-2 bg-forest text-white font-bold text-xs rounded-xl shadow-sm"
                  >
                    Log In / Sign Up
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
