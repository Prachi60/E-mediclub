import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiArrowLeft, FiCalendar, FiCheckCircle, FiClock, FiFileText, 
  FiUploadCloud, FiTrash2, FiShield, FiUser, FiInfo, FiActivity
} from 'react-icons/fi';
import { bookLabPackage } from '../store/productSlice';

export default function LabTestBookingPage() {
  const { testId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Selectors
  const { labTests } = useSelector(state => state.products);
  const test = labTests.find(t => t.id === testId);

  // Form states
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('');
  
  // Referring Doctor states (Optional)
  const [doctorName, setDoctorName] = useState('');
  const [doctorRegNo, setDoctorRegNo] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);

  // UI Flow States
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');
  const [validationError, setValidationError] = useState('');

  const timeSlots = [
    '06:00 AM - 09:00 AM (Early Bird)',
    '09:00 AM - 12:00 PM (Morning Slot)',
    '12:00 PM - 03:00 PM (Afternoon Slot)',
    '03:00 PM - 06:00 PM (Evening Slot)'
  ];

  if (!test) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <FiActivity className="text-coral text-5xl mb-4 animate-pulse" />
        <h2 className="text-base font-extrabold text-slate-800">Lab Test Profile Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold mt-2">The requested diagnostic package could not be retrieved.</p>
        <button 
          onClick={() => navigate('/lab-tests')}
          className="mt-5 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm"
        >
          Return to Lab Catalog
        </button>
      </div>
    );
  }

  // Handle mock file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPrescriptionFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setPrescriptionFile(null);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!patientName.trim()) {
      setValidationError('Patient Full Name is required.');
      return;
    }
    if (!patientAge || isNaN(patientAge) || parseInt(patientAge) <= 0) {
      setValidationError('Please enter a valid Patient Age.');
      return;
    }
    if (!patientPhone.trim()) {
      setValidationError('Phone Number is required for confirmation.');
      return;
    }
    if (test.homeCollection && !collectionAddress.trim()) {
      setValidationError('Home collection address is required.');
      return;
    }
    if (!preferredDate) {
      setValidationError('Please select a preferred date for the test.');
      return;
    }
    if (!preferredTimeSlot) {
      setValidationError('Please select a preferred time slot.');
      return;
    }

    const bookingRef = `LBB-${Date.now().toString().slice(-5)}`;
    setGeneratedRefId(bookingRef);

    const newBooking = {
      id: bookingRef,
      testId: test.id,
      packageName: test.name,
      patientName: patientName.trim(),
      patientAge: parseInt(patientAge),
      patientGender: patientGender,
      patientPhone: patientPhone.trim(),
      address: test.homeCollection ? collectionAddress.trim() : 'Walk-in Diagnostic Center',
      date: preferredDate,
      timeSlot: preferredTimeSlot,
      doctorName: doctorName.trim() || 'Self / General Wellness',
      doctorRegNo: doctorRegNo.trim() || 'N/A',
      hasPrescription: !!prescriptionFile,
      prescriptionFileName: prescriptionFile ? prescriptionFile.name : null,
      status: 'Submitted for Verification'
    };

    dispatch(bookLabPackage(newBooking));
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/lab-tests')}
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-450 hover:text-teal transition-colors mb-5 uppercase tracking-wider bg-transparent border-0 cursor-pointer"
      >
        <FiArrowLeft /> Back to Lab Tests
      </button>

      <AnimatePresence mode="wait">
        {!bookingSuccess ? (
          <motion.div
            key="booking-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-white rounded-[32px] p-6 md:p-8 border border-slate-100 shadow-premium"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
              <div>
                <span className="text-[10px] text-teal font-black uppercase tracking-wider">DIAGNOSTIC TEST BOOKING</span>
                <h2 className="text-base md:text-lg font-black text-slate-800 leading-tight mt-1">{test.name}</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="text-[10px] text-teal bg-teal-light/20 px-2 py-0.5 rounded font-black uppercase tracking-wider">{test.parameters}</span>
                  <span className="text-[10px] text-slate-500 font-bold">{test.timeframe}</span>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-right sm:self-auto self-start shrink-0">
                <span className="text-[9px] text-slate-450 font-bold uppercase block">Special Price</span>
                <span className="text-base font-black text-slate-800">₹{test.discountPrice || test.price}</span>
              </div>
            </div>

            {/* Form Validation Errors */}
            {validationError && (
              <div className="mb-5 bg-coral-light/35 border border-coral/15 text-coral text-xs font-semibold p-4 rounded-2xl flex items-center gap-2 select-none">
                <span>⚠️</span> {validationError}
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-6">
              
              {/* Form Section 1: Patient Details */}
              <div>
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiUser className="text-teal" /> Patient Information
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Full Name *</label>
                    <input 
                      type="text"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-350"
                      required
                    />
                  </div>

                  {/* Age */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Age (Years) *</label>
                    <input 
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 28"
                      min="1"
                      max="120"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-350"
                      required
                    />
                  </div>

                  {/* Gender */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Gender *</label>
                    <select 
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Contact Phone */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Contact Phone *</label>
                    <input 
                      type="tel"
                      value={patientPhone}
                      onChange={(e) => setPatientPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-350"
                      required
                    />
                  </div>
                </div>

                {/* Home Collection Address (Conditional) */}
                {test.homeCollection && (
                  <div className="flex flex-col gap-1.5 mt-4">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Home Collection Address *</label>
                    <textarea 
                      rows="2"
                      value={collectionAddress}
                      onChange={(e) => setCollectionAddress(e.target.value)}
                      placeholder="Enter full flat number, street name, pincode and city"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all resize-none placeholder:text-slate-350"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Form Section 2: Referring Doctor (Optional) */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiFileText className="text-teal" /> Referring Physician & Medical Prescription (Optional)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Doctor Name */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Doctor Name</label>
                    <input 
                      type="text"
                      value={doctorName}
                      onChange={(e) => setDoctorName(e.target.value)}
                      placeholder="e.g. Dr. A. K. Sen"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-350"
                    />
                  </div>

                  {/* Registration No */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Doctor Reg No</label>
                    <input 
                      type="text"
                      value={doctorRegNo}
                      onChange={(e) => setDoctorRegNo(e.target.value)}
                      placeholder="e.g. REG-893719"
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all placeholder:text-slate-350"
                    />
                  </div>
                </div>

                {/* Optional Prescription File Attachment */}
                <div className="mt-4">
                  <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider block mb-1.5">Upload Prescription</label>
                  {!prescriptionFile ? (
                    <div className="relative border border-dashed border-slate-200 rounded-2xl p-5 bg-slate-50/50 hover:bg-slate-55 flex flex-col items-center justify-center text-center transition-all group">
                      <input 
                        type="file" 
                        accept="image/*,.pdf" 
                        onChange={handleFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <FiUploadCloud className="text-slate-400 text-2xl group-hover:text-teal transition-colors mb-2" />
                      <span className="text-[11px] text-slate-650 font-black">Choose file or drag & drop</span>
                      <span className="text-[9px] text-slate-400 font-semibold mt-0.5">PDF, PNG, JPG up to 10MB</span>
                    </div>
                  ) : (
                    <div className="border border-teal/15 bg-teal-light/10 p-4 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl">📄</span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700 truncate">{prescriptionFile.name}</p>
                          <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{(prescriptionFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={handleRemoveFile}
                        className="w-8 h-8 rounded-xl bg-coral-light/20 hover:bg-coral-light/40 text-coral flex items-center justify-center border-0 cursor-pointer transition-colors"
                      >
                        <FiTrash2 className="text-sm shrink-0" />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Form Section 3: Schedule Details & VIEW RULES */}
              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between gap-4 mb-3">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FiCalendar className="text-teal" /> Collection Schedule
                  </h3>
                  {/* VIEW RULES button */}
                  <button 
                    type="button"
                    onClick={() => setShowRulesModal(true)}
                    className="flex items-center gap-1 text-[10px] font-black text-teal hover:text-teal-dark border-0 bg-transparent cursor-pointer uppercase tracking-wider transition-colors"
                  >
                    <FiInfo className="text-xs shrink-0" /> View Rules
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Preferred Date */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Preferred Date *</label>
                    <input 
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                      required
                    />
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] text-slate-450 font-black uppercase tracking-wider">Preferred Time Slot *</label>
                    <select 
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="px-4 py-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 focus:bg-white focus:ring-1 focus:ring-teal/30 focus:border-teal/30 outline-none text-xs font-bold text-slate-800 transition-all cursor-pointer"
                      required
                    >
                      <option value="" disabled>Select collection time slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot} value={slot}>{slot}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Bottom security strip & Submit action */}
              <div className="border-t border-slate-100 pt-5 mt-3 flex flex-col gap-4">
                <div className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-100/50">
                  <FiShield className="text-teal text-base shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase tracking-wider">E Mediclub Safe Lab Promise</h5>
                    <p className="text-[9px] text-slate-450 font-semibold mt-0.5 leading-snug">Certified clinical technicians, 100% sterile vacuum containers, temperature-controlled sample transfers, and verified reports compiled by experienced MD Pathologists.</p>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer shrink-0"
                >
                  Confirm Lab Test Booking (₹{test.discountPrice || test.price})
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* Confirmation Screen */
          <motion.div
            key="booking-confirmation"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-premium text-center select-none"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-5 shadow-sm animate-bounce">
              <FiCheckCircle className="stroke-[2.5px]" />
            </div>

            <h2 className="text-lg font-black text-slate-800 leading-tight">Booking Submitted Successfully!</h2>
            <p className="text-xs text-slate-500 font-bold mt-2 max-w-md mx-auto">
              Your lab test booking is submitted for verification. Our lab team will confirm within 2 hours.
            </p>

            {/* Reference Box */}
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 my-6 max-w-sm mx-auto text-left flex flex-col gap-3">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-[9px] text-slate-450 font-black uppercase">Booking Reference</span>
                <span className="text-xs font-black text-forest">{generatedRefId}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Patient Name:</span>
                <span className="text-slate-700 font-extrabold truncate max-w-[180px]">{patientName}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Selected Test:</span>
                <span className="text-slate-700 font-extrabold truncate max-w-[180px]">{test.name}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Schedule Slot:</span>
                <span className="text-slate-700 font-extrabold">{preferredDate} • {preferredTimeSlot.split(' ')[0]}</span>
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-bold">Current Status:</span>
                <span className="text-[9px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-black uppercase tracking-wide">Pending verification</span>
              </div>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
              <button 
                onClick={() => navigate('/profile')}
                className="flex-1 py-3 px-5 bg-teal hover:bg-teal-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
              >
                Go to Profile Panel
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer border-0"
              >
                Back to Home
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW RULES MODAL */}
      <AnimatePresence>
        {showRulesModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Modal backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Body */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-6 md:p-7 border border-slate-100 shadow-premium z-10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              <div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Important Instructions Before Your Test</h3>
                <p className="text-[10px] text-slate-400 font-bold mt-0.5">Please review these clinical guidelines to ensure highly accurate results.</p>
              </div>

              {/* Fasting rule callout */}
              <div className="bg-amber-50/70 border border-amber-100 p-4 rounded-2xl flex items-start gap-2.5">
                <span className="text-lg">🕒</span>
                <div>
                  <h4 className="text-[10px] text-amber-805 font-extrabold uppercase tracking-wide">Fasting Guideline</h4>
                  <p className="text-[10px] text-slate-600 font-bold mt-0.5">{test.fastingRequired}</p>
                  <p className="text-[9px] text-slate-400 font-semibold mt-1">Fasting implies absolute abstention from food and sugar-containing beverages. Pure water can be taken freely.</p>
                </div>
              </div>

              {/* General guidelines */}
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <span className="text-xs mt-0.5">🚫</span>
                  <div>
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase">Avoid Prior</h5>
                    <p className="text-[9px] text-slate-450 font-semibold leading-normal">Alcohol, tobacco, and high-fat items 24 hours prior. Restrict heavy physical workouts on collection morning.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-xs mt-0.5">🪪</span>
                  <div>
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase">Mandatory Proof</h5>
                    <p className="text-[9px] text-slate-450 font-semibold leading-normal">Valid Photo Identification (Aadhaar Card, Passport, or driving license) is mandatory at the time of sample collection.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-xs mt-0.5">📧</span>
                  <div>
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase">Report Delivery</h5>
                    <p className="text-[9px] text-slate-450 font-semibold leading-normal">Verified reports will be generated within {test.timeframe.toLowerCase()} and automatically synced under your profile panel and sent to your email.</p>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowRulesModal(false)}
                className="w-full mt-2 py-3 bg-forest hover:bg-forest-dark text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer border-0 transition-colors"
              >
                I Understand & Accept
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
