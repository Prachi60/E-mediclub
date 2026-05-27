import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import StatsCard from '../../admin/components/StatsCard';
import ReusableTable from '../../admin/components/ReusableTable';
import { requestWithdrawal } from '../store/vendorSlice';
import { FiDollarSign, FiPlus, FiCheckCircle, FiClock, FiActivity } from 'react-icons/fi';

export default function VendorEarnings() {
  const dispatch = useDispatch();
  const { withdrawals, analytics, kycDetails } = useSelector(state => state.vendor);
  
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [successMsg, setSuccessMsg] = useState(false);

  const handleWithdrawRequest = (e) => {
    e.preventDefault();
    if (!withdrawAmt || Number(withdrawAmt) <= 0) return;
    
    dispatch(requestWithdrawal(Number(withdrawAmt)));
    setWithdrawAmt("");
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 2000);
  };

  // Define Columns
  const columns = [
    { key: 'id', header: 'Request ID' },
    { 
      key: 'date', 
      header: 'Requested Date',
      render: (row) => <span className="font-extrabold text-slate-500">{row.date}</span>
    },
    { key: 'bankAccount', header: 'Remittance Target' },
    { 
      key: 'status', 
      header: 'Status',
      render: (row) => {
        if (row.status === 'approved') return <span className="bg-teal-light text-teal px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider">Approved</span>;
        return <span className="bg-gold-light text-gold-dark px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1 w-fit"><FiClock /> Pending</span>;
      }
    },
    { 
      key: 'amount', 
      header: 'Amount',
      render: (row) => <span className="font-black text-slate-800">₹{row.amount.toLocaleString()}</span>
    }
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 leading-none">Earnings & Withdrawals Ledger</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-2 tracking-wider">
            Review store transaction summaries, request immediate bank remittances, and audit billing Statements.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatsCard 
          title="Net Store Billing" 
          value={`₹${analytics.totalRevenue.toLocaleString()}`} 
          change="+14.8%" 
          isPositive={true} 
          icon={FiDollarSign} 
          color="teal" 
          sparklineData={[15, 20, 25, 22, 35, 42, 38]}
        />
        <StatsCard 
          title="Available Payout Balance" 
          value="₹24,200" 
          change="Withdrawal Ready" 
          isPositive={true} 
          icon={FiDollarSign} 
          color="forest" 
          sparklineData={[24, 24, 24, 24, 24, 24, 24]}
        />
        <StatsCard 
          title="Completed Payouts" 
          value="₹75,000" 
          change="To HDFC Bank" 
          isPositive={true} 
          icon={FiCheckCircle} 
          color="gold" 
          sparklineData={[30, 30, 45, 45, 75, 75, 75]}
        />
      </section>

      {/* Withdraw form & list grids */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left: Withdrawals history table */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <FiActivity className="text-teal" /> Withdrawal Logs
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
              Audit the status of recent payouts dispatched to your banking coordinates.
            </p>
            <ReusableTable 
              columns={columns}
              data={withdrawals}
              searchPlaceholder="Search request ID..."
              searchKey="id"
              fileName="emediclub-store-withdrawals"
            />
          </div>
        </div>

        {/* Right: Request Form */}
        <div className="bg-white border border-slate-100 p-5 rounded-3xl shadow-premium">
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <FiPlus className="text-teal" /> Trigger Payout
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-50 pb-2 mb-4">
            Disburse available store revenue to verified bank accounts.
          </p>

          <form onSubmit={handleWithdrawRequest} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Payout Amount (₹)</label>
              <input 
                type="number" 
                required
                min="500"
                max="24200"
                placeholder="e.g., 5000"
                value={withdrawAmt}
                onChange={(e) => setWithdrawAmt(e.target.value)}
                className="px-3.5 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black outline-none focus:border-teal"
              />
              <span className="text-[9px] text-slate-400 font-semibold uppercase mt-1">Min withdrawal threshold: ₹500</span>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex flex-col gap-2 text-2xs font-semibold text-slate-600">
              <span className="text-slate-400 font-black uppercase tracking-wider">Verified Target Bank</span>
              <div className="flex justify-between mt-1 text-[10px]">
                <span className="text-slate-500 font-bold">Bank Name</span>
                <span className="font-extrabold text-slate-700">{kycDetails.bankName}</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span className="text-slate-500 font-bold">Account Number</span>
                <span className="font-extrabold text-slate-700">*****{kycDetails.accountNo.slice(-4)}</span>
              </div>
            </div>

            <button 
              type="submit"
              className="py-3 bg-teal hover:bg-teal-dark text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all cursor-pointer tap-scale"
            >
              Confirm Withdrawal
            </button>

            {successMsg && (
              <span className="flex items-center justify-center gap-1 text-teal font-extrabold text-2xs animate-bounce mt-2 uppercase tracking-wide">
                <FiCheckCircle /> Withdrawal request submitted!
              </span>
            )}
          </form>

        </div>

      </section>

    </div>
  );
}
