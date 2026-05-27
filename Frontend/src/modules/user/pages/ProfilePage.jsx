import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiMapPin, FiCalendar, FiClock, FiTrash2, FiPlus, 
  FiLogOut, FiEdit, FiCheck, FiShield, FiHeart, FiFileText, FiActivity 
} from 'react-icons/fi';
import { logout, addAddress, deleteAddress, setDefaultAddress } from '../../auth/store/authSlice';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { user, isAuthenticated, addresses } = useSelector(state => state.auth);
  const { appointments, labBookings = [] } = useSelector(state => state.products);

  // States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'past'

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    const newAddressObj = {
      name: newAddrName,
      phone: newAddrPhone,
      pincode: newAddrPin,
      addressLine: newAddrLine,
      city: newAddrCity,
      state: newAddrState,
      isDefault: addresses.length === 0
    };
    dispatch(addAddress(newAddressObj));
    setShowAddressForm(false);
    // Reset inputs
    setNewAddrName('');
    setNewAddrPhone('');
    setNewAddrPin('');
    setNewAddrLine('');
    setNewAddrCity('');
    setNewAddrState('');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  // 1. GUEST/UNAUTHENTICATED GUEST PROMPT VIEW
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-6 py-12 text-center select-none flex flex-col items-center gap-6 bg-white border border-slate-100 shadow-premium rounded-[32px] animate-fade-in relative overflow-hidden mt-8">
        {/* Glow circles */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-teal-light rounded-full filter blur-2xl opacity-60" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-forest-light rounded-full filter blur-2xl opacity-60" />
        
        <div className="w-16 h-16 rounded-3xl bg-forest-light/35 text-forest text-3xl flex items-center justify-center shrink-0">
          👤
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-800 uppercase tracking-wide">My Active Health Profile</h2>
          <p className="text-xs text-slate-400 font-semibold mt-2.5 leading-relaxed">
            Please log in or register to access your personal address book, order tracking dashboard, and doctor consultation calendars.
          </p>
        </div>
        <div className="flex flex-col gap-3 w-full border-t border-slate-50 pt-5 mt-1">
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all duration-200 tap-scale cursor-pointer"
          >
            Login to Profile
          </button>
          <button 
            onClick={() => navigate('/login')}
            className="w-full py-3.5 border border-forest hover:bg-forest-light text-forest text-xs font-black uppercase tracking-wider rounded-2xl transition-all duration-200 tap-scale cursor-pointer"
          >
            Create New Account
          </button>
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
          <FiShield className="text-teal" /> Dual-Factor Security Shield Enabled
        </div>
      </div>
    );
  }

  // Filter appointments for dual-tabbing
  const upcomingAppointments = appointments.filter(apt => apt.status === 'Scheduled' || apt.status === 'Confirmed');
  const pastAppointments = appointments.filter(apt => apt.status === 'Completed' || apt.status === 'Cancelled');

  const selectedAppointmentsList = activeTab === 'upcoming' ? upcomingAppointments : pastAppointments;
  const firstName = user?.name === 'Super Admin' ? 'User' : (user?.name ? user.name.split(' ')[0] : 'User');
  const displayName = user?.name === 'Super Admin' ? 'User' : (user?.name || 'User');
  const displayEmail = user?.email === 'admin@emediclub.com' ? 'user@emediclub.com' : (user?.email || 'N/A');
  const displayAvatarLetter = user?.name === 'Super Admin' ? 'U' : (user?.name?.[0]?.toUpperCase() || 'U');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-10 select-none items-start">
      
      {/* 2. Left profile overview details */}
      <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-premium flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-forest text-white text-3xl font-extrabold flex items-center justify-center shadow-md">
          {displayAvatarLetter}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800">Hi, {firstName}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Joined E Mediclub on {user?.joinedDate || '2026-05-26'}</p>
        </div>

        {/* Basic phone & email indicators */}
        <div className="w-full flex flex-col gap-2 border-t border-b border-slate-50 py-4 my-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center justify-between">
            <span>Full Name</span>
            <span className="text-slate-800 font-bold">{displayName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Mobile No</span>
            <span className="text-slate-800 font-bold">+91 {user?.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Email Address</span>
            <span className="text-slate-800 font-bold">{displayEmail}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-3 bg-coral-light hover:bg-coral-light/80 text-coral font-black text-xs rounded-2xl shadow-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer tap-scale"
        >
          <FiLogOut /> LOG OUT
        </button>
      </div>

      {/* 3. Middle & Right: Address & Appointments timelines logs */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Address section */}
        <section className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-premium flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <FiMapPin className="text-teal" /> Address Book
            </h3>
            <button 
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="text-xs font-black text-teal hover:underline flex items-center gap-1"
            >
              <FiPlus /> ADD NEW
            </button>
          </div>

          {/* Address form drawer */}
          <AnimatePresence>
            {showAddressForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                onSubmit={handleAddNewAddress}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 shadow-inner flex flex-col gap-3"
              >
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Receiver Name"
                    required
                    value={newAddrName}
                    onChange={(e) => setNewAddrName(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Receiver Phone"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={newAddrPin}
                  onChange={(e) => setNewAddrPin(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
                <input
                  type="text"
                  placeholder="Address Line"
                  required
                  value={newAddrLine}
                  onChange={(e) => setNewAddrLine(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="py-3 bg-forest hover:bg-forest-dark text-white text-xs font-black rounded-xl shadow-sm cursor-pointer"
                >
                  SAVE ADDRESS
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List existing addresses */}
          <div className="flex flex-col gap-3">
            {addresses.map((addr) => (
              <div 
                key={addr.id}
                className={`p-4 bg-slate-50 border rounded-2xl flex items-start justify-between gap-3 text-xs ${
                  addr.isDefault ? 'border-teal/30 bg-teal-light/10' : 'border-slate-100'
                }`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-800">{addr.name}</h4>
                    {addr.isDefault && (
                      <span className="text-[8px] font-black uppercase bg-teal text-white px-2 py-0.5 rounded">
                        DEFAULT
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 font-semibold mt-1">{addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-[9.5px] text-slate-400 font-bold mt-1">PHONE: +91 {addr.phone}</p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <button 
                    onClick={() => dispatch(deleteAddress(addr.id))}
                    className="p-1.5 hover:bg-slate-100 text-slate-350 hover:text-coral rounded-lg cursor-pointer"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => dispatch(setDefaultAddress(addr.id))}
                      className="p-1.5 hover:bg-slate-100 text-teal hover:underline text-[10px] font-black rounded cursor-pointer"
                    >
                      DEFAULT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. DOCTOR APPOINTMENTS SECTION */}
        <section className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-premium flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <FiCalendar className="text-teal" /> My Appointments
            </h3>
            
            {/* Appointment category switcher tabs */}
            <div className="flex bg-slate-50 border border-slate-100 rounded-xl p-1 shrink-0 self-start sm:self-auto select-none">
              <button
                onClick={() => setActiveTab('upcoming')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'upcoming' 
                    ? 'bg-forest text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Upcoming ({upcomingAppointments.length})
              </button>
              <button
                onClick={() => setActiveTab('past')}
                className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                  activeTab === 'past' 
                    ? 'bg-forest text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Past ({pastAppointments.length})
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3.5">
            {selectedAppointmentsList.length > 0 ? (
              selectedAppointmentsList.map((apt) => (
                <div 
                  key={apt.id} 
                  className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col gap-3 transition-all hover:bg-slate-50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>👨‍⚕️</span> {apt.doctorName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                        {apt.specialty} • Reference: <strong className="text-slate-600 select-all font-extrabold">{apt.id}</strong>
                      </p>
                    </div>

                    <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 tracking-wider ${
                      apt.status === 'Completed' || apt.status === 'Confirmed' || apt.status === 'Scheduled'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : apt.status === 'Cancelled'
                        ? 'bg-rose-50 text-rose-600 border border-rose-100'
                        : 'bg-teal-light text-teal border border-teal/10'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-teal" />
                        <span className="text-slate-800">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-teal" />
                        <span className="text-slate-800">{apt.timeSlot.split(' ')[0]}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] bg-slate-100/60 border border-slate-200/40 text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg">
                      {apt.type === 'Online Consultation' ? '📹 Online' : '🏥 In-Clinic'}
                    </div>
                  </div>

                  {apt.patientName && (
                    <div className="bg-white/65 border border-slate-100 p-2.5 rounded-xl text-[10px] text-slate-500 font-medium">
                      Patient: <strong className="text-slate-700 font-bold">{apt.patientName} (Age: {apt.patientAge})</strong>
                      {apt.notes && <p className="mt-1 leading-normal italic text-slate-400">"{apt.notes}"</p>}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 font-bold flex flex-col items-center gap-1.5">
                <span className="text-3xl">🗓️</span>
                <p className="text-xs uppercase tracking-wide">You have no appointments yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* 5. LAB TEST BOOKINGS SECTION */}
        <section className="bg-white p-5 md:p-6 rounded-[32px] border border-slate-100 shadow-premium flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
              <FiActivity className="text-teal" /> Lab Test Bookings
            </h3>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {labBookings.length} Bookings
            </span>
          </div>

          <div className="flex flex-col gap-3.5">
            {labBookings.length > 0 ? (
              labBookings.map((booking) => (
                <div 
                  key={booking.id} 
                  className="bg-slate-50/50 p-4 border border-slate-100 rounded-2xl flex flex-col gap-3 transition-all hover:bg-slate-50"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5">
                        <span>🔬</span> {booking.packageName}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-wide">
                        Reference: <strong className="text-slate-600 select-all font-extrabold">{booking.id}</strong>
                      </p>
                    </div>

                    <span className={`text-[8px] font-black uppercase px-2.5 py-1 rounded-full shrink-0 tracking-wider ${
                      booking.status === 'Submitted for Verification'
                        ? 'bg-amber-50 text-amber-705 border border-amber-100'
                        : booking.status === 'Scheduled' || booking.status === 'Confirmed'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[10px] font-semibold text-slate-500">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="text-teal" />
                        <span className="text-slate-800">{booking.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-teal" />
                        <span className="text-slate-800">{booking.timeSlot.split(' ')[0]}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/65 border border-slate-100 p-2.5 rounded-xl text-[10px] text-slate-500 flex flex-col gap-1">
                    <div>
                      Patient: <strong className="text-slate-700 font-bold">{booking.patientName} (Age: {booking.patientAge}, {booking.patientGender})</strong>
                    </div>
                    <div>
                      Phone: <strong className="text-slate-700 font-bold">{booking.patientPhone}</strong>
                    </div>
                    <div>
                      Collection: <strong className="text-slate-750 font-bold">{booking.address}</strong>
                    </div>
                    {booking.doctorName && (
                      <div className="border-t border-slate-50 pt-1 mt-1 text-[9px] text-slate-400">
                        Referring Doctor: <span className="font-bold text-slate-500">{booking.doctorName} (Reg: {booking.doctorRegNo})</span>
                        {booking.hasPrescription && <span className="ml-2 text-teal font-black uppercase text-[8px]">✓ Prescription Uploaded</span>}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 font-bold flex flex-col items-center gap-1.5">
                <span className="text-3xl">🔬</span>
                <p className="text-xs uppercase tracking-wide">You have no lab bookings yet.</p>
              </div>
            )}
          </div>
        </section>


      </div>

    </div>
  );
}
