import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import ReusableTable from '../components/ReusableTable';
import { approveVendor, rejectVendor, updateCommissionRate } from '../store/adminSlice';
import { FiCheckCircle, FiXCircle, FiShield, FiFileText, FiPercent, FiSlash } from 'react-icons/fi';

export default function VendorManagement() {
  const dispatch = useDispatch();
  const { vendors } = useSelector(state => state.admin);

  // Modal active states
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showKycModal, setShowKycModal] = useState(false);
  const [editingCommissionId, setEditingCommissionId] = useState(null);
  const [customRate, setCustomRate] = useState(10);

  const handleAuditKyc = (vendor) => {
    setSelectedVendor(vendor);
    setShowKycModal(true);
  };

  const handleApprove = (id) => {
    dispatch(approveVendor(id));
    setShowKycModal(false);
  };

  const handleReject = (id) => {
    dispatch(rejectVendor(id));
    setShowKycModal(false);
  };

  const handleSaveCommission = (vendorId) => {
    dispatch(updateCommissionRate({ vendorId, rate: Number(customRate) }));
    setEditingCommissionId(null);
  };

  // Define Table Columns
  const columns = [
    { key: 'name', header: 'Merchant Partner' },
    { key: 'storeName', header: 'Store Identity' },
    { 
      key: 'status', 
      header: 'License State',
      render: (row) => {
        if (row.status === 'approved') {
          return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Approved</span>;
        } else if (row.status === 'pending') {
          return <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Awaiting Audit</span>;
        }
        return <span className="bg-coral-light text-coral px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Rejected</span>;
      }
    },
    { 
      key: 'kyc', 
      header: 'KYC Audit',
      render: (row) => (
        <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
          <FiFileText className={row.kyc === 'verified' ? 'text-teal' : 'text-slate-400'} />
          {row.kyc.toUpperCase()}
        </span>
      )
    },
    { 
      key: 'commissionRate', 
      header: 'Commission',
      render: (row) => (
        <div className="flex items-center gap-2">
          {editingCommissionId === row.id ? (
            <div className="flex items-center gap-1.5">
              <input 
                type="number" 
                value={customRate} 
                onChange={(e) => setCustomRate(e.target.value)}
                className="w-14 px-2 py-1 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black outline-none focus:border-teal"
              />
              <button 
                onClick={() => handleSaveCommission(row.id)}
                className="text-teal hover:underline text-[10px] font-black uppercase tracking-wide cursor-pointer"
              >
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-800">{row.commissionRate}%</span>
              {row.status === 'approved' && (
                <button 
                  onClick={() => { setEditingCommissionId(row.id); setCustomRate(row.commissionRate); }}
                  className="p-1 rounded bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-teal cursor-pointer"
                >
                  <FiPercent className="text-2xs" />
                </button>
              )}
            </div>
          )}
        </div>
      )
    },
    { 
      key: 'earnings', 
      header: 'Earnings Payout',
      render: (row) => <span className="font-black text-slate-800">₹{row.earnings.toLocaleString()}</span>
    }
  ];

  // Actions column trigger
  const tableActions = (row) => {
    if (row.status === 'pending') {
      return (
        <button 
          onClick={() => handleAuditKyc(row)}
          className="flex items-center gap-1 px-3 py-1.5 bg-gold-dark text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-gold-dark/90 shadow-sm cursor-pointer"
        >
          <FiShield /> Audit KYC
        </button>
      );
    }
    return (
      <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider flex items-center gap-1 select-none pr-3">
        <FiCheckCircle className="text-teal text-xs" /> ACTIVE
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Header section */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Vendor Partner Directory</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Verify retail license credentials, pan registration indices, and custom commission profiles.
          </p>
        </div>
      </div>

      {/* Main interactive grid */}
      <ReusableTable 
        columns={columns}
        data={vendors}
        searchPlaceholder="Search store or contact..."
        searchKey="storeName"
        filterOptions={{ key: 'status', label: 'License State', options: ['approved', 'pending', 'rejected'] }}
        actions={tableActions}
        fileName="emediclub-vendor-partners"
      />

      {/* 4. KYC Audit Glassmorphic Dialog Modal */}
      <AnimatePresence>
        {showKycModal && selectedVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark glass cover background */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKycModal(false)}
              className="fixed inset-0 bg-slate-900"
            />

            {/* Modal card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] border border-slate-100 shadow-premium max-w-lg w-full p-6 sm:p-8 z-10 relative overflow-hidden"
            >
              <h3 className="text-base font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FiShield className="text-teal" /> Licensing Audit Center
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide border-b border-slate-50 pb-3.5 mb-5">
                Verifying drug authorization and GST tax compliance folders.
              </p>

              {/* Grid document details */}
              <div className="flex flex-col gap-4.5">
                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 flex flex-col gap-2.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Applicant Partner</span>
                    <span className="font-extrabold text-slate-700">{selectedVendor.name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Contact Channel</span>
                    <span className="font-extrabold text-slate-700">{selectedVendor.phone}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400 font-bold">Store Designation</span>
                    <span className="font-extrabold text-slate-700">{selectedVendor.storeName}</span>
                  </div>
                </div>

                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">KYC Document Uploads</h4>
                
                <div className="grid grid-cols-2 gap-3.5">
                  <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-teal-light/10">
                    <FiFileText className="text-xl text-teal" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">Drug License</span>
                    <span className="text-[8px] font-bold text-teal bg-teal-light px-2 py-0.5 rounded-full mt-1.5 uppercase">DL-20831/15</span>
                  </div>
                  <div className="border border-slate-100 rounded-2xl p-4 flex flex-col gap-1 items-center justify-center text-center bg-teal-light/10">
                    <FiFileText className="text-xl text-teal" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-wide mt-2">GST Certificate</span>
                    <span className="text-[8px] font-bold text-teal bg-teal-light px-2 py-0.5 rounded-full mt-1.5 uppercase">27AAAAA1111A1Z1</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons deck */}
              <div className="grid grid-cols-2 gap-4 mt-8 border-t border-slate-50 pt-5">
                <button
                  onClick={() => handleReject(selectedVendor.id)}
                  className="flex items-center justify-center gap-1.5 py-3 border border-coral/30 hover:border-coral bg-coral-light/30 hover:bg-coral-light/60 text-coral text-xs font-black uppercase tracking-wider rounded-2xl transition-all cursor-pointer tap-scale"
                >
                  <FiXCircle /> REJECT REGISTRATION
                </button>
                <button
                  onClick={() => handleApprove(selectedVendor.id)}
                  className="flex items-center justify-center gap-1.5 py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-sm transition-all cursor-pointer tap-scale"
                >
                  <FiCheckCircle /> APPROVE & ACTIVATE
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
