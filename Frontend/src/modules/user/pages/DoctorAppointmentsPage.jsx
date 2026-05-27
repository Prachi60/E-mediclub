import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiSearch, FiVideo, FiClock, FiCheckCircle } from 'react-icons/fi';
import DoctorCard from '../../../shared/components/DoctorCard';

export default function DoctorAppointmentsPage() {
  // Redux Selectors
  const { doctors, appointments } = useSelector(state => state.products);

  // States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const specialties = ['All', 'Cardiologist', 'Pediatrician', 'Dermatologist', 'Gynecologist'];

  // Filter Doctors list
  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10 select-none">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-3">
        <h1 className="text-xl font-extrabold text-slate-800">Doctor Appointments</h1>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
          Book online video consultations or clinic visitations in 15 seconds
        </p>
      </div>

      {/* Upcomings active bookings timelines */}
      {appointments.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Upcoming Consultations</h3>
          <div className="flex flex-col gap-3">
            {appointments.map((apt) => (
              <div 
                key={apt.id}
                className="bg-white p-4 rounded-3xl border border-teal/15 bg-teal-light/20 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal text-white flex items-center justify-center text-lg font-bold shrink-0">
                    👨‍⚕️
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{apt.doctorName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">{apt.specialty} • {apt.type}</p>
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
                  <button className="bg-teal text-white hover:bg-teal-dark font-bold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1 shrink-0 animate-pulse-subtle">
                    <FiVideo /> JOIN CALL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Specialty Filter Scrollbar & Search inputs */}
      <section className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-2">
        
        {/* Specialty filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
          {specialties.map(spec => (
            <button
              key={spec}
              onClick={() => setSelectedSpecialty(spec)}
              className={`whitespace-nowrap px-4 py-2 text-xs font-black rounded-xl transition-all shrink-0 ${
                selectedSpecialty === spec
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>

        {/* Live Search text */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search physicians by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 focus:border-teal-500 rounded-xl text-xs font-semibold outline-none"
          />
        </div>

      </section>

      {/* Doctors profiles card grid list */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <DoctorCard key={doc.id} doctor={doc} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-premium flex flex-col items-center gap-3">
            <span className="text-5xl">👨‍⚕️</span>
            <h4 className="font-extrabold text-slate-800 text-sm">No Doctors Available</h4>
            <p className="text-xs text-slate-400 font-semibold">Try searching under alternative specialties or remove search parameters.</p>
          </div>
        )}
      </section>

    </div>
  );
}
