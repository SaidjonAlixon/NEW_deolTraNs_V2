import { useEffect } from 'react';
import AboutSection from '../sections/AboutSection';
import MissionVisionSection from '../sections/MissionVisionSection';
import CompanyHistorySection from '../sections/CompanyHistorySection';
import StrengthsSection from '../sections/StrengthsSection';
import WorkGallerySection from '../sections/WorkGallerySection';
import TechAdvantageSection from '../sections/TechAdvantageSection';

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#050810] min-h-screen">
            <AboutSection />
            <MissionVisionSection />
            <CompanyHistorySection />
            <StrengthsSection />
            <TechAdvantageSection />
            <WorkGallerySection />
        </div>
    );
}
