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
const NavItem = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      className="relative px-3 py-2 text-sm font-medium text-(--text-color)/80 transition-colors hover:text-(--text-color)"
    >
      {({ isActive }) => (
        <>
          {children}
          {isActive && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-(--brand-color)"
              layoutId="underline"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
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
      className={`fixed top-0 left-0 right-0 z-50`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div 
        className={`container mx-auto flex h-16 items-center justify-between px-4 gap-4 rounded-b-2xl transition-all duration-300 ${
          showBackground || isMenuOpen 
            ? 'bg-(--surface-color)/80 backdrop-blur-lg border-x border-b border-(--border-color) shadow-lg' 
            : 'bg-transparent border-transparent'
        }`}
      >
        <div className="flex items-center gap-6">
          <Link to="/" className="text-2xl font-bold tracking-tighter text-(--brand-color) shrink-0 transition-transform hover:scale-105">
            KickVibe
          </Link>

          <nav className="hidden items-center text-sm font-medium md:flex">
            <NavItem to="/">Home</NavItem>
            {/* Mega Menu Trigger */}
            <div onMouseEnter={handleMenuEnter} onMouseLeave={handleMenuLeave}>
              <Link to="/products" className="flex items-center gap-1 px-3 py-2 text-(--text-color)/80 transition-colors hover:text-(--text-color)">
                Shop
                <ChevronDown size={16} className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-(--text-color)/50 pointer-events-none z-10" />
              <motion.input
                id="search-input"
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="relative pl-10 pr-4 py-2 text-sm rounded-full border border-(--border-color) bg-(--surface-color)/50 focus:border-(--brand-color) focus:bg-(--surface-color) focus:ring-1 focus:ring-(--brand-color) transition-all duration-300"
                animate={{ width: isSearchFocused ? 280 : 180 }}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-color)/40 text-xs flex items-center gap-1 pointer-events-none">
                <Command size={12} />K
              </div>
            </form>
          </div>

          {/* Theme Toggle */}
          <button onClick={toggleTheme} className="flex h-9 w-9 items-center justify-center rounded-full text-(--text-color)/70 hover:text-(--text-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark) shrink-0 transition-colors">
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          
          {/* Auth Buttons */}
          {isAuthenticated ? (
            <>
              <Link to="/account" className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-(--border-light) dark:hover:bg-(--border-dark) transition-colors group shrink-0">
                <img src={user.avatar} alt={user.fullName} className="h-7 w-7 rounded-full object-cover border border-(--border-color)" />
                <span className="text-sm font-medium max-w-[80px] truncate group-hover:text-(--brand-color)">{user.fullName.split(' ')[0]}</span>
              </Link>
              <button onClick={logout} className="flex h-9 w-9 items-center justify-center rounded-full text-(--text-color)/70 hover:text-red-500 hover:bg-(--border-light) dark:hover:bg-(--border-dark) shrink-0 transition-colors" title="Logout">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <Link to="/login" className="hidden sm:block text-sm font-medium px-3 py-2 rounded-full hover:text-(--brand-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark) transition-colors">
                Login
              </Link>
              <Link 
                to="/register" 
                className="rounded-full bg-(--brand-color) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Cart Link */}
<Link to="/cart" className="relative shrink-0 transition-colors">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-full text-(--text-color)/70 hover:text-(--brand-color) hover:bg-(--border-light) dark:hover:bg-(--border-dark)"
              animate={controls} // <-- Connect controls
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
            </motion.div>
            <AnimatePresence>
              {isAuthenticated && cartItemCount > 0 && (
                <motion.span
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-(--brand-color) text-xs font-bold text-white ring-2 ring-(--surface-color)"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  {cartItemCount}
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