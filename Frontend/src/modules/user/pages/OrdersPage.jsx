import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiTruck, FiBox, FiCheckCircle, FiChevronRight } from 'react-icons/fi';

export default function OrdersPage() {
  const navigate = useNavigate();
  const { orders } = useSelector(state => state.products);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Delivered':
        return <FiCheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />;
      case 'Shipped':
      case 'Dispatched':
        return <FiTruck className="w-5 h-5 text-teal shrink-0" />;
      case 'Ordered':
      default:
        return <FiBox className="w-5 h-5 text-forest shrink-0 animate-bounce" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-600';
      case 'Shipped':
      case 'Dispatched':
        return 'bg-teal-light text-teal';
      case 'Ordered':
      default:
        return 'bg-forest-light text-forest';
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10 select-none">
      
      <div className="border-b border-slate-100 pb-3 mb-6">
        <h1 className="text-xl font-extrabold text-slate-800">Your Clinical Orders</h1>
        <p className="text-xs text-slate-400 font-bold uppercase mt-1 tracking-wider">
          Track active shipments and invoice histories
        </p>
      </div>

      {orders.length > 0 ? (
        <div className="flex flex-col gap-5">
          {orders.map((ord) => (
            <div 
              key={ord.id}
              className="bg-white rounded-3xl p-5 border border-slate-100 shadow-premium flex flex-col gap-4"
            >
              
              {/* Top order summary details */}
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Reference ID</span>
                  <h4 className="text-sm font-extrabold text-slate-800 mt-0.5">{ord.id}</h4>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-right block">Order Date</span>
                  <p className="text-xs text-slate-500 font-bold mt-0.5">{ord.date}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${getStatusColor(ord.status)}`}>
                  {getStatusIcon(ord.status)}
                  <span>{ord.status}</span>
                </div>
              </div>

              {/* Items listing inside this order */}
              <div className="flex flex-col gap-2">
                {ord.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-600">
                    <span>
                      {item.name} <strong className="text-slate-400">x{item.qty}</strong>
                    </span>
                    <span className="text-slate-800">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              {/* Timeline Shipment Tracker block (if not delivered) */}
              {ord.status !== 'Delivered' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between text-xs mt-2.5">
                  <div className="flex items-center gap-3">
                    <FiTruck className="text-teal w-6 h-6 animate-pulse shrink-0" />
                    <div>
                      <h5 className="font-extrabold text-slate-850">Express Dispatch Active</h5>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-0.5">Delivery scheduled for Today evening.</p>
                    </div>
                  </div>
                  <span className="text-[9px] text-teal bg-teal-light px-2.5 py-1 rounded font-black shrink-0">ON BUDGET</span>
                </div>
              )}

              {/* Total payout & address summary row */}
              <div className="flex justify-between items-end pt-3 border-t border-slate-50 mt-1">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Shipping To</span>
                  <p className="text-xs font-black text-slate-700 mt-0.5">{ord.deliveryAddress}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total Charged</span>
                  <p className="text-base font-black text-forest mt-0.5">₹{ord.total}</p>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-16 border border-slate-100 shadow-premium text-center flex flex-col items-center gap-3">
          <FiShoppingBag className="w-12 h-12 text-slate-350" />
          <h4 className="font-extrabold text-slate-800 text-sm">No Orders Placed Yet</h4>
          <p className="text-xs text-slate-400 font-semibold max-w-xs mx-auto leading-relaxed">
            Fill your health cabinet with prescription medicines and schedule specialized diagnostics instantly!
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-3 px-6 py-2.5 bg-forest text-white text-xs font-black rounded-xl"
          >
            Browse Pharmacy Shop
          </button>
        </div>
      )}

    </div>
  );
}
