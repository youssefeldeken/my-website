import { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

// Fullscreen image viewer with keyboard + click navigation. Used for project
// cover/gallery images so visitors can click to expand and slide through
// screenshots instead of only seeing small fixed-size thumbnails.
export default function Lightbox({ images, index, onClose, onNavigate }) {
  const goNext = useCallback(() => onNavigate((index + 1) % images.length), [index, images.length, onNavigate]);
  const goPrev = useCallback(() => onNavigate((index - 1 + images.length) % images.length), [index, images.length, onNavigate]);

  useEffect(() => {
    if (index === null) return; // lightbox closed — don't touch page scroll at all

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [index, onClose, goNext, goPrev]);

  if (index === null || !images.length) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label="Image viewer"
      >
        <button
          onClick={onClose}
          aria-label="Close image viewer"
          className="absolute top-5 right-5 w-10 h-10 rounded-full glass flex items-center justify-center text-text hover:text-primary focus-ring z-10"
        >
          <X size={20} />
        </button>

        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
              className="absolute left-3 sm:left-6 w-11 h-11 rounded-full glass flex items-center justify-center text-text hover:text-primary focus-ring z-10"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
              className="absolute right-3 sm:right-6 w-11 h-11 rounded-full glass flex items-center justify-center text-text hover:text-primary focus-ring z-10"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}

        <motion.img
          key={images[index]}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          src={images[index]}
          alt={`Image ${index + 1} of ${images.length}`}
          onClick={(e) => e.stopPropagation()}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg shadow-2xl"
        />

        {images.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-muted glass px-3 py-1.5 rounded-full">
            {index + 1} / {images.length}
          </div>
        )}
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
