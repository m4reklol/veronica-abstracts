import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import Process from "./pages/Process";
import ScrollToTop from "./components/ScrollToTop";
import { CartProvider } from "./context/CartContext";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import Checkout from "./pages/Checkout";
import ThankYou from "./pages/ThankYou";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

function InnerApp() {
  const { language } = useLanguage();
  const isReady = !!language;

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    AOS.init({
      duration: 800,
      once: true,
      offset: isMobile ? 100 : 68,
    });
  }, []);

  if (!isReady) return <div className="loading">Načítání jazyka…</div>;

  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/process" element={<Process />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/create" element={<CreateProduct />} />
          <Route path="/admin/edit/:id" element={<EditProduct />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/thankyou" element={<ThankYou />} />
        </Routes>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

function App() {
  return (
    <CartProvider>
      <LanguageProvider>
        <InnerApp />
      </LanguageProvider>
    </CartProvider>
  );
}

export default App;