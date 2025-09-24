import { Link } from 'react-router-dom';
import { Sun, Moon, LogOut } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Button from './Button';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 border-(--border-color) border-b bg-(--surface-color)/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tighter text-(--brand-color)">
          KickVibe
        </Link>

        {/* Navigation Links */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="transition-colors hover:text-(--brand-color)">
            Home
          </Link>
          <Link to="/products" className="transition-colors hover:text-(--brand-color)">
            All Products
          </Link>
          <Link to="/products/sneakers" className="transition-colors hover:text-(--brand-color)">
            Sneakers
          </Link>
          <Link to="/products/boots" className="transition-colors hover:text-(--brand-color)">
            Boots
          </Link>
          <Link to="/products/sandals" className="transition-colors hover:text-(--brand-color)">
            Sandals
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border-color) transition-colors hover:bg-(--border-color)"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          
          {isAuthenticated ? (
            // --- If user IS logged in ---
            <>
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-(--brand-color) flex items-center gap-2">
                <img src={user.avatar} alt={user.fullName} className="h-7 w-7 rounded-full object-cover" />
                <span>Hi, {user.fullName.split(' ')[0]}</span>
              </Link>
              
              <Button onClick={logout} variant="secondary" className="px-3 py-2">
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            // --- If user is NOT logged in ---
            <>
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-(--brand-color)">
                Login
              </Link>
              <Link 
                to="/register" 
                className="rounded-md bg-(--brand-color) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Sign Up
              </Link>
            </>
          )}
          
          {/* Cart Link */}
          <Link 
            to="/cart" 
            className="relative rounded-md bg-(--brand-color) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Cart
            {isAuthenticated && cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;