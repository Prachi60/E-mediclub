import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiMapPin, FiCalendar, FiClock, FiTrash2, FiPlus, FiLogOut, FiEdit, FiCheck } from 'react-icons/fi';
import { logout, addAddress, deleteAddress, setDefaultAddress } from '../../auth/store/authSlice';

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux Selectors
  const { user, isAuthenticated, addresses } = useSelector(state => state.auth);
  const { orders, appointments, labBookings } = useSelector(state => state.products);

  // States
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrName, setNewAddrName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrPin, setNewAddrPin] = useState('');
  const [newAddrLine, setNewAddrLine] = useState('');
  const [newAddrCity, setNewAddrCity] = useState('');
  const [newAddrState, setNewAddrState] = useState('');

  // Protect path check
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 pb-10 select-none items-start">
      
      {/* 1. Left profile overview */}
      <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col items-center gap-4 text-center">
        <div className="w-20 h-20 rounded-full bg-forest text-white text-3xl font-extrabold flex items-center justify-center shadow-md">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-800">{user?.name}</h2>
          <p className="text-xs text-slate-400 font-semibold mt-1">Joined E Mediclub on {user?.joinedDate || '2026-05-26'}</p>
        </div>

        {/* Basic phone & email indicators */}
        <div className="w-full flex flex-col gap-2 border-t border-b border-slate-50 py-4 my-2 text-xs font-semibold text-slate-600">
          <div className="flex items-center justify-between">
            <span>Mobile No</span>
            <span className="text-slate-800">+91 {user?.phone}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Email</span>
            <span className="text-slate-800">{user?.email || 'N/A'}</span>
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full py-2.5 bg-coral-light hover:bg-coral-light/80 text-coral font-black text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
        >
          <FiLogOut /> LOG OUT
        </button>
      </div>

      {/* 2. Middle & Right: Address & Timeline logs */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        
        {/* Address section */}
        <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-4">
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
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                  <input
                    type="tel"
                    placeholder="Receiver Phone"
                    required
                    value={newAddrPhone}
                    onChange={(e) => setNewAddrPhone(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Pincode"
                  required
                  value={newAddrPin}
                  onChange={(e) => setNewAddrPin(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
                <input
                  type="text"
                  placeholder="Address Line"
                  required
                  value={newAddrLine}
                  onChange={(e) => setNewAddrLine(e.target.value)}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={newAddrCity}
                    onChange={(e) => setNewAddrCity(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={newAddrState}
                    onChange={(e) => setNewAddrState(e.target.value)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none"
                  />
                </div>
                <button 
                  type="submit"
                  className="py-2 bg-forest hover:bg-forest-dark text-white text-xs font-black rounded-xl shadow-sm"
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
                    className="p-1.5 hover:bg-slate-100 text-slate-350 hover:text-coral rounded-lg"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  {!addr.isDefault && (
                    <button 
                      onClick={() => dispatch(setDefaultAddress(addr.id))}
                      className="p-1.5 hover:bg-slate-100 text-teal hover:underline text-[10px] font-black rounded"
                    >
                      DEFAULT
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Diagnostic and orders status timelines summary */}
        <section className="bg-white p-5 rounded-3xl border border-slate-100 shadow-premium flex flex-col gap-4">
          <h3 className="font-extrabold text-slate-800 text-sm border-b border-slate-50 pb-3">Active Consultation timelines</h3>
          
          <div className="flex flex-col gap-3.5">
            {appointments.slice(0, 2).map((apt) => (
              <div key={apt.id} className="flex justify-between items-center text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <h4 className="font-extrabold text-slate-800">{apt.doctorName}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{apt.specialty} • Confirmed</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-800">{apt.date}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">{apt.timeSlot.split(' ')[0]}</p>
                </div>
              </div>
            ))}

            {appointments.length === 0 && (
              <p className="text-xs text-slate-400 font-bold text-center py-2.5">No upcoming appointments scheduled.</p>
            )}
          </div>
        </section>

      </div>

    </div>
  );
}
