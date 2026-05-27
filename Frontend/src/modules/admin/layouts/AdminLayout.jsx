import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { FiHome, FiUsers, FiPackage, FiShoppingBag, FiLayers } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';

export default function AdminLayout() {
  const { isAuthenticated, adminUser } = useSelector(state => state.adminAuth || { isAuthenticated: false, adminUser: null });
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Automatically monitor viewport width for collapsibility
  useEffect(() => {
    const handleResize = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
      if (isMobileScreen) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Secure Guard: Ensure user has 'admin' role, otherwise redirect to AdminLoginPage
  if (!isAuthenticated || !adminUser || adminUser.role !== 'admin') {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800">
      
      {/* 1. Backdrop Overlay on mobile viewports when sidebar drawer slides in */}
      <AnimatePresence>
        {isMobile && isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-30 bg-black"
          />
        )}
      </AnimatePresence>

      {/* 2. Side Navigation Sidebar */}
      <div className={`shrink-0 z-40 ${isMobile && !isSidebarOpen ? 'pointer-events-none' : ''}`}>
        <Sidebar 
          isOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
      </div>

      {/* 3. Main Dashboard Window */}
      <div className="flex flex-col flex-1 min-w-0 transition-all duration-300"
           style={{ paddingLeft: isMobile ? '0px' : isSidebarOpen ? '256px' : '80px' }}>
        
        {/* Top Header navbar bar */}
        <Navbar 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen} 
        />

        {/* Content canvas window */}
        <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* 4. Sleek bottom bar navigation matching user native-app patterns on Mobile */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around z-30 md:hidden shadow-app-bar px-2">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiHome className="text-xl" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/admin/vendors" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiUsers className="text-xl" />
          <span>Vendors</span>
        </NavLink>
        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiPackage className="text-xl" />
          <span>Catalog</span>
        </NavLink>
        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiShoppingBag className="text-xl" />
          <span>Orders</span>
        </NavLink>
        <NavLink 
          to="/admin/cms" 
          className={({ isActive }) => `flex flex-col items-center gap-1 text-[9px] font-black uppercase tracking-wider ${isActive ? 'text-teal' : 'text-slate-400'}`}
        >
          <FiLayers className="text-xl" />
          <span>CMS</span>
        </NavLink>
      </div>

    </div>
  );
}
