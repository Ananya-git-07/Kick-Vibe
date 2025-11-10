import { Link } from 'react-router-dom';
import { Twitter, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const shopLinks = [
    { name: 'Sneakers', href: '/products?category=sneakers' },
    { name: 'Boots', href: '/products?category=boots' },
    { name: 'Sandals', href: '/products?category=sandals' },
    { name: 'New Arrivals', href: '/products' },
  ];
  const aboutLinks = [
    { name: 'Our Story', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Press', href: '#' },
  ];
  const legalLinks = [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Returns', href: '#' },
  ];

  return (
    <footer className="bg-(--surface-color) border-t border-(--border-color)">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Newsletter Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-8 lg:mb-0">
            <Link to="/" className="text-3xl font-bold tracking-tighter text-(--brand-color)">
              KickVibe
            </Link>
            <p className="mt-4 text-base text-(--text-color)/70 max-w-sm">
              Your destination for the latest and greatest in footwear. Find your perfect stride with us.
            </p>
            <form className="mt-6 flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow w-full px-4 py-2 border border-(--border-color) bg-(--bg-color) rounded-md focus:outline-none focus:ring-2 focus:ring-(--brand-color) sm:text-sm"
              />
              <button type="submit" className="px-4 py-2 rounded-md bg-(--brand-color) text-white font-medium transition-opacity hover:opacity-90">
                Subscribe
              </button>
            </form>
          </div>

          {/* Link Sections */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Shop</h3>
            <ul className="mt-4 space-y-2">
              {shopLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">About</h3>
            <ul className="mt-4 space-y-2">
              {aboutLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Legal</h3>
            <ul className="mt-4 space-y-2">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-colors">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-(--border-color) flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-(--text-color)/60">© {new Date().getFullYear()} KickVibe. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="text-(--text-color)/60 hover:text-(--brand-color) transition-colors"><Twitter /></a>
            <a href="#" className="text-(--text-color)/60 hover:text-(--brand-color) transition-colors"><Instagram /></a>
            <a href="#" className="text-(--text-color)/60 hover:text-(--brand-color) transition-colors"><Facebook /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;