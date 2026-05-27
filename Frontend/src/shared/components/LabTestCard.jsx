import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheck, FiInfo } from 'react-icons/fi';
import { addToCart, removeFromCart } from '../../modules/user/store/cartSlice';

export default function LabTestCard({ test }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);

  // Find if this lab test is already in the cart
  const isBooked = cartItems.some(item => item.id === test.id && item.type === 'labtest');

  const handleBookingToggle = (e) => {
    e.stopPropagation();
    if (isBooked) {
      dispatch(removeFromCart({ id: test.id, type: 'labtest' }));
    } else {
      dispatch(addToCart({
        id: test.id,
        name: test.name,
        type: 'labtest',
        price: test.price,
        discountPrice: test.discountPrice,
        image: 'https://images.unsplash.com/photo-1579154261294-88752594e687?auto=format&fit=crop&w=150&h=150&q=80', // standard medical laboratory image
        subtitle: test.parameters,
        details: test.timeframe
      }));
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl p-5 border shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 flex flex-col justify-between select-none relative overflow-hidden transition-all duration-300 group ${
        isBooked ? 'border-teal/50 bg-teal-light/20' : 'border-slate-100 hover:border-teal/30'
      }`}
    >
      {/* Test Specialty Tag */}
      {test.tag && (
        <span className="absolute top-0 right-0 bg-teal text-white text-[9px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-2xl shadow-sm">
          {test.tag}
        </span>
      )}

      <div>
        {/* Title */}
        <h4 className="text-base font-extrabold text-slate-800 leading-snug line-clamp-2 max-w-[90%]">
          {test.name}
        </h4>

        {/* Parameter count */}
        <span className="text-[11px] text-teal font-black uppercase tracking-wider block mt-1.5">
          {test.parameters}
        </span>

        {/* Report Delivery and Fasting Rules */}
        <div className="flex flex-col gap-1.5 mt-3.5 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50">
          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            {test.timeframe}
          </p>
          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            {test.fastingRequired}
          </p>
        </div>
      </div>

      {/* Pricing and Action row */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex flex-col">
          {test.discountPrice ? (
            <>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400 line-through font-semibold leading-none">
                  ₹{test.price}
                </span>
                <span className="text-[10px] text-coral font-black bg-coral-light px-1.5 py-0.5 rounded">
                  {test.discountPercent}% OFF
                </span>
              </div>
              <span className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                ₹{test.discountPrice}
              </span>
            </>
          ) : (
            <span className="text-lg font-black text-slate-900">
              ₹{test.price}
            </span>
          )}
          {test.homeCollection && (
            <span className="text-[9px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md font-bold mt-1 inline-block w-fit">
              FREE HOME COLLECTION
            </span>
          )}
        </div>

        <div>
          {isBooked ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBookingToggle}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-full shadow-sm flex items-center gap-1"
            >
              <FiCheck className="w-4 h-4 stroke-[3px]" />
              <span>ADDED</span>
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleBookingToggle}
              className="bg-forest hover:bg-forest-dark text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1"
            >
              <FiCalendar className="w-4 h-4" />
              <span>BOOK TEST</span>
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
