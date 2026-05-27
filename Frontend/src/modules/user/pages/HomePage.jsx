import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronLeft, FiChevronRight, FiCheckCircle, FiActivity, 
  FiClock, FiTrendingUp, FiBookmark, FiDownload, FiPhoneCall, FiAward 
} from 'react-icons/fi';
import ProductCard from '../../../shared/components/ProductCard';
import LabTestCard from '../../../shared/components/LabTestCard';
import DoctorCard from '../../../shared/components/DoctorCard';
import { setSelectedCategory, setSearchTerm } from '../store/productSlice';

export default function HomePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors from products store
  const { medicines, labTests, doctors } = useSelector(state => state.products);

  // States
  const [currentBanner, setCurrentBanner] = useState(0);

  // Mock Banner Carousel items
  const banners = [
    {
      id: 1,
      title: 'Flat 20% OFF on Medicines',
      subtitle: 'Plus extra 5% cashback on Ayurveda items.',
      code: 'MEDICLUB20',
      bg: 'linear-gradient(135deg, #0A5C36 0%, #0D9488 100%)',
      badge: 'MONSOON SALE'
    },
    {
      id: 2,
      title: 'Full Body Diagnostic Checkups',
      subtitle: 'Complete blood checks with Free Home Sample Collection.',
      code: 'GOLDTEST',
      bg: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
      badge: 'LAB PROMO'
    },
    {
      id: 3,
      title: 'Online Video Consultations',
      subtitle: 'Connect with certified specialists inside 15 minutes.',
      code: 'CONSULT100',
      bg: 'linear-gradient(135deg, #1E293B 0%, #0F766E 100%)',
      badge: 'DOCTOR CARE'
    }
  ];

  // Quick categories configuration
  const quickCategories = [
    { name: 'Medicines', icon: '💊', desc: 'Prescription Drugs', route: '/categories', color: 'bg-emerald-50 text-emerald-600' },
    { name: 'Lab Tests', icon: '🧪', desc: 'Diagnostic Kits', route: '/lab-tests', color: 'bg-teal-50 text-teal-600' },
    { name: 'Doctors', icon: '👨‍⚕️', desc: 'Expert Doctors', route: '/doctor-appointments', color: 'bg-blue-50 text-blue-600' },
    { name: 'Ayurveda', icon: '🌿', desc: 'Natural Herbs', route: '/categories', color: 'bg-amber-50 text-amber-600' },
    { name: 'Wellness', icon: '🧘', desc: 'Fitness & Care', route: '/categories', color: 'bg-rose-50 text-rose-600' },
    { name: 'Devices', icon: '🩸', desc: 'Health Monitors', route: '/categories', color: 'bg-indigo-50 text-indigo-600' }
  ];

  // Promo Coupons
  const coupons = [
    { code: 'MEDICLUB20', desc: 'Flat 20% discount on order above ₹499' },
    { code: 'FREECOLLECT', desc: 'Free diagnostic home sample collection' },
    { code: 'WELCOME100', desc: 'Flat ₹100 OFF on your first purchase' }
  ];

  // Blog articles
  const articles = [
    {
      id: 1,
      title: '5 Herbs to Natural Immunity Strengthening',
      tag: 'AYURVEDA',
      readTime: '4 Min Read',
      summary: 'Explore time-tested wellness practices utilizing Neem, Giloy, Ashwagandha, and Turmeric for immune vigor.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=300&h=200&q=80'
    },
    {
      id: 2,
      title: 'Managing Blood Sugar Levels: Tips & Diet',
      tag: 'DIABETES',
      readTime: '6 Min Read',
      summary: 'A clinical checklist detailing low-glycemic meals, timing guidelines, and activity levels for glucose balance.',
      image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=300&h=200&q=80'
    }
  ];

  // Auto sliding carousel timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleQuickCategoryClick = (cat) => {
    if (cat.route) {
      if (cat.name !== 'Doctors' && cat.name !== 'Lab Tests') {
        dispatch(setSelectedCategory(cat.name));
      }
      navigate(cat.route);
    }
  };

  return (
    <div className="flex flex-col gap-8 md:gap-12 pb-10">
      
      {/* 1. Hero Promo Carousel (Banner) */}
      <section className="relative w-full h-44 sm:h-56 md:h-64 rounded-3xl overflow-hidden shadow-premium">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentBanner}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex flex-col justify-center px-6 sm:px-12 md:px-16 text-white"
            style={{ background: banners[currentBanner].bg }}
          >
            {/* Overlay Grid mimicry */}
            <div className="absolute right-8 bottom-0 top-0 opacity-15 hidden sm:flex items-center text-[120px] font-black pointer-events-none select-none">
              CARE
            </div>

            <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-widest uppercase w-fit shadow-sm">
              {banners[currentBanner].badge}
            </span>
            <h1 className="text-xl sm:text-3xl font-extrabold mt-3 max-w-lg leading-tight">
              {banners[currentBanner].title}
            </h1>
            <p className="text-[11px] sm:text-sm font-semibold opacity-90 mt-1 max-w-md">
              {banners[currentBanner].subtitle}
            </p>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider bg-yellow-400 text-slate-900 px-3.5 py-1.5 rounded-lg">
                CODE: {banners[currentBanner].code}
              </span>
              <button 
                onClick={() => navigate('/categories')} 
                className="bg-white hover:bg-slate-100 text-forest text-[10px] sm:text-xs font-black px-4.5 py-1.5 rounded-lg shadow-sm"
              >
                ORDER NOW
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel indicators */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                currentBanner === index ? 'bg-white w-6' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </section>

      {/* 2. Categories Section Grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <FiActivity className="text-teal" /> Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickCategories.map((cat, idx) => (
            <motion.div
              whileTap={{ scale: 0.96 }}
              key={idx}
              onClick={() => handleQuickCategoryClick(cat)}
              className="bg-white rounded-3xl p-4 border border-slate-100 hover:border-forest/25 shadow-premium hover:shadow-premium-hover hover:-translate-y-1 hover:scale-[1.03] flex flex-col items-center text-center cursor-pointer select-none group transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-3 shadow-inner ${cat.color} group-hover:scale-110 transition-transform duration-300`}>
                {cat.icon}
              </div>
              <h3 className="text-xs font-extrabold text-slate-800 leading-tight group-hover:text-forest transition-colors duration-300">
                {cat.name}
              </h3>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-wide">
                {cat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Promo Banner Section (Coupon Banner Strip) */}
      <section className="bg-forest-light/60 border border-forest/10 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎟️</div>
          <div>
            <h4 className="text-sm font-black text-forest-dark">Flat ₹100 Off on Lab Tests</h4>
            <p className="text-xs text-slate-500 font-semibold">Book any premium full body checkup package above ₹999.</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="border-2 border-dashed border-forest/30 bg-white text-forest text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl">
            WELCOME100
          </span>
          <button 
            onClick={() => navigate('/lab-tests')} 
            className="bg-forest hover:bg-forest-dark text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Apply Code
          </button>
        </div>
      </section>

      {/* 4. Popular Medicines Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FiTrendingUp className="text-teal" /> Trending Medicines
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Most bought healthcare and daily wellness essentials</p>
          </div>
          <button 
            onClick={() => { dispatch(setSelectedCategory('Medicines')); navigate('/categories'); }} 
            className="text-xs font-black text-teal hover:underline"
          >
            SEE ALL
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {medicines.slice(0, 8).map((med) => (
            <ProductCard key={med.id} product={med} />
          ))}
        </div>
      </section>

      {/* 5. Diagnostic Lab Packages Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              🧪 Diagnostic Health Packages
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Certified clinical labs. Accurate reports straight to email.</p>
          </div>
          <button 
            onClick={() => navigate('/lab-tests')} 
            className="text-xs font-black text-teal hover:underline"
          >
            SEE ALL TESTS
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {labTests.map((test) => (
            <LabTestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

      {/* 6. Doctor Consultation Cards Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              👨‍⚕️ Verified Doctor Appointments
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Consultations via HD video or clinic visitation.</p>
          </div>
          <button 
            onClick={() => navigate('/doctor-appointments')} 
            className="text-xs font-black text-teal hover:underline"
          >
            FIND DOCTORS
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {doctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))}
        </div>
      </section>

      {/* 7. Health Tips / Blogs Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <FiBookmark className="text-teal" /> Health Tips & Wellness Articles
            </h2>
            <p className="text-xs text-slate-400 font-semibold">Read medical advice curated by senior clinical doctors</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {articles.map((art) => (
            <div key={art.id} className="bg-white rounded-3xl p-4 border border-slate-100 shadow-premium flex items-center gap-4 select-none">
              <img
                src={art.image}
                alt={art.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0 bg-slate-50"
              />
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-[9px] font-black text-teal">
                  <span>{art.tag}</span>
                  <span className="text-slate-400">{art.readTime}</span>
                </div>
                <h3 className="text-sm font-extrabold text-slate-800 line-clamp-2 leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {art.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Trust Certifications & Bottom Footer (Tata 1mg resemblance) */}
      <footer className="mt-12 bg-[#0E1012] border border-slate-900 shadow-premium rounded-3xl p-6 sm:p-10 md:p-12 flex flex-col gap-8 text-slate-400 text-xs font-semibold select-none animate-fade-in">
        
        {/* Upper footer features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
            <FiCheckCircle className="w-6 h-6 text-teal mb-2" />
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">100% Genuine</h5>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Sourced from certified clinical partners.</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
            <FiClock className="w-6 h-6 text-teal mb-2" />
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">Express Delivery</h5>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Medicines delivered inside 4-6 hours.</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
            <FiAward className="w-6 h-6 text-teal mb-2" />
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">FDA Certified</h5>
            <p className="text-[10px] text-slate-400 font-bold mt-1">Strict clinical pharmacy controls.</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-slate-900/40 border border-slate-800/60 rounded-2xl shadow-inner select-none transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60">
            <FiPhoneCall className="w-6 h-6 text-teal mb-2" />
            <h5 className="font-extrabold text-white text-[11px] uppercase tracking-wide">Expert Support</h5>
            <p className="text-[10px] text-slate-400 font-bold mt-1">24/7 dedicated pharmacy consultation help.</p>
          </div>
        </div>

        {/* Brand details and links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-4">
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">About Mediclub</h5>
            <a href="#about" className="text-slate-400 hover:text-white transition-colors">Who We Are</a>
            <a href="#careers" className="text-slate-400 hover:text-white transition-colors">Careers</a>
            <a href="#press" className="text-slate-400 hover:text-white transition-colors">Press Releases</a>
            <a href="#blog" className="text-slate-400 hover:text-white transition-colors">Healthy Life Blog</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Our Policies</h5>
            <a href="#privacy" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</a>
            <a href="#editorial" className="text-slate-400 hover:text-white transition-colors">Editorial Policy</a>
            <a href="#security" className="text-slate-400 hover:text-white transition-colors">Vulnerability Disclosure</a>
          </div>
          <div className="flex flex-col gap-2.5">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Customer Support</h5>
            <a href="#contact" className="text-slate-400 hover:text-white transition-colors">Contact Helpdesk</a>
            <a href="#faq" className="text-slate-400 hover:text-white transition-colors">Fulfillment FAQs</a>
            <a href="#return" className="text-slate-400 hover:text-white transition-colors">Medicine Return Policy</a>
            <a href="#refund" className="text-slate-400 hover:text-white transition-colors">Refund Status Tracker</a>
          </div>
          <div className="flex flex-col gap-3">
            <h5 className="text-[10px] font-black text-white uppercase tracking-widest">Download Our Mobile App</h5>
            <p className="text-[10px] text-slate-400 font-bold leading-snug">Get exclusive health tip blogs and 20% discount coupon banners instantly inside the app.</p>
            <div className="flex flex-col gap-2.5">
              {/* Google Play Store Pill Button */}
              <button className="flex items-center gap-3 bg-[#111314] text-white px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-teal/30 hover:bg-slate-950 hover:scale-[1.03] hover:shadow-premium-hover transition-all duration-300 select-none group text-left cursor-pointer w-full max-w-[175px]">
                <svg className="w-5.5 h-5.5 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.25 2.5C3.08 2.66 3 2.92 3 3.25V20.75C3 21.08 3.08 21.34 3.25 21.5L3.34 21.58L12.56 12.36V11.64L3.34 2.42L3.25 2.5Z" fill="url(#gp_a)" />
                  <path d="M15.63 15.43L12.56 12.36V11.64L15.63 8.57L15.71 8.62L19.35 10.69C20.39 11.28 20.39 12.24 19.35 12.83L15.71 14.9L15.63 15.43Z" fill="url(#gp_b)" />
                  <path d="M15.71 14.9L12.56 11.75L3.25 21.06C3.59 21.42 4.14 21.44 4.77 21.08L15.71 14.9Z" fill="url(#gp_c)" />
                  <path d="M15.71 8.62L4.77 2.42C4.14 2.06 3.59 2.08 3.25 2.44L12.56 11.75L15.71 8.62Z" fill="url(#gp_d)" />
                  <defs>
                    <linearGradient id="gp_a" x1="11.45" y1="21.11" x2="3" y2="12.66" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#00A0FF" />
                      <stop offset="0.007" stopColor="#00A0FF" />
                      <stop offset="1" stopColor="#00EAFF" />
                    </linearGradient>
                    <linearGradient id="gp_b" x1="20.38" y1="12.36" x2="13.2" y2="12.36" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#FFC700" />
                      <stop offset="1" stopColor="#FFEB00" />
                    </linearGradient>
                    <linearGradient id="gp_c" x1="12.44" y1="12.44" x2="5.19" y2="19.69" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#FF2A00" />
                      <stop offset="1" stopColor="#FF007A" />
                    </linearGradient>
                    <linearGradient id="gp_d" x1="5.19" y1="5.03" x2="12.44" y2="12.28" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#37A600" />
                      <stop offset="1" stopColor="#10BA00" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">GET IT ON</span>
                  <span className="text-[12px] text-white font-bold block mt-0.5 font-sans">Google Play</span>
                </div>
              </button>

              {/* Apple App Store Pill Button */}
              <button className="flex items-center gap-3 bg-[#111314] text-white px-3.5 py-1.5 rounded-xl border border-slate-800 hover:border-teal/30 hover:bg-slate-950 hover:scale-[1.03] hover:shadow-premium-hover transition-all duration-300 select-none group text-left cursor-pointer w-full max-w-[175px]">
                <svg className="w-5.5 h-5.5 fill-white shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.21.67-2.93 1.49-.62.69-1.16 1.84-1.01 2.96 1.12.09 2.27-.57 2.95-1.39z" />
                </svg>
                <div className="text-left leading-tight">
                  <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Download on the</span>
                  <span className="text-[12px] text-white font-bold block mt-0.5 font-sans">App Store</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Final Copyright */}
        <div className="border-t border-slate-800 pt-6 text-center text-[10px] text-slate-500 font-bold">
          <p>© 2026 E Mediclub India Inc. All rights reserved. Registered Clinical E-Pharmacy Lic. No. DL-392819-A.</p>
        </div>
      </footer>

    </div>
  );
}
