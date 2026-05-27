import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  FiCalendar, FiSearch, FiVideo, FiClock, FiCheckCircle,
  FiFilter, FiX, FiActivity, FiUser, FiInfo, FiMessageSquare, FiMapPin, FiAward
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import DoctorCard from '../../../shared/components/DoctorCard';

export default function DoctorAppointmentsPage() {
  const navigate = useNavigate();
  // Redux Selectors
  const { doctors, appointments } = useSelector(state => state.products);

  // Filter States
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState('All'); // 'All', 'Online', 'Offline', 'Both'
  const [filterGender, setFilterGender] = useState('All'); // 'All', 'male', 'female'
  const [filterExperience, setFilterExperience] = useState('All'); // 'All', '10+', '15+'
  const [filterFeeMax, setFilterFeeMax] = useState(1500);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Selected doctor for full profile drawer
  const [selectedProfileDoc, setSelectedProfileDoc] = useState(null);

  // List of all 18 departments with matched emojis
  const departments = [
    { name: 'All', label: 'All Doctors', icon: '👨‍⚕' },
    { name: 'Dermatology', label: 'Dermatology (Skin & Hair)', icon: '🧴' },
    { name: 'Gynaecology & Obstetrics', label: 'Gynaecology & Obstetrics', icon: '🤰' },
    { name: 'Orthopaedics', label: 'Orthopaedics (Bone & Joint)', icon: '🦴' },
    { name: 'Cardiology', label: 'Cardiology (Heart)', icon: '🫀' },
    { name: 'General Physician', label: 'General Physician', icon: '🩺' },
    { name: 'Paediatrics', label: 'Paediatrics (Child Care)', icon: '👶' },
    { name: 'Neurology', label: 'Neurology (Brain & Nerves)', icon: '🧠' },
    { name: 'Psychiatry & Mental Health', label: 'Psychiatry & Mental Health', icon: '🧘' },
    { name: 'ENT', label: 'ENT (Ear, Nose & Throat)', icon: '👃' },
    { name: 'Ophthalmology', label: 'Ophthalmology (Eye Care)', icon: '👁️' },
    { name: 'Gastroenterology', label: 'Gastroenterology (Stomach & Gut)', icon: '🍎' },
    { name: 'Endocrinology', label: 'Endocrinology (Diabetes & Hormones)', icon: '🩸' },
    { name: 'Pulmonology (Lungs & Chest)', label: 'Pulmonology (Lungs & Chest)', icon: '🫁' },
    { name: 'Urology', label: 'Urology', icon: '💦' },
    { name: 'Oncology (Cancer Care)', label: 'Oncology (Cancer Care)', icon: '🎗️' },
    { name: 'Nephrology (Kidney)', label: 'Nephrology (Kidney)', icon: '🫘' },
    { name: 'Dentistry', label: 'Dentistry', icon: '🦷' }
  ];

  // Trigger skeleton loader shimmer effect on filter change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedSpecialty, filterMode, filterGender, filterExperience, filterFeeMax, searchQuery]);

  // Filter Doctors list
  const filteredDoctors = doctors.filter(doc => {
    // Search Query
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    // Specialty / Department
    const matchesSpecialty = selectedSpecialty === 'All' ||
      doc.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
      (selectedSpecialty === 'Pulmonology (Lungs & Chest)' && doc.specialty.includes('Pulmonology')) ||
      (selectedSpecialty === 'Oncology (Cancer Care)' && doc.specialty.includes('Oncology')) ||
      (selectedSpecialty === 'Nephrology (Kidney)' && doc.specialty.includes('Nephrology'));

    // Mode
    const matchesMode = filterMode === 'All' ||
      doc.consultationMode === filterMode ||
      doc.consultationMode === 'Both';

    // Gender
    const isFemale = doc.avatar.includes('1559839734-2b71ea197ec2') || doc.name.includes('Priya') || doc.name.includes('Sunita') || doc.name.includes('Anita') || doc.name.includes('Pooja') || doc.name.includes('Deepa') || doc.name.includes('Shalini') || doc.name.includes('Smita') || doc.name.includes('Aarti') || doc.name.includes('Anjali') || doc.name.includes('Sneha') || doc.name.includes('Preeti') || doc.name.includes('Meera') || doc.name.includes('Radhika') || doc.name.includes('Neha') || doc.name.includes('Shruti');
    const matchesGender = filterGender === 'All' ||
      (filterGender === 'female' && isFemale) ||
      (filterGender === 'male' && !isFemale);

    // Experience
    const expNum = parseInt(doc.experience) || 0;
    const matchesExperience = filterExperience === 'All' ||
      (filterExperience === '10+' && expNum >= 10) ||
      (filterExperience === '15+' && expNum >= 15);

    // Fee limit
    const matchesFee = doc.fee <= filterFeeMax;

    return matchesSearch && matchesSpecialty && matchesMode && matchesGender && matchesExperience && matchesFee;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10 select-none relative font-sans">

      {/* 1. Page Header */}
      <div className="border-b border-slate-100 pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800">Doctor Consultations</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
            Verified specialists. Instantly book online video appointments or in-clinic visits.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-teal bg-teal-light/20 px-2.5 py-1 rounded font-black tracking-wider uppercase">Practo Assured</span>
          <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded font-black tracking-wider uppercase">100% Secure</span>
        </div>
      </div>

      {/* 2. Upcoming Active Appointments timelines */}
      {appointments.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-450 uppercase tracking-widest px-1">Upcoming Consultations</h3>
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => (
              <div
                key={apt.id}
                className="bg-white p-4 rounded-3xl border border-teal/15 bg-teal-light/20 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal text-white flex items-center justify-center text-lg font-bold shrink-0">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{apt.doctorName}</h4>
                    <p className="text-[10px] text-slate-450 font-bold uppercase mt-0.5">{apt.specialty} • {apt.type}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-teal" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-teal" />
                    <span>{apt.timeSlot.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full flex items-center gap-1">
                    <FiCheckCircle className="stroke-[3px]" /> Confirmed
                  </span>
                  <button
                    onClick={() => navigate('/profile')}
                    className="bg-teal text-white hover:bg-teal-dark font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1 shrink-0 cursor-pointer border-0"
                  >
                    <FiVideo /> JOIN CALL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Horizontal Scrollable Department Filter Slider */}
      <section className="flex flex-col gap-2">
        <h3 className="text-xs font-black text-slate-455 uppercase tracking-widest px-1">Shop by Clinical Department</h3>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2.5 -mx-4 px-4 select-none">
          {departments.map((dept) => (
            <button
              key={dept.name}
              onClick={() => setSelectedSpecialty(dept.name)}
              className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 text-xs font-black rounded-full transition-all shrink-0 cursor-pointer duration-200 border ${selectedSpecialty === dept.name
                  ? 'bg-forest text-white border-forest shadow-premium-hover scale-[1.02]'
                  : 'bg-white border-slate-100 text-slate-600 hover:border-forest/20 hover:bg-slate-50'
                }`}
            >
              <span className="text-sm">{dept.icon}</span>
              <span>{dept.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* 4. Advanced Filters & Search Bar Section */}
      <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 w-full">
          {/* Main search bar */}
          <div className="relative w-full md:flex-1">
            <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, degree or hospital..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-100 focus:border-teal rounded-2xl text-xs font-semibold outline-none transition-all placeholder:text-slate-400 focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Toggle Mobile */}
            <button
              onClick={() => setShowFiltersMobile(!showFiltersMobile)}
              className="flex-1 md:flex-none py-3 px-4 border border-slate-150 rounded-2xl flex items-center justify-center gap-2 text-xs font-black text-slate-600 hover:bg-slate-50 cursor-pointer"
            >
              <FiFilter className="text-teal" />
              <span>ADVANCED FILTERS</span>
              {showFiltersMobile ? <FiX className="text-[10px] shrink-0" /> : null}
            </button>
          </div>
        </div>

        {/* Expandable Advanced Filters Deck */}
        <AnimatePresence>
          {(showFiltersMobile || window.innerWidth >= 1024) && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-3 border-t border-slate-50 overflow-hidden"
            >
              {/* Filter: Consultation Mode */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Consultation Mode</label>
                <select
                  value={filterMode}
                  onChange={(e) => setFilterMode(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                >
                  <option value="All">All Consultation Modes</option>
                  <option value="Online">📹 Online Video</option>
                  <option value="Offline">🏥 In-Clinic Consults</option>
                  <option value="Both">✨ Both Modes Available</option>
                </select>
              </div>

              {/* Filter: Doctor Gender */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Doctor Gender</label>
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                >
                  <option value="All">All Genders</option>
                  <option value="male">Male Doctor</option>
                  <option value="female">Female Doctor</option>
                </select>
              </div>

              {/* Filter: Experience */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-black uppercase text-slate-450 tracking-wider">Experience Level</label>
                <select
                  value={filterExperience}
                  onChange={(e) => setFilterExperience(e.target.value)}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-100 bg-slate-50 text-xs font-bold text-slate-650 cursor-pointer outline-none focus:border-teal/30 focus:bg-white"
                >
                  <option value="All">Any Experience</option>
                  <option value="10+">10+ Years of Experience</option>
                  <option value="15+">15+ Years of Experience</option>
                </select>
              </div>

              {/* Filter: Max Fee */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-[9px] font-black uppercase text-slate-450 tracking-wider">
                  <span>Max Consultation Fee</span>
                  <span className="text-teal font-black">₹{filterFeeMax}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="1500"
                  step="50"
                  value={filterFeeMax}
                  onChange={(e) => setFilterFeeMax(parseInt(e.target.value))}
                  className="w-full accent-teal mt-2 cursor-pointer"
                />
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 5. Doctor Directory list grid */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2 px-1">
          <h2 className="text-sm font-extrabold text-slate-800">
            {selectedSpecialty === 'All' ? 'All' : selectedSpecialty} Specialists
          </h2>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            {filteredDoctors.length} doctors found
          </span>
        </div>

        {isLoading ? (
          /* Premium Shimmer Skeleton loading state */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4 select-none animate-pulse-subtle">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2 mt-1">
                    <div className="w-1/2 h-4 rounded bg-slate-200" />
                    <div className="w-1/3 h-3 rounded bg-slate-150" />
                    <div className="w-1/4 h-2.5 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="h-10 rounded-2xl bg-slate-50 border border-slate-100" />
                <div className="flex justify-between items-center mt-2 border-t border-slate-50 pt-3">
                  <div className="w-1/3 h-4 bg-slate-200 rounded" />
                  <div className="w-1/4 h-8 bg-slate-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredDoctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDoctors.map((doc) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                onViewProfile={() => setSelectedProfileDoc(doc)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl">👨‍⚕️</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Doctor Profiles Match Filters</h4>
            <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
              We have doctors available in all categories. Try adjusting your advanced filter limits or remove search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedSpecialty('All');
                setSearchQuery('');
                setFilterMode('All');
                setFilterGender('All');
                setFilterExperience('All');
                setFilterFeeMax(1500);
              }}
              className="mt-2 py-2 px-6 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-sm border-0"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </section>

      {/* 6. Premium Float Support consultation details bubble */}
      <div className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
        <button
          onClick={() => navigate('/lab-tests')}
          className="flex items-center gap-2 p-3.5 bg-teal hover:bg-teal-dark text-white rounded-full shadow-premium-hover hover:scale-105 transition-all duration-300 group cursor-pointer border-0"
        >
          <span className="text-lg">🩸</span>
          <span className="text-[10px] font-black uppercase tracking-wider hidden group-hover:block pr-1">Need a Lab Test?</span>
        </button>
      </div>

      {/* 7. FULL DETAILED PROFILE DRAWER MODAL OVERLAY */}
      <AnimatePresence>
        {selectedProfileDoc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none">
            {/* Drawer Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProfileDoc(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm cursor-pointer"
            />

            {/* Profile Drawer Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-premium z-10 flex flex-col gap-5 max-h-[85vh] overflow-y-auto no-scrollbar"
            >
              {/* Close helper */}
              <button
                onClick={() => setSelectedProfileDoc(null)}
                className="absolute top-4 right-4 p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl cursor-pointer border-0 transition-colors"
              >
                <FiX className="text-sm shrink-0" />
              </button>

              {/* Profile Header */}
              <div className="flex gap-4 items-start border-b border-slate-100 pb-5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden shadow-sm bg-slate-100 shrink-0">
                  <img src={selectedProfileDoc.avatar} alt={selectedProfileDoc.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h2 className="text-base font-black text-slate-800 leading-snug">{selectedProfileDoc.name}</h2>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block animate-pulse shrink-0" title="Active Online" />
                  </div>
                  <span className="text-[10px] text-teal font-black uppercase tracking-wider block mt-1">{selectedProfileDoc.specialty} • {selectedProfileDoc.subSpecialty}</span>
                  <p className="text-[10px] text-slate-450 font-bold mt-1 leading-relaxed">{selectedProfileDoc.qualification}</p>

                  <div className="flex items-center gap-1.5 mt-2.5 text-[9px] text-slate-450 font-bold uppercase tracking-wider">
                    <FiAward className="text-teal" />
                    <span>Reg No: {selectedProfileDoc.registrationNumber}</span>
                  </div>
                </div>
              </div>

              {/* Bio & Hospital Affiliation */}
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-1">About Doctor</h4>
                  <p className="text-xs text-slate-650 font-medium leading-relaxed italic">"{selectedProfileDoc.bio}"</p>
                </div>

                <div className="bg-slate-50/70 border border-slate-100 p-3.5 rounded-2xl flex gap-2.5 items-start">
                  <FiMapPin className="text-teal mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-[10px] text-slate-700 font-extrabold uppercase">Hospital Affiliation</h5>
                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">{selectedProfileDoc.hospital}</p>
                  </div>
                </div>
              </div>

              {/* Consultation details stats list */}
              <div className="grid grid-cols-2 gap-3.5 border-t border-slate-150/65 pt-4 text-xs font-semibold text-slate-600">
                <div className="flex flex-col gap-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Online Fee</span>
                  <strong className="text-sm font-black text-slate-800">₹{selectedProfileDoc.fee}</strong>
                </div>
                <div className="flex flex-col gap-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">In-Person Fee</span>
                  <strong className="text-sm font-black text-slate-800">₹{selectedProfileDoc.offlineFee}</strong>
                </div>
                <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Experience</span>
                  <strong className="text-[11px] font-extrabold text-slate-800">{selectedProfileDoc.experience}</strong>
                </div>
                <div className="flex flex-col gap-1 bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-450 font-black uppercase">Languages</span>
                  <strong className="text-[10px] font-extrabold text-slate-800 truncate">{selectedProfileDoc.languages.join(', ')}</strong>
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t border-slate-150/65 pt-4">
                <h4 className="text-[10px] text-slate-400 font-black uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <FiMessageSquare className="text-teal" /> Patient Reviews ({selectedProfileDoc.reviewsCount})
                </h4>

                <div className="flex flex-col gap-3.5 max-h-52 overflow-y-auto no-scrollbar pr-1">
                  {selectedProfileDoc.testimonials && selectedProfileDoc.testimonials.map((testi, idx) => (
                    <div key={idx} className="bg-slate-50/40 p-3.5 border border-slate-100 rounded-2xl flex flex-col gap-2 transition-all hover:bg-slate-50">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                        <span className="text-slate-850 font-extrabold">{testi.patientName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-amber-500">★ {testi.rating}.0</span>
                          <span className="text-slate-350">•</span>
                          <span className="text-slate-400">{testi.date}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-600 font-medium leading-relaxed italic">"{testi.reviewText}"</p>
                      <span className="text-[8px] bg-slate-100 border border-slate-200/50 px-2 py-0.5 rounded font-black text-slate-400 uppercase tracking-wide w-fit">{testi.mode} Visit</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Booking CTA */}
              <button
                onClick={() => {
                  setSelectedProfileDoc(null);
                  navigate(`/doctors/${selectedProfileDoc.id}/book`);
                }}
                className="w-full mt-2 py-4 bg-forest hover:bg-forest-dark text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-sm transition-all border-0 cursor-pointer"
              >
                Instant Appointment Booking (₹{selectedProfileDoc.fee})
              </button>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
