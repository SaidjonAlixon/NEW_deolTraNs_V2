import { useEffect } from 'react';
import DriverApplicationModal from '../components/DriverApplicationModal';

export default function Application() {
  useEffect(() => {
    document.title = 'Driver Application | DELO TRANS INC';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col items-center px-4 py-8 sm:py-12">
      <DriverApplicationModal embedded />
    </div>
  );
}
