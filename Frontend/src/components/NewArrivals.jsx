import { useState, useEffect, useRef } from 'react'; // <-- IMPORT useRef
import { motion } from 'framer-motion';
import { getNewArrivals } from '../lib/api';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import SectionHeader from './SectionHeader';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // <-- IMPORT ICONS

const NewArrivals = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null); // <-- Ref to the scrolling div

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const newArrivals = await getNewArrivals();
        setShoes(newArrivals || []);
      } catch (err) {
        setError("Failed to fetch new arrivals.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShoes();
  }, []);

  // --- SCROLLING LOGIC ---
  const scroll = (direction) => {
    const { current } = scrollContainerRef;
    if (current) {
      // We calculate the scroll amount based on the width of one card + gap
      const scrollAmount = current.offsetWidth * 0.8; // Scroll by 80% of the visible container width
      current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="bg-(--surface-color)">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="flex justify-between items-center mb-8">
          <SectionHeader
            title="New Arrivals"
            subtitle="Fresh out of the box. Check out the latest styles."
          />
          {/* --- SCROLL BUTTONS --- */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => scroll('left')}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-(--border-color) bg-(--surface-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark) transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll('right')}
              className="h-10 w-10 flex items-center justify-center rounded-full border border-(--border-color) bg-(--surface-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark) transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        {error && <div className="text-center py-10 text-red-500">{error}</div>}

        <div className="mt-8 relative">
          {/* We attach the ref here */}
          <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-8 pb-8 scrollbar-hide">
            {isLoading 
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-72 flex-shrink-0">
                    <ProductCardSkeleton />
                  </div>
                ))
              : shoes.map((shoe) => (
                  <motion.div 
                    key={shoe._id} 
                    className="w-72 flex-shrink-0"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5 }}
                  >
                    <ProductCard shoe={shoe} />
                  </motion.div>
                ))
            }
          </div>
          <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-(--surface-color) pointer-events-none"></div>
          {/* Add a fade on the left side too for symmetry */}
          <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-(--surface-color) pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default NewArrivals;