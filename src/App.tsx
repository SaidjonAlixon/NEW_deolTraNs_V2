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
import ApplicationForm from './components/ApplicationForm';

// Import Context/Modal
import { DriverApplicationProvider } from './context/DriverApplicationContext';
import DriverApplicationModal from './components/DriverApplicationModal';

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

  return (
    <DriverApplicationProvider>
      <div ref={mainRef} className="relative bg-navy-900 min-h-screen">
        <ScrollToTop />
        {/* Grain overlay */}
        <div className="grain-overlay" />

        {/* Header */}
        <Header />

        {/* Global Modal */}
        <DriverApplicationModal />

        {/* Main content */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/test-upload" element={<ApplicationForm />} />
          </Routes>
        </main>

        {/* Footer */}
        <div className="relative z-[120]">
          <Footer />
        </div>
      </div>
    </DriverApplicationProvider>
  );
}

export default App;
