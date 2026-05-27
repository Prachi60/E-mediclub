import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiUser, FiClock, FiActivity, FiArrowLeft, FiCheckCircle, 
  FiFileText, FiUploadCloud, FiTrash2, FiShield, FiHeart 
} from 'react-icons/fi';
import { bookDoctorAppointment } from '../store/productSlice';

export default function DoctorBookingPage() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get doctors from store to fetch selected doctor details
  const { doctors } = useSelector(state => state.products);
  const selectedDoctor = doctors.find(doc => doc.id === doctorId);

  // Form input states
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [consultationType, setConsultationType] = useState('Online Consultation'); // 'Online Consultation' or 'Offline / In-Person Consultation'
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  
  // UI Flow States
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [generatedRefId, setGeneratedRefId] = useState('');
  const [validationError, setValidationError] = useState('');

  const timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '04:00 PM - 04:30 PM',
    '04:30 PM - 05:00 PM',
    '05:00 PM - 05:30 PM',
    '05:30 PM - 06:00 PM'
  ];

  if (!selectedDoctor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center select-none">
        <FiHeart className="text-coral text-5xl mb-4 animate-bounce" />
        <h2 className="text-base font-extrabold text-slate-800">Doctor Profile Not Found</h2>
        <p className="text-xs text-slate-400 font-semibold mt-2">The requested consultation profile could not be retrieved.</p>
        <button 
          onClick={() => navigate('/doctor-appointments')}
          className="mt-5 px-6 py-2.5 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm"
        >
          Return to Directory
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
    if (!preferredTime) {
      setValidationError('Please select a preferred appointment time slot.');
      return;
    }

    const bookingRef = `APT-${Date.now().toString().slice(-6)}`;
    setGeneratedRefId(bookingRef);

    const newAppointment = {
      id: bookingRef,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      avatar: selectedDoctor.avatar,
      date: new Date().toISOString().split('T')[0],
      timeSlot: preferredTime,
      type: consultationType,
      status: 'Scheduled',
      patientName: patientName,
      patientAge: patientAge,
      notes: additionalNotes,
      hasPrescription: !!prescriptionFile
    };

    dispatch(bookDoctorAppointment(newAppointment));
    setBookingSuccess(true);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 font-sans">
      
      {/* Back button */}
      <button 
        onClick={() => navigate('/doctor-appointments')}
        className="flex items-center gap-1.5 text-xs font-extrabold text-slate-400 hover:text-teal transition-colors mb-5 uppercase tracking-wider"
      >
        <FiArrowLeft /> Back to Doctors
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
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                  <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-800 leading-tight">{selectedDoctor.name}</h2>
                  <p className="text-[10px] text-teal font-black uppercase tracking-wider mt-1">{selectedDoctor.specialty} • {selectedDoctor.experience}</p>
                </div>
              </div>
              <div className="bg-slate-50 border border-slate-100 px-4 py-2 rounded-2xl text-right sm:self-auto self-start">
                <span className="text-[9px] text-slate-450 font-bold uppercase block">Consultation Fee</span>
                <span className="text-base font-black text-slate-800">₹{selectedDoctor.fee}</span>
              </div>
            </div>

            {/* Error alerts */}
            {validationError && (
              <div className="p-3.5 bg-coral-light/50 border border-coral/20 rounded-2xl text-[10px] font-bold text-coral uppercase tracking-wide mb-5">
                {validationError}
              </div>
            )}

            {/* Booking parameters Form */}
            <form onSubmit={handleBookingSubmit} className="flex flex-col gap-5">
              
              {/* Form Input: Patient Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Patient Full Name <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none">
                    <FiUser />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Form Input: Patient Age */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Patient Age (Years) <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-455 pointer-events-none">
                    <FiActivity />
                  </span>
                  <input
                    type="number"
                    required
                    min="1"
                    max="120"
                    placeholder="e.g. 45"
                    value={patientAge}
                    onChange={(e) => setPatientAge(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Form Input: Preferred Time Slot Selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Preferred Appointment TimeSlot <span className="text-coral">*</span>
                </label>
                <div className="relative w-full">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-450 pointer-events-none">
                    <FiClock />
                  </span>
                  <select
                    required
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all cursor-pointer text-slate-700 uppercase"
                  >
                    <option value="" disabled>-- Select Preferred Time Slot --</option>
                    {timeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Form Input: Consultation Type Toggle */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Consultation Mode Type <span className="text-coral">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3.5 mt-0.5">
                  <button
                    type="button"
                    onClick={() => setConsultationType('Online Consultation')}
                    className={`py-3.5 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 tap-scale flex items-center justify-center gap-1.5 ${
                      consultationType === 'Online Consultation'
                        ? 'bg-teal/10 border-teal text-teal shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>📹</span> Online Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Offline / In-Person Consultation')}
                    className={`py-3.5 border rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-200 tap-scale flex items-center justify-center gap-1.5 ${
                      consultationType === 'Offline / In-Person Consultation'
                        ? 'bg-teal/10 border-teal text-teal shadow-sm'
                        : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>🏥</span> In-Clinic Visit
                  </button>
                </div>
              </div>

              {/* Form Input: Optional Prescription Attachment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Upload Previous Prescription (Optional)
                </label>
                {!prescriptionFile ? (
                  <label className="border border-dashed border-slate-200 hover:border-teal rounded-2xl p-4 bg-slate-50/60 cursor-pointer flex flex-col items-center justify-center gap-1.5 transition-colors">
                    <FiUploadCloud className="text-xl text-slate-400" />
                    <span className="text-[10px] font-black text-teal uppercase tracking-wider">Attach medical records</span>
                    <input 
                      type="file" 
                      accept=".jpg,.jpeg,.png,.pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div className="border border-slate-100 bg-slate-50 p-3 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FiFileText className="text-teal text-lg shrink-0" />
                      <span className="text-xs font-extrabold text-slate-700 truncate block">{prescriptionFile.name}</span>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemoveFile} 
                      className="p-1.5 text-coral hover:bg-coral-light/50 rounded-lg shrink-0"
                    >
                      <FiTrash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Form Input: Notes */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">
                  Additional Notes (Symptoms, history, etc.)
                </label>
                <textarea
                  rows="3"
                  placeholder="Describe your active clinical symptoms or current condition here..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold outline-none focus:border-teal focus:bg-white focus:ring-4 focus:ring-teal-light transition-all placeholder:text-slate-400 resize-none"
                />
              </div>

              {/* Confirm Submit Action Button */}
              <button
                type="submit"
                className="mt-2 py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-md transition-all duration-200 tap-scale flex items-center justify-center gap-2"
              >
                Confirm Doctor Appointment
              </button>

            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[32px] p-8 border border-teal/20 shadow-premium flex flex-col items-center text-center gap-4 animate-fade-in relative overflow-hidden"
          >
            {/* Background glowing blob */}
            <div className="absolute top-0 w-36 h-36 bg-teal-light rounded-full filter blur-3xl opacity-60" />
            
            <FiCheckCircle className="text-teal text-6xl stroke-[2.5] mb-2" />
            
            <div>
              <span className="text-[9px] bg-teal-light text-teal font-black px-3 py-1 rounded-full uppercase tracking-wider">
                Booking Reference: {generatedRefId}
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 mt-4 leading-none">Consultation Scheduled!</h2>
              <p className="text-xs text-slate-400 font-semibold mt-2.5 max-w-sm">
                Your medical consultation is registered. The practitioner's clinic assistant will send a text update within 5 minutes.
              </p>
            </div>

            {/* Appointment summary details card */}
            <div className="w-full bg-slate-50 border border-slate-100/60 rounded-3xl p-4.5 text-xs text-slate-600 font-semibold mt-3 text-left flex flex-col gap-3">
              <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Physician</span>
                <span className="text-slate-800 font-extrabold">{selectedDoctor.name} ({selectedDoctor.specialty})</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Scheduled Slot</span>
                <span className="text-teal font-black">{preferredTime} (Today)</span>
              </div>
              <div className="flex justify-between border-b border-slate-200/50 pb-2.5">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Patient Details</span>
                <span className="text-slate-800 font-extrabold">{patientName} (Age: {patientAge})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-bold uppercase text-[9px]">Consultation Mode</span>
                <span className="text-slate-800 font-extrabold uppercase text-[10px]">{consultationType.split(' ')[0]} Mode</span>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              <button
                onClick={() => navigate('/doctor-appointments')}
                className="py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer"
              >
                Find Doctors
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="py-3.5 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer"
              >
                Go to Profile
              </button>
            </div>

            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-3">
              <FiShield className="text-teal" /> Protected Under FDA Privacy Guidelines
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
