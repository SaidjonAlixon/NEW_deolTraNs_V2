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
import Application from './pages/Application';
import ApplicationForm from './components/ApplicationForm';
import DriverApplicationModal from './components/DriverApplicationModal';

// Import Context (global driver application modal)
import { DriverApplicationProvider } from './context/DriverApplicationContext';
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

        {isApplyPage ? (
          <div
            className="fixed inset-0 z-[10040] overflow-hidden pointer-events-none select-none"
            aria-hidden
          >
            <div className="h-full w-full scale-[1.02] blur-[5px] brightness-[0.88]">
              <Home />
            </div>
          </div>
        ) : null}

        {/* Main content */}
        <main className="relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/apply" element={<Apply />} />
            <Route path="/application" element={<Application />} />
            <Route path="/test-upload" element={<ApplicationForm />} />
          </Routes>
        </main>

        {!isApplyPage ? (
          <div className="relative z-[120]">
            <Footer />
          </div>
        ) : null}

        <DriverApplicationModal />
      </div>
    </DriverApplicationProvider>
  );
}

export default App;
