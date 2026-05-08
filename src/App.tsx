import { useEffect, useRef } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './App.css';

// Import sections (components)
import Header from './components/Header';
import Footer from './sections/Footer';

// Import pages
import Home from './pages/Home';
import About from './pages/About';
import Drivers from './pages/Drivers';
import Contact from './pages/Contact';
import Apply from './pages/Apply';
import ApplicationForm from './components/ApplicationForm';

// Import Context/Modal
import { DriverApplicationProvider } from './context/DriverApplicationContext';
import DriverApplicationModal from './components/DriverApplicationModal';
import TelLinkDataLayerTracking from './components/TelLinkDataLayerTracking';

gsap.registerPlugin(ScrollTrigger);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const mainRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();
  const isApplyPage = pathname === '/apply';

  return (
    <DriverApplicationProvider>
      <div ref={mainRef} className="relative bg-app min-h-screen">
        <ScrollToTop />
        <TelLinkDataLayerTracking />
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {!isApplyPage ? <Header /> : null}

        {/* Global Modal */}
        {!isApplyPage ? <DriverApplicationModal /> : null}

        {/* Main content */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/test-upload" element={<ApplicationForm />} />
          </Routes>
        </main>

        {!isApplyPage ? (
          <div className="relative z-[120]">
            <Footer />
          </div>
        ) : null}
      </div>
    </DriverApplicationProvider>
  );
}

export default App;
