import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion'; // <-- IMPORT useAnimation
import { Sun, Moon, LogOut, Search, Command, ChevronDown } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useScrollPosition } from '../hooks/useScrollPosition';
import MegaMenu from './MegaMenu';

// Custom NavLink component for the animated underline effect
const NavItem = ({ to, children, exact = false }) => {
  return (
    <NavLink
      to={to}
      end={exact}
      className="relative px-4 py-2 text-sm font-semibold text-(--text-color)/70 transition-all duration-300 hover:text-(--text-color) group"
    >
      {({ isActive }) => (
        <>
          <span className={`relative z-10 ${isActive ? 'text-(--brand-color)' : ''}`}>{children}</span>
          {isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-(--brand-color) via-(--brand-secondary) to-(--brand-color) rounded-full"
              layoutId="underline"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          {!isActive && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) rounded-full transition-all duration-300 group-hover:w-full" />
          )}
        </>
      )}
    </NavLink>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuCloseTimer = useRef(null); // useRef to hold the timer ID

  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const controls = useAnimation(); // <-- Animation controls for the cart
  const isInitialMount = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    controls.start({
      scale: [1, 1.3, 1],
      rotate: [0, -15, 15, 0],
      transition: { duration: 0.5, ease: 'easeInOut' },
    });
  }, [cartItemCount, controls]);
  // Show a solid background when scrolling down or when the menu is open
  const showBackground = scrollPosition > 50;

  // Robust hover logic with a timer to prevent the menu from closing prematurely
  const handleMenuEnter = () => {
    clearTimeout(menuCloseTimer.current);
    setIsMenuOpen(true);
  };
  const handleMenuLeave = () => {
    menuCloseTimer.current = setTimeout(() => {
      setIsMenuOpen(false);
    }, 200); // 200ms delay gives the user time to move their mouse to the menu
  };

  // Handle Ctrl+K keyboard shortcut for focusing the search bar
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        document.getElementById('search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle search form submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      document.getElementById('search-input')?.blur();
    }
  };
  
  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div 
        className={`container mx-auto flex h-16 items-center justify-between px-6 gap-4 rounded-2xl transition-all duration-500 ${
          showBackground || isMenuOpen 
            ? 'glass border border-(--border-color)/50 shadow-xl shadow-black/5 dark:shadow-black/20' 
            : 'bg-(--surface-color)/40 backdrop-blur-sm border border-transparent hover:border-(--border-color)/30'
        }`}
      >
        <div className="flex items-center gap-6">
          <Link to="/" className="group shrink-0">
            <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-(--brand-color) via-(--brand-secondary) to-(--brand-color) bg-clip-text text-transparent bg-[length:200%_auto] transition-all duration-500 group-hover:animate-[gradient_2s_linear_infinite] inline-block group-hover:scale-105">
              KickVibe
            </span>
          </Link>

          <nav className="hidden items-center text-sm font-medium lg:flex">
            <NavItem to="/" exact>Home</NavItem>
            {/* Mega Menu Trigger */}
            <div onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
              <Link to="/products" className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-(--text-color)/70 transition-all duration-300 hover:text-(--text-color) group">
                <span className="relative z-10">Shop</span>
                <ChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
                {!isMenuOpen && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-0 bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) rounded-full transition-all duration-300 group-hover:w-full" />
                )}
              </Link>
            </div>
            <NavItem to="/sneakers">Sneakers</NavItem>
            <NavItem to="/boots">Boots</NavItem>
            <NavItem to="/sandals">Sandals</NavItem>
            {isAuthenticated && <NavItem to="/account/orders">Orders</NavItem>}
            {isAuthenticated && <NavItem to="/account/wishlist">Wishlist</NavItem>}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <motion.div
                animate={{ 
                  scale: isSearchFocused ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-(--text-color)/50 pointer-events-none z-10" />
                <motion.input
                  id="search-input"
                  type="search"
                  placeholder="Search for shoes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="relative pl-11 pr-16 py-2.5 text-sm rounded-full border-2 glass transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: isSearchFocused ? 'var(--brand-color)' : 'var(--border-color)',
                    boxShadow: isSearchFocused ? '0 0 0 3px oklch(from var(--brand-color) l c h / 0.1)' : 'none'
                  }}
                  animate={{ width: isSearchFocused ? 300 : 200 }}
                />
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs flex items-center gap-1 px-1.5 py-0.5 rounded border border-(--border-color) bg-(--bg-color)/50 transition-opacity ${
                  isSearchFocused ? 'opacity-0' : 'opacity-100'
                }`}>
                  <Command size={10} />
                  <span className="text-(--text-color)/60 font-medium">K</span>
                </div>
              </motion.div>
            </form>
          </div>

          {/* Theme Toggle */}
          <motion.button 
            onClick={toggleTheme} 
            className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border-color)/50 text-(--text-color)/70 hover:text-(--brand-color) hover:border-(--brand-color) glass shrink-0 transition-all duration-300 hover:shadow-lg hover:shadow-(--brand-color)/20"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all duration-500 dark:-rotate-180 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-180 scale-0 transition-all duration-500 dark:rotate-0 dark:scale-100" />
          </motion.button>
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <>
              <Link to="/account" className="hidden sm:flex items-center gap-2 pl-2 pr-4 py-1.5 rounded-full border border-(--border-color)/50 glass hover:border-(--brand-color) transition-all duration-300 group shrink-0 hover:shadow-lg hover:shadow-(--brand-color)/10">
                <div className="relative">
                  <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-full object-cover ring-2 ring-(--border-color) group-hover:ring-(--brand-color) transition-all duration-300" />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-(--surface-color)"></span>
                </div>
                <span className="text-sm font-semibold max-w-[80px] truncate group-hover:text-(--brand-color) transition-colors">{user.fullName.split(' ')[0]}</span>
              </Link>
              <motion.button 
                onClick={logout} 
                className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border-color)/50 text-(--text-color)/70 hover:text-red-500 hover:border-red-500 glass shrink-0 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20" 
                title="Logout"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="h-5 w-5" />
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <Link 
                to="/login" 
                className="hidden sm:block text-sm font-semibold px-5 py-2 rounded-full border border-(--border-color)/50 glass hover:border-(--brand-color) hover:text-(--brand-color) transition-all duration-300 hover:shadow-lg hover:shadow-(--brand-color)/10"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="relative overflow-hidden rounded-full bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg hover:shadow-(--brand-color)/40 hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700"
              >
                <span className="relative z-10">Sign Up</span>
              </Link>
            </div>
          )}
          
          {/* Cart Link */}
          <Link to="/cart" className="relative shrink-0">
            <motion.div
              className="flex h-10 w-10 items-center justify-center rounded-full border border-(--border-color)/50 text-(--text-color)/70 hover:text-(--brand-color) hover:border-(--brand-color) glass transition-all duration-300 hover:shadow-lg hover:shadow-(--brand-color)/20"
              animate={controls}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </motion.div>
            <AnimatePresence>
              {isAuthenticated && cartItemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) text-xs font-bold text-white ring-2 ring-(--surface-color) shadow-lg shadow-(--brand-color)/40"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0, rotate: 180 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                >
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && <MegaMenu onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave} />}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;