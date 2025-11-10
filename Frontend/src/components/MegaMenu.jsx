import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CATEGORIES, BRANDS } from '../lib/constants';
import { ArrowRight } from 'lucide-react';

// Accept hover handlers as props
const MegaMenu = ({ onMouseEnter, onMouseLeave }) => {
  return (
    <motion.div
      // Attach hover handlers to the menu itself
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // Position relative to the viewport/fixed header. `top-16` is the header's height.
      className="absolute top-16 left-0 right-0 w-full bg-(--surface-color) shadow-2xl border-b border-(--border-color)"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      {/* Inner container for alignment */}
      <div className="container mx-auto grid grid-cols-4 gap-8 px-4 py-8">
        {/* Column 1: Categories */}
        <div className="space-y-4">
          <h3 className="font-bold text-(--brand-color) uppercase tracking-wider text-sm">Shop by Category</h3>
          <ul className="space-y-2">
            {CATEGORIES.map(cat => (
              <li key={cat.slug}>
                <Link to={`/products?category=${cat.slug}`} className="block text-(--text-color)/80 hover:text-(--text-color) hover:pl-1 transition-all">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Column 2: Brands */}
        <div className="space-y-4">
          <h3 className="font-bold text-(--brand-color) uppercase tracking-wider text-sm">Shop by Brand</h3>
          <ul className="space-y-2">
            {BRANDS.map(brand => (
              <li key={brand.slug}>
                <Link to={`/products?brand=${brand.slug}`} className="block text-(--text-color)/80 hover:text-(--text-color) hover:pl-1 transition-all">
                  {brand.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 & 4: Featured Product */}
        <div className="col-span-2 bg-(--bg-color) rounded-xl p-6 flex items-center gap-6 group">
          <img 
            src="/white.png" 
            alt="Featured Product"
            className="w-1/2 h-auto object-cover -rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-transform duration-500 ease-in-out"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-(--text-color)/60">Featured</p>
            <h3 className="text-xl font-bold mt-1">Vibe Cityscape Casual</h3>
            <p className="text-sm text-(--text-color)/70 mt-2">Your go-to shoe for everyday style, combining comfort and a classic silhouette.</p>
            <Link to="/product/664e16d008fc610330a13898" className="inline-flex items-center gap-2 mt-4 font-semibold text-(--brand-color)">
              Shop Now <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MegaMenu;