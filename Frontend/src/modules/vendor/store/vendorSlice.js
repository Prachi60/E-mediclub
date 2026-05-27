import { createSlice } from '@reduxjs/toolkit';

// Realistic mock data for Vendor (Wellness Rx Pharmacy)
const mockVendorProducts = [
  { id: 101, name: 'Paracetamol 650mg Tablets', price: 32, stock: 140, category: 'Allopathy', packSize: 'Strip of 15 tablets', discPercent: 10, status: 'active', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' },
  { id: 102, name: 'Amoxicillin 500mg Capsules', price: 112, stock: 85, category: 'Allopathy', packSize: 'Strip of 10 capsules', discPercent: 5, status: 'active', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80' },
  { id: 103, name: 'Organic Ashvagandha Daily Tablets', price: 299, stock: 12, category: 'Ayurveda', packSize: 'Bottle of 60 tablets', discPercent: 15, status: 'active', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=80' },
  { id: 104, name: 'Chyawanprash Awaleha Immune', price: 380, stock: 24, category: 'Ayurveda', packSize: 'Jar of 500g', discPercent: 20, status: 'active', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300&auto=format&fit=crop&q=80' },
];

const mockVendorOrders = [
  { id: 'EM-OD-9081', customerName: 'Ramesh Kumar', items: 'Organic Ashvagandha x 2, Paracetamol x 1', totalAmount: 630, status: 'pending', date: '2026-05-26', phone: '9876543201', address: '12, Garden View, Link Road, Mumbai' },
  { id: 'EM-OD-9065', customerName: 'Vijay Chawla', items: 'Chyawanprash Awaleha x 1', totalAmount: 304, status: 'shipped', date: '2026-05-25', phone: '9876543204', address: 'Plot 45, Tech Park, Sector V, New Delhi' },
  { id: 'EM-OD-8991', customerName: 'Anoop Singh', items: 'Amoxicillin 500mg x 2', totalAmount: 212, status: 'delivered', date: '2026-05-20', phone: '9876543202', address: '12, Garden View, Link Road, Mumbai' },
];

const mockVendorLabTests = [
  { id: 201, name: 'Basic Fever Checkup Panel', price: 499, description: 'Covers Malaria, Dengue, CBC, and Widal test parameters.', durationHours: 24 },
  { id: 202, name: 'Advanced Kidney Panel (KFT)', price: 799, description: 'Covers Urea, Creatinine, Uric acid, and full Electrolytes.', durationHours: 12 },
];

const mockAppointments = [
  { id: 301, patientName: 'Rohan Joshi', doctorName: 'Dr. Archana Sen (Orthopedics)', slot: '10:30 AM - 11:00 AM', date: '2026-05-27', status: 'confirmed' },
  { id: 302, patientName: 'Meera Deshmukh', doctorName: 'Dr. Archana Sen (Orthopedics)', slot: '04:00 PM - 04:30 PM', date: '2026-05-27', status: 'pending' },
];

const mockWithdrawals = [
  { id: 'W-009', amount: 45000, date: '2026-05-24', status: 'approved', bankAccount: 'HDFC Bank - ****9876' },
  { id: 'W-008', amount: 30000, date: '2026-04-12', status: 'approved', bankAccount: 'HDFC Bank - ****9876' },
  { id: 'W-010', amount: 15000, date: '2026-05-26', status: 'pending', bankAccount: 'HDFC Bank - ****9876' },
];

const initialState = {
  products: mockVendorProducts,
  orders: mockVendorOrders,
  labTests: mockVendorLabTests,
  appointments: mockAppointments,
  withdrawals: mockWithdrawals,
  kycDetails: {
    status: 'verified',
    storeName: 'Wellness Rx Pharmacy',
    gstNumber: '27AAAAA1111A1Z1',
    drugLicense: 'DL-20831/15',
    panNumber: 'ABCDE1234F',
    bankName: 'HDFC Bank',
    accountHolder: 'Wellness Rx Retail Corp',
    accountNo: '501000987654',
    ifscCode: 'HDFC0000012',
    branch: 'Linking Road, Bandra W, Mumbai'
  },
  analytics: {
    totalRevenue: 84200,
    salesTarget: 100000,
    ordersCount: 48,
    activeProductsCount: 12,
    weeklySales: [
      { day: 'Mon', sales: 4200 },
      { day: 'Tue', sales: 6800 },
      { day: 'Wed', sales: 9100 },
      { day: 'Thu', sales: 7400 },
      { day: 'Fri', sales: 11200 },
      { day: 'Sat', sales: 14500 },
      { day: 'Sun', sales: 12000 }
    ]
  }
};

const vendorSlice = createSlice({
  name: 'vendor',
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push({
        id: Date.now(),
        ...action.payload,
        status: 'active'
      });
      state.analytics.activeProductsCount += 1;
    },
    editProduct: (state, action) => {
      state.products = state.products.map(p => 
        p.id === action.payload.id ? { ...p, ...action.payload } : p
      );
    },
    deleteProduct: (state, action) => {
      state.products = state.products.filter(p => p.id !== action.payload);
      state.analytics.activeProductsCount = Math.max(0, state.analytics.activeProductsCount - 1);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      state.orders = state.orders.map(o => 
        o.id === orderId ? { ...o, status } : o
      );
    },
    addLabTest: (state, action) => {
      state.labTests.push({
        id: Date.now(),
        ...action.payload
      });
    },
    editAppointmentStatus: (state, action) => {
      const { id, status } = action.payload;
      state.appointments = state.appointments.map(a => 
        a.id === id ? { ...a, status } : a
      );
    },
    requestWithdrawal: (state, action) => {
      state.withdrawals.unshift({
        id: `W-0${state.withdrawals.length + 10}`,
        amount: action.payload,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        bankAccount: `${state.kycDetails.bankName} - ****${state.kycDetails.accountNo.slice(-4)}`
      });
    },
    updateKycDetails: (state, action) => {
      state.kycDetails = {
        ...state.kycDetails,
        ...action.payload,
        status: 'submitted' // updates back to submitted for admin validation
      };
    }
  }
});

export const {
  addProduct,
  editProduct,
  deleteProduct,
  updateOrderStatus,
  addLabTest,
  editAppointmentStatus,
  requestWithdrawal,
  updateKycDetails
} = vendorSlice.actions;

export default vendorSlice.reducer;
