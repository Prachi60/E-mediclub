import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { FiActivity, FiCheckCircle, FiFileText, FiShield } from 'react-icons/fi';

const mockDoctors = [
  { id: 1, name: 'Dr. Archana Sen', specialty: 'Orthopedics', experience: '15 Years', fee: 500, status: 'approved', hospital: 'Metro Ortho Clinic' },
  { id: 2, name: 'Dr. Nitin Verma', specialty: 'Endocrinology', experience: '12 Years', fee: 600, status: 'approved', hospital: 'Diabetic Care Center' },
  { id: 3, name: 'Dr. Shruti Kapoor', specialty: 'Ophthalmology', experience: '8 Years', fee: 400, status: 'pending', hospital: 'Eye Vision Center' },
  { id: 4, name: 'Dr. Ramanujam Shastri', specialty: 'Ayurveda Specialist', experience: '22 Years', fee: 350, status: 'pending', hospital: 'Patanjali Wellness Hub' },
];

export default function DoctorManagement() {
  const [doctors, setDoctors] = useState(mockDoctors);

  const handleApproveDoctor = (id) => {
    setDoctors(doctors.map(doc => doc.id === id ? { ...doc, status: 'approved' } : doc));
  };

  // Define Grid Columns
  const columns = [
    { 
      key: 'name', 
      header: 'Consultant Doctor',
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-teal-light text-teal flex items-center justify-center font-black text-xs shrink-0 select-none">
            👨‍⚕️
          </div>
          <div>
            <span className="font-extrabold text-slate-800 block text-xs truncate max-w-xs">{row.name}</span>
            <span className="text-[10px] text-slate-400 font-semibold block uppercase">{row.hospital}</span>
          </div>
        </div>
      )
    },
    { key: 'specialty', header: 'Specialty Core' },
    { key: 'experience', header: 'Experience' },
    { 
      key: 'fee', 
      header: 'Consultation Fee',
      render: (row) => <span className="font-black text-slate-700">₹{row.fee}</span>
    },
    { 
      key: 'status', 
      header: 'Audited Status',
      render: (row) => {
        if (row.status === 'approved') return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Approved</span>;
        return <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Audit</span>;
      }
    }
  ];

  // Actions column trigger
  const tableActions = (row) => {
    if (row.status === 'pending') {
      return (
        <button 
          onClick={() => handleApproveDoctor(row.id)}
          className="flex items-center gap-1 px-3 py-1.5 bg-teal text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-teal-dark shadow-sm transition-all cursor-pointer tap-scale"
        >
          <FiCheckCircle /> Verify License
        </button>
      );
    }
    return (
      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1 select-none pr-3">
        <FiCheckCircle className="text-teal text-xs" /> VERIFIED
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Clinical Consultations Registry</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Approve expert doctors list, review experience certificates, and manage clinical schedules.
          </p>
        </div>
      </div>

      {/* Reusable Data Table Grid */}
      <ReusableTable 
        columns={columns}
        data={doctors}
        searchPlaceholder="Search doctor by name or specialty..."
        searchKey="name"
        filterOptions={{ key: 'status', label: 'License Status', options: ['approved', 'pending'] }}
        actions={tableActions}
        fileName="emediclub-doctor-partners"
      />

    </div>
  );
}
