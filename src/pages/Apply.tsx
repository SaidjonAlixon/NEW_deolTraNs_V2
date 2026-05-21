import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DriverApplicationModal from '../components/DriverApplicationModal';

/** Full driver application (4 steps) — opened via Apply Now → /apply */
export default function Apply() {
  useEffect(() => {
    document.title = 'Driver Application — Delo Trans';
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 z-[10050] bg-black/55 backdrop-blur-md" aria-hidden />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[10051] flex items-center justify-center p-4 sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-xl"
        >
          <DriverApplicationModal embedded />
        </motion.div>
      </motion.div>
    </>
  );
}
