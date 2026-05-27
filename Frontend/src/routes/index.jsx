import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../shared/layouts/MainLayout';
import Shimmer from '../shared/components/Shimmer';

// Lazy loading clinical pages for enhanced performance (User Panel)
const HomePage = lazy(() => import('../modules/user/pages/HomePage'));
const ProductDetailsPage = lazy(() => import('../modules/user/pages/ProductDetailsPage'));
const CategoriesPage = lazy(() => import('../modules/user/pages/CategoriesPage'));
const SearchPage = lazy(() => import('../modules/user/pages/SearchPage'));
const CartPage = lazy(() => import('../modules/user/pages/CartPage'));
const CheckoutPage = lazy(() => import('../modules/user/pages/CheckoutPage'));
const OrdersPage = lazy(() => import('../modules/user/pages/OrdersPage'));
const ProfilePage = lazy(() => import('../modules/user/pages/ProfilePage'));
const DoctorAppointmentsPage = lazy(() => import('../modules/user/pages/DoctorAppointmentsPage'));
const LabTestsPage = lazy(() => import('../modules/user/pages/LabTestsPage'));
const DoctorBookingPage = lazy(() => import('../modules/user/pages/DoctorBookingPage'));
const LabTestBookingPage = lazy(() => import('../modules/user/pages/LabTestBookingPage'));
const LabDetailsPage = lazy(() => import('../modules/user/pages/LabDetailsPage'));


// Auth Page (Customer)
const LoginPage = lazy(() => import('../modules/auth/pages/LoginPage'));

// Layouts (Admin & Vendor)
const AdminLayout = lazy(() => import('../modules/admin/layouts/AdminLayout'));
const VendorLayout = lazy(() => import('../modules/vendor/layouts/VendorLayout'));

// Super Admin Auth Page Modules
const AdminLoginPage = lazy(() => import('../modules/auth/admin/pages/AdminLoginPage'));
const AdminForgotPasswordPage = lazy(() => import('../modules/auth/admin/pages/AdminForgotPasswordPage'));
const AdminVerifyOtpPage = lazy(() => import('../modules/auth/admin/pages/AdminVerifyOtpPage'));
const AdminResetPasswordPage = lazy(() => import('../modules/auth/admin/pages/AdminResetPasswordPage'));

// Super Admin Page Modules
const AdminDashboard = lazy(() => import('../modules/admin/pages/AdminDashboard'));
const VendorManagement = lazy(() => import('../modules/admin/pages/VendorManagement'));
const ProductManagement = lazy(() => import('../modules/admin/pages/ProductManagement'));
const OrdersManagement = lazy(() => import('../modules/admin/pages/OrdersManagement'));
const UsersManagement = lazy(() => import('../modules/admin/pages/UsersManagement'));
const DoctorManagement = lazy(() => import('../modules/admin/pages/DoctorManagement'));
const LabTestsManagement = lazy(() => import('../modules/admin/pages/LabTestsManagement'));
const CMSManagement = lazy(() => import('../modules/admin/pages/CMSManagement'));
const SettingsPage = lazy(() => import('../modules/admin/pages/SettingsPage'));

// Multi-Vendor Auth Page Modules
const VendorLoginPage = lazy(() => import('../modules/auth/vendor/pages/VendorLoginPage'));
const VendorSignupPage = lazy(() => import('../modules/auth/vendor/pages/VendorSignupPage'));
const VendorForgotPasswordPage = lazy(() => import('../modules/auth/vendor/pages/VendorForgotPasswordPage'));
const VendorVerifyOtpPage = lazy(() => import('../modules/auth/vendor/pages/VendorVerifyOtpPage'));
const OnboardingPending = lazy(() => import('../modules/vendor/pages/OnboardingPending'));

// Multi-Vendor Page Modules
const VendorDashboard = lazy(() => import('../modules/vendor/pages/VendorDashboard'));
const VendorProductManagement = lazy(() => import('../modules/vendor/pages/VendorProductManagement'));
const VendorOrdersManagement = lazy(() => import('../modules/vendor/pages/VendorOrdersManagement'));
const VendorLabTestsManagement = lazy(() => import('../modules/vendor/pages/VendorLabTestsManagement'));
const VendorAppointmentsPage = lazy(() => import('../modules/vendor/pages/VendorAppointmentsPage'));
const VendorEarnings = lazy(() => import('../modules/vendor/pages/VendorEarnings'));
const VendorProfile = lazy(() => import('../modules/vendor/pages/VendorProfile'));

