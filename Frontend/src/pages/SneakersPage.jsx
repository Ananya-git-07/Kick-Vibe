import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAllShoes } from '../lib/api';
import ProductCard from '../components/ProductCard';
import ProductCardSkeleton from '../components/ProductCardSkeleton';
import PageWrapper from '../components/PageWrapper';

const SneakersPage = () => {
  const [shoes, setShoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchSneakers = async () => {
      try {
        const response = await getAllShoes({ category: 'sneakers' });
        setShoes(response?.shoes || []);
      } catch (err) {
        setError("Failed to fetch sneakers.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSneakers();
  }, []);

  const sortedShoes = [...shoes].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      default:
        return 0;
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <PageWrapper>
      <div className="relative min-h-screen">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-(--surface-color) py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/4 via-transparent to-(--brand-secondary)/4" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl font-black tracking-tighter sm:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-(--brand-color) via-(--brand-secondary) to-(--brand-color) bg-clip-text text-transparent">
                  Premium Sneakers
                </span>
              </h1>
              <p className="mt-6 text-lg text-(--text-color)/85 leading-relaxed">
                Discover our curated collection of high-performance and stylish sneakers. From athletic to lifestyle, find the perfect pair for every occasion.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="container mx-auto px-4 py-16 bg-(--bg-color)">
          {error && (
            <div className="text-center py-10 text-red-500 text-lg font-semibold">
              {error}
            </div>
          )}
          
          {!error && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex items-center justify-between flex-wrap gap-4"
              >
                <p className="text-lg text-(--text-color)/75">
                  {isLoading ? 'Loading...' : `${shoes.length} ${shoes.length === 1 ? 'sneaker' : 'sneakers'} available`}
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm font-semibold text-(--text-color)">Sort by:</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border-2 border-(--border-color) bg-(--surface-color) text-(--text-color) text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-(--brand-color) transition-all cursor-pointer hover:border-(--brand-color) shadow-sm"
                    style={{
                      colorScheme: 'light dark'
                    }}
                  >
                    <option value="featured" className="bg-(--surface-color) text-(--text-color)">Featured</option>
                    <option value="price-low" className="bg-(--surface-color) text-(--text-color)">Price: Low to High</option>
                    <option value="price-high" className="bg-(--surface-color) text-(--text-color)">Price: High to Low</option>
                    <option value="name-asc" className="bg-(--surface-color) text-(--text-color)">Name: A to Z</option>
                    <option value="name-desc" className="bg-(--surface-color) text-(--text-color)">Name: Z to A</option>
                    <option value="rating" className="bg-(--surface-color) text-(--text-color)">Highest Rated</option>
                  </select>
                </div>
              </motion.div>

              <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                {isLoading 
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <ProductCardSkeleton key={i} />
                    ))
                  : sortedShoes.map((shoe) => (
                      <ProductCard key={shoe._id} shoe={shoe} />
                    ))
                }
              </div>

              {!isLoading && shoes.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="text-6xl mb-4">👟</div>
                  <h3 className="text-2xl font-bold text-(--text-color) mb-2">No Sneakers Found</h3>
                  <p className="text-(--text-color)/70">Check back soon for new arrivals!</p>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </PageWrapper>
  );
};

export default SneakersPage;
