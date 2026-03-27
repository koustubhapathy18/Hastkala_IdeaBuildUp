import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroHeader from './components/HeroHeader';
import Features from './components/Features';
import ProductGrid from './components/ProductGrid';
import ArtisanSpotlight from './components/ArtisanSpotlight';
import Footer from './components/Footer';
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
        <div className="min-h-screen flex flex-col font-sans bg-earth-50 text-earth-900 selection:bg-terracotta-200 selection:text-terracotta-900">
          <Navbar />
          
          <main className="flex-grow">
            <Routes>
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
              <Route path="/onboarding" element={<ArtisanOnboarding />} />
              <Route path="/buyer-dashboard" element={<BuyerDashboard />} />
              <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
              <Route path="/dashboard" element={<ArtisanDashboard />} />

              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/signup" element={<AdminSignup />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />

              <Route path="/discover" element={<Discover />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/artisans" element={<ArtisansDirectory />} />
              <Route path="/heritage" element={<Heritage />} />
              <Route path="/truthmark" element={<TruthMark />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/join" element={<Login />} />
              <Route path="/womencraft" element={<PlaceholderPage title="WomenCraft Direct" />} />
              <Route path="/schemegpt" element={<PlaceholderPage title="SchemeGPT Assistant" />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </Router>
    </CartProvider>
    </WishlistProvider>
  );
}

export default App;