// Full Shimmer Suspense Page Loader
const PageSuspense = ({ children }) => (
  <Suspense fallback={
    <div className="flex flex-col gap-6 p-2 md:p-6 w-full animate-pulse-subtle">
      <div className="w-1/3 h-6 rounded bg-slate-200 shimmer-element" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mt-4">
        <div className="md:col-span-2 flex flex-col gap-4">
          <Shimmer type="card" count={2} />
        </div>
        <Shimmer type="list" count={2} />
      </div>
    </div>
  }>
    {children}
  </Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Main User Module Layout Router */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<PageSuspense><HomePage /></PageSuspense>} />
        <Route path="product/:id" element={<PageSuspense><ProductDetailsPage /></PageSuspense>} />
        <Route path="categories" element={<PageSuspense><CategoriesPage /></PageSuspense>} />
        <Route path="medicines" element={<PageSuspense><CategoriesPage /></PageSuspense>} />
        <Route path="wellness" element={<PageSuspense><CategoriesPage /></PageSuspense>} />
        <Route path="ayurveda" element={<PageSuspense><CategoriesPage /></PageSuspense>} />
        <Route path="search" element={<PageSuspense><SearchPage /></PageSuspense>} />
        <Route path="cart" element={<PageSuspense><CartPage /></PageSuspense>} />
        <Route path="checkout" element={<PageSuspense><CheckoutPage /></PageSuspense>} />
        <Route path="orders" element={<PageSuspense><OrdersPage /></PageSuspense>} />
        <Route path="track-orders" element={<PageSuspense><OrdersPage /></PageSuspense>} />
        <Route path="profile" element={<PageSuspense><ProfilePage /></PageSuspense>} />
        <Route path="doctor-appointments" element={<PageSuspense><DoctorAppointmentsPage /></PageSuspense>} />
        <Route path="doctors/:doctorId/book" element={<PageSuspense><DoctorBookingPage /></PageSuspense>} />
        <Route path="lab-tests" element={<PageSuspense><LabTestsPage /></PageSuspense>} />
        <Route path="lab-tests/:testId/book" element={<PageSuspense><LabTestBookingPage /></PageSuspense>} />
        <Route path="labs/:labId" element={<PageSuspense><LabDetailsPage /></PageSuspense>} />
        
        {/* Auth page routed inside layout to preserve navigation bars */}
        <Route path="login" element={<PageSuspense><LoginPage /></PageSuspense>} />
      </Route>

      {/* 2. Super Admin Auth Public Routes */}
      <Route path="/admin/login" element={<PageSuspense><AdminLoginPage /></PageSuspense>} />
      <Route path="/admin/forgot-password" element={<PageSuspense><AdminForgotPasswordPage /></PageSuspense>} />
      <Route path="/admin/verify-otp" element={<PageSuspense><AdminVerifyOtpPage /></PageSuspense>} />
      <Route path="/admin/reset-password" element={<PageSuspense><AdminResetPasswordPage /></PageSuspense>} />

      {/* 3. Super Admin Module Protected Router */}
      <Route path="/admin" element={<PageSuspense><AdminLayout /></PageSuspense>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PageSuspense><AdminDashboard /></PageSuspense>} />
        <Route path="vendors" element={<PageSuspense><VendorManagement /></PageSuspense>} />
        <Route path="products" element={<PageSuspense><ProductManagement /></PageSuspense>} />
        <Route path="orders" element={<PageSuspense><OrdersManagement /></PageSuspense>} />
        <Route path="users" element={<PageSuspense><UsersManagement /></PageSuspense>} />
        <Route path="doctors" element={<PageSuspense><DoctorManagement /></PageSuspense>} />
        <Route path="lab-tests" element={<PageSuspense><LabTestsManagement /></PageSuspense>} />
        <Route path="cms" element={<PageSuspense><CMSManagement /></PageSuspense>} />
        <Route path="settings" element={<PageSuspense><SettingsPage /></PageSuspense>} />
      </Route>

      {/* 4. Multi-Vendor Auth Public Routes */}
      <Route path="/vendor/login" element={<PageSuspense><VendorLoginPage /></PageSuspense>} />
      <Route path="/vendor/signup" element={<PageSuspense><VendorSignupPage /></PageSuspense>} />
      <Route path="/vendor/forgot-password" element={<PageSuspense><VendorForgotPasswordPage /></PageSuspense>} />
      <Route path="/vendor/verify-otp" element={<PageSuspense><VendorVerifyOtpPage /></PageSuspense>} />
      <Route path="/vendor/onboarding-pending" element={<PageSuspense><OnboardingPending /></PageSuspense>} />

      {/* 5. Multi-Vendor Module Protected Router */}
      <Route path="/vendor" element={<PageSuspense><VendorLayout /></PageSuspense>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<PageSuspense><VendorDashboard /></PageSuspense>} />
        <Route path="products" element={<PageSuspense><VendorProductManagement /></PageSuspense>} />
        <Route path="orders" element={<PageSuspense><VendorOrdersManagement /></PageSuspense>} />
        <Route path="lab-tests" element={<PageSuspense><VendorLabTestsManagement /></PageSuspense>} />
        <Route path="appointments" element={<PageSuspense><VendorAppointmentsPage /></PageSuspense>} />
        <Route path="earnings" element={<PageSuspense><VendorEarnings /></PageSuspense>} />
        <Route path="profile" element={<PageSuspense><VendorProfile /></PageSuspense>} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export { PageSuspense };
