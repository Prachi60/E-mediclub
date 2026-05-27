import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../../auth/admin/store/adminAuthSlice';
import Logo from '../../../shared/components/Logo';
import { 
  FiGrid, FiUsers, FiPackage, FiShoppingBag, 
  FiUserCheck, FiActivity, FiLayers, FiSettings, 
  FiLogOut, FiHome, FiArrowLeft
} from 'react-icons/fi';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Vendors', path: '/admin/vendors', icon: FiUsers },
    { name: 'Medicines', path: '/admin/products', icon: FiPackage },
    { name: 'Orders', path: '/admin/orders', icon: FiShoppingBag },
    { name: 'Customers', path: '/admin/users', icon: FiUserCheck },
    { name: 'Doctors', path: '/admin/doctors', icon: FiActivity },
    { name: 'Lab Tests', path: '/admin/lab-tests', icon: FiActivity },
    { name: 'Offers & CMS', path: '/admin/cms', icon: FiLayers },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate('/admin/login');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
        isOpen ? 'w-64 translate-x-0' : 'w-20 md:translate-x-0 -translate-x-full'
      } bg-white border-r border-slate-100 shadow-premium flex flex-col justify-between`}
    >
      {/* Sidebar Header with Brand */}
      <div>
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
          <div className="overflow-hidden">
            <Logo showText={isOpen} />
          </div>
          {/* Quick back arrow on mobile or toggle helper */}
          <button 
            onClick={toggleSidebar} 
            className="hidden md:flex p-1.5 rounded-xl hover:bg-slate-50 text-slate-400 hover:text-teal transition-colors"
          >
            <FiArrowLeft className={`transition-transform duration-300 ${!isOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Navigation Items list */}
        <nav className="p-3.5 flex flex-col gap-1.5 overflow-y-auto no-scrollbar max-h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider uppercase transition-all duration-200 tap-scale
                  ${isActive 
                    ? 'bg-forest/10 text-forest shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50/80 hover:text-slate-800'
                  }
                `}
              >
                <Icon className="text-lg shrink-0" />
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer with system return & logout */}
      <div className="p-3.5 border-t border-slate-50 flex flex-col gap-1.5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3 w-full rounded-2xl text-xs font-black tracking-wider uppercase text-coral hover:bg-coral-light/60 transition-all text-left tap-scale cursor-pointer"
        >
          <FiLogOut className="text-lg shrink-0" />
          {isOpen && <span>Log Out</span>}
        </button>
      </div>
    </aside>
  );
}
