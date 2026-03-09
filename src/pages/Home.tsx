import HeroSection from '../sections/HeroSection';
import ServicesSection from '../sections/ServicesSection';
import FleetSection from '../sections/FleetSection';
import CoverageSection from '../sections/CoverageSection';
import SafetySection from '../sections/SafetySection';
import TestimonialsSection from '../sections/TestimonialsSection';
import ProcessSection from '../sections/ProcessSection';
import QuoteSection from '../sections/QuoteSection';
import ContactSection from '../sections/ContactSection';

export default function Home() {
    return (
        <>
            <HeroSection />
            <ServicesSection />
            <FleetSection />
            <CoverageSection />
            <SafetySection />
            <TestimonialsSection />
            <ProcessSection />
            <QuoteSection />
            <ContactSection />
        </>
    );
}
