import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import AdminLayout from './components/layouts/AdminLayout';
import SellerLayout from './components/layouts/SellerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PendingApproval from './pages/PendingApproval';

import HeroHeader from './components/HeroHeader';
import Features from './components/Features';
import ProductGrid from './components/ProductGrid';
import ArtisanSpotlight from './components/ArtisanSpotlight';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ArtisanOnboarding from './pages/ArtisanOnboarding';
import ArtisanDashboard from './pages/ArtisanDashboard';
import BuyerDashboard from './pages/BuyerDashboard';

import AdminLogin from './pages/AdminLogin';
import AdminSignup from './pages/AdminSignup';
import AdminDashboard from './pages/AdminDashboard';

import Discover from './pages/Discover';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ScrollToTop from './components/ScrollToTop';
import ArtisansDirectory from './pages/ArtisansDirectory';
import Heritage from './pages/Heritage';
import TruthMark from './pages/TruthMark';
import Wishlist from './pages/Wishlist';
import CraftMark from './pages/CraftMark';

// Temporary placeholder for routing until other pages are built
const PlaceholderPage = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center bg-earth-50 pt-20">
    <div className="text-center">
      <h1 className="text-4xl font-serif text-earth-900 mb-4">{title}</h1>
      <p className="text-earth-600">This section is being developed for the hackathon.</p>
    </div>
  </div>
);

import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';

function App() {
  return (
    <WishlistProvider>
    <CartProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Main Public / Buyer Navigation wrapped in MainLayout */}
          <Route element={<MainLayout />}>
            <Route path="/" element={
              <>
                <HeroHeader />
                <Features />
                <ProductGrid />
                <ArtisanSpotlight />
              </>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/join" element={<Login />} />
            <Route path="/pending" element={<PendingApproval />} />
            
            <Route path="/discover" element={<Discover />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/artisans" element={<ArtisansDirectory />} />
            <Route path="/heritage" element={<Heritage />} />
            <Route path="/truthmark" element={<TruthMark />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/craftmark" element={<CraftMark />} />
            <Route path="/schemegpt" element={<PlaceholderPage title="SchemeGPT Assistant" />} />

            <Route path="/buyer-dashboard" element={
              <ProtectedRoute allowedRoles={['buyer']}>
                <BuyerDashboard />
              </ProtectedRoute>
            } />
            {/* Alias fallback */}
            <Route path="/dashboard" element={<Navigate to="/buyer-dashboard" />} />
          </Route>

          {/* Dedicated Admin Portal Routes wrapped in AdminLayout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="login" element={<AdminLogin />} />
            <Route path="signup" element={<AdminSignup />} />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
          </Route>

          {/* Dedicated Seller Portal Routes */}
          <Route path="/seller" element={<SellerLayout />}>
            {/* Onboarding doesn't require active status so unapproved can fill profiles */}
            <Route path="onboarding" element={
              <ProtectedRoute allowedRoles={['artisan']}>
                <ArtisanOnboarding />
              </ProtectedRoute>
            } />
            <Route path="dashboard" element={
              <ProtectedRoute allowedRoles={['artisan']} requireActiveStatus={true}>
                <ArtisanDashboard />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Legacy fallback path handling */}
          <Route path="/onboarding" element={<Navigate to="/seller/onboarding" />} />
          <Route path="/artisan-dashboard" element={<Navigate to="/seller/dashboard" />} />

        </Routes>
      </Router>
    </CartProvider>
    </WishlistProvider>
  );
}

export default App;
