import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductCardSkeleton from './ProductCardSkeleton';
import SectionHeader from './SectionHeader';
import { getFeaturedShoes } from '../lib/api';

const FeaturedProducts = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const featuredShoes = await getFeaturedShoes();
        setShoes(featuredShoes || []);
      } catch (err) {
        setError("Failed to fetch featured products.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchShoes();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="bg-(--bg-color)">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <SectionHeader
          title="Featured Kicks"
          subtitle="Handpicked styles, just for you. Check out what's trending and make a statement."
        />

        {error && <div className="text-center py-10 text-red-500">{error}</div>}
        
        <motion.div
          className="mt-16 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {isLoading 
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : shoes.map((shoe) => (
                <motion.div key={shoe._id} variants={itemVariants}>
                  <ProductCard shoe={shoe} />
                </motion.div>
              ))
          }
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturedProducts;