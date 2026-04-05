import { useEffect } from 'react';
import CareersSection from '../sections/CareersSection';
import DriverBenefitsSection from '../sections/DriverBenefitsSection';
import DriverRequirementsSection from '../sections/DriverRequirementsSection';
import ApplicationProcessSection from '../sections/ApplicationProcessSection';

export default function Drivers() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="bg-app min-h-screen">
            <CareersSection />
            <DriverBenefitsSection />
            <DriverRequirementsSection />
            <ApplicationProcessSection />
        </div>
    );
}
