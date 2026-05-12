import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GalleryImage {
  url: string;
  category: string;
  caption: string;
}

interface FreightGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  images: GalleryImage[];
}

export default function FreightGalleryModal({ isOpen, onClose, title, images }: FreightGalleryModalProps) {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    onClose();
    navigate('/apply');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 lg:p-8"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-app-deep/95 backdrop-blur-md" onClick={onClose} />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-[1200px] max-h-[90vh] bg-app border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5 bg-surface/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Camera className="w-4 h-4 text-orange" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-orange">Portfolio Gallery</span>
                </div>
                <h3 className="text-2xl font-bold text-white font-heading">{title} - Load Showcase</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Content */}
            <div className="flex-grow overflow-y-auto p-6 lg:p-8 custom-scrollbar">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-surface border border-white/5"
                  >
                    <img 
                      src={img.url} 
                      alt={img.caption}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-app-deep via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <p className="text-[10px] font-mono text-orange uppercase tracking-wider mb-1">{img.category}</p>
                      <p className="text-sm font-semibold text-white">{img.caption}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty state fallback */}
              {images.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                    <Camera className="w-10 h-10 text-white/20" />
                  </div>
                  <p className="text-gray-400">Loading gallery images...</p>
                </div>
              )}
            </div>

            {/* Footer / CTA */}
            <div className="p-6 border-t border-white/5 bg-surface/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-sm max-w-md text-center sm:text-left">
                Want to haul these types of loads? Join DELO TRANS INC today for consistent miles and premium pay.
              </p>
              <div className="flex gap-3">
                <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors">
                  Close Gallery
                </button>
                <button onClick={handleApplyNow} className="px-6 py-2.5 rounded-xl bg-orange text-white text-sm font-bold hover:bg-orange-dark transition-all flex items-center gap-2">
                  Apply Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
