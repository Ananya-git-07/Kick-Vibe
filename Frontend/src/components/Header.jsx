import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, Search, Heart } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import Button from './Button';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const { cartItemCount } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery.trim()}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-50 border-(--border-color) border-b bg-(--surface-color)/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="text-2xl font-bold tracking-tighter text-(--brand-color)">
          KickVibe
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/" className="transition-colors hover:text-(--brand-color)">Home</Link>
          <Link to="/products" className="transition-colors hover:text-(--brand-color)">All Products</Link>
        </nav>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-(--text-color)/50" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-(--border-color) bg-(--surface-color) pl-9 pr-3 py-2 text-sm h-9"
            />
          </form>

          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border-color) transition-colors hover:bg-(--border-color)"
            aria-label="Toggle theme"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </button>
          
          {isAuthenticated ? (
            <>
              <Link to="/wishlist" className="flex h-9 w-9 items-center justify-center rounded-full border border-(--border-color) transition-colors hover:bg-(--border-color)" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>
              <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-(--brand-color) flex items-center gap-2">
                <img src={user.avatar} alt={user.fullName} className="h-7 w-7 rounded-full object-cover" />
                <span>Hi, {user.fullName.split(' ')[0]}</span>
              </Link>
              <Button onClick={logout} variant="secondary" className="px-3 py-2 text-xs">
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium transition-colors hover:text-(--brand-color)">Login</Link>
              <Button to="/register">Sign Up</Button>
            </>
          )}
          
          <Link to="/cart" className="relative flex items-center justify-center rounded-md bg-(--brand-color) px-4 h-9 text-sm font-medium text-white transition-opacity hover:opacity-90">
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