import { useEffect } from 'react';
import AboutSection from '../sections/AboutSection';
import MissionVisionSection from '../sections/MissionVisionSection';
import CompanyHistorySection from '../sections/CompanyHistorySection';
import TeamSection from '../sections/TeamSection';

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-[#0A0F1C] min-h-screen">
            <AboutSection />
            <MissionVisionSection />
            <CompanyHistorySection />
            <TeamSection />
        </div>
    );
}
