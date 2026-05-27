import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiCalendar, FiClock, FiCheckCircle } from 'react-icons/fi';
import { bookDoctorAppointment } from '../../modules/user/store/productSlice';

export default function DoctorCard({ doctor }) {
  const dispatch = useDispatch();
  const appointments = useSelector(state => state.products.appointments);

  // States
  const [showSlots, setShowSlots] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Check if user already has an appointment booked with this doctor
  const isBooked = appointments.some(apt => apt.doctorName === doctor.name && apt.status === 'Confirmed');

  const mockSlots = [
    '04:00 PM - 04:30 PM',
    '04:30 PM - 05:00 PM',
    '05:00 PM - 05:30 PM',
    '05:30 PM - 06:00 PM'
  ];

  const handleBooking = (slot) => {
    setSelectedSlot(slot);
    dispatch(bookDoctorAppointment({
      id: `APT-${Date.now()}`,
      doctorName: doctor.name,
      specialty: doctor.specialty,
      date: new Date().toISOString().split('T')[0],
      timeSlot: slot,
      type: 'Online Consultation',
      status: 'Confirmed'
    }));

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setShowSlots(false);
    }, 2000);
  };

  return (
    <div
      className="bg-white rounded-3xl p-5 border border-slate-100 hover:border-forest/30 shadow-premium hover:shadow-premium-hover hover:-translate-y-1.5 flex flex-col justify-between relative overflow-hidden select-none transition-all duration-300 group"
    >
      <div>
        {/* Doctor Identity Header */}
        <div className="flex gap-4 items-start">
          <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm bg-slate-100 flex-shrink-0 relative">
            <img
              src={doctor.avatar}
              alt={doctor.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              loading="lazy"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-extrabold text-slate-800">
                {doctor.name}
              </h4>
              {doctor.online && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse block shrink-0" />
              )}
            </div>
            <span className="text-[11px] text-teal font-black uppercase tracking-wider block mt-0.5">
              {doctor.specialty}
            </span>
            <p className="text-[10px] text-slate-400 font-bold block mt-1">
              {doctor.qualification}
            </p>
          </div>
        </div>

        {/* Doctor Quick stats grid */}
        <div className="grid grid-cols-2 gap-2 mt-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-100/50 text-[10px] text-slate-500 font-bold">
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            {doctor.experience}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
            Lang: Hindi, Eng
          </p>
        </div>

        {/* Availability text */}
        <p className="text-[10px] text-teal-dark font-black mt-3 flex items-center gap-1.5">
          <FiClock className="text-teal" />
          {doctor.availability}
        </p>
      </div>

      {/* Pricing and Action Slot */}
      <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Consultation Fee</span>
            <span className="text-lg font-black text-slate-900">₹{doctor.fee}</span>
          </div>

          <div>
            {isBooked ? (
              <span className="bg-emerald-50 text-emerald-600 text-xs font-black px-4 py-2.5 rounded-full flex items-center gap-1">
                <FiCheckCircle className="stroke-[3px]" />
                BOOKED
              </span>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSlots(!showSlots)}
                className="bg-forest hover:bg-forest-dark text-white font-bold text-xs px-5 py-2.5 rounded-full shadow-sm hover:shadow transition-all flex items-center gap-1"
              >
                <FiCalendar className="w-4 h-4" />
                <span>BOOK APPOINTMENT</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Slots panel */}
        <AnimatePresence>
          {showSlots && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden pt-2.5 border-t border-slate-50 flex flex-col gap-2"
            >
              {bookingSuccess ? (
                <div className="bg-emerald-50 text-emerald-600 p-3 rounded-2xl text-xs font-bold text-center flex items-center justify-center gap-2">
                  <FiCheckCircle className="w-5 h-5 animate-bounce" />
                  <span>Appointment Confirmed Instantly!</span>
                </div>
              ) : (
                <>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Select a Time Slot (Today)</p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {mockSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => handleBooking(slot)}
                        className="py-2 bg-slate-50 border border-slate-100 hover:border-teal hover:bg-teal-light rounded-xl text-[10px] font-semibold text-slate-700 text-center transition-all"
                      >
                        {slot.split(' ')[0] + ' ' + slot.split(' ')[1]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
