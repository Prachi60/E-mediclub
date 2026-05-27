import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FiCalendar, FiClock, FiShield, FiFileText } from 'react-icons/fi';
import LabTestCard from '../../../shared/components/LabTestCard';

export default function LabTestsPage() {
  const { labTests, labBookings } = useSelector(state => state.products);

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-10 select-none">
      
      {/* Page Header */}
      <div className="border-b border-slate-100 pb-3">
        <h1 className="text-xl font-extrabold text-slate-800">Diagnostic Lab Tests</h1>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
          Accurate results certified under FDA clinical licensing regulations.
        </p>
      </div>

      {/* Timeline active lab package bookings */}
      {labBookings.length > 0 && (
        <section className="flex flex-col gap-3">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Upcoming Diagnostic Sample Collections</h3>
          <div className="flex flex-col gap-3">
            {labBookings.map((bk) => (
              <div 
                key={bk.id}
                className="bg-white p-4 rounded-3xl border border-teal/15 bg-teal-light/20 shadow-premium flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal text-white flex items-center justify-center text-lg font-bold shrink-0">
                    🧪
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">{bk.packageName}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Reference No: {bk.id} • Scheduled</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <FiCalendar className="text-teal" />
                    <span>{bk.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiClock className="text-teal" />
                    <span>{bk.timeSlot}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-amber-50 text-amber-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full">
                    Home Collector Assigned
                  </span>
                  <button className="bg-teal text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-1">
                    <FiFileText /> VIEW RULES
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Health diagnostics tips block banner */}
      <section className="bg-forest-light/60 p-4 rounded-3xl border border-forest/10 flex items-center gap-3.5 text-xs text-forest-dark font-semibold">
        <span className="text-2xl">🩸</span>
        <div>
          <h4 className="font-extrabold text-sm text-forest-dark">Important Instructions Prior to Tests</h4>
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wide mt-1">
            Fasting for 10-12 hours is mandatory for sugar and lipid packages. Only clean water is allowed.
          </p>
        </div>
      </section>

      {/* Lab packages display grid */}
      <section className="flex flex-col gap-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Available Diagnostic Packages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {labTests.map((test) => (
            <LabTestCard key={test.id} test={test} />
          ))}
        </div>
      </section>

    </div>
  );
}
