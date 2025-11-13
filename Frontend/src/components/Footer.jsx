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
    <footer className="relative bg-(--surface-color) border-t border-(--border-color) overflow-hidden">
      {/* Gradient decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-(--brand-color)/5 via-transparent to-(--brand-secondary)/5 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Logo and Newsletter Section */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2 mb-8 lg:mb-0">
            <Link to="/" className="inline-block">
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-(--brand-color) via-(--brand-secondary) to-(--brand-color) bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                KickVibe
              </span>
            </Link>
            <p className="mt-4 text-base text-(--text-color)/70 max-w-sm leading-relaxed">
              Your destination for the latest and greatest in footwear. Find your perfect stride with us.
            </p>
            <form className="mt-6 flex gap-2 max-w-sm">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow w-full px-4 py-3 border-2 border-(--border-color) bg-(--bg-color) rounded-xl focus:outline-none focus:ring-2 focus:ring-(--brand-color) focus:border-(--brand-color) transition-all duration-300 sm:text-sm"
              />
              <button 
                type="submit" 
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-(--brand-color) to-(--brand-secondary) text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-(--brand-color)/40 hover:-translate-y-0.5 active:translate-y-0"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Link Sections */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-color) mb-1">Shop</h3>
            <ul className="mt-4 space-y-3">
              {shopLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-all duration-300 hover:translate-x-1 inline-block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-color) mb-1">About</h3>
            <ul className="mt-4 space-y-3">
              {aboutLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-all duration-300 hover:translate-x-1 inline-block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-(--text-color) mb-1">Legal</h3>
            <ul className="mt-4 space-y-3">
              {legalLinks.map(link => (
                <li key={link.name}>
                  <Link to={link.href} className="text-(--text-color)/70 hover:text-(--brand-color) transition-all duration-300 hover:translate-x-1 inline-block">{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-(--border-color) flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-(--text-color)/60 font-medium">© {new Date().getFullYear()} KickVibe. All rights reserved.</p>
          <div className="flex gap-4">
            <a 
              href="#" 
              className="p-2.5 rounded-full border border-(--border-color) text-(--text-color)/60 hover:text-white hover:bg-(--brand-color) hover:border-(--brand-color) transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-(--brand-color)/30"
              aria-label="Twitter"
            >
              <Twitter size={18} />
            </a>
            <a 
              href="#" 
              className="p-2.5 rounded-full border border-(--border-color) text-(--text-color)/60 hover:text-white hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-pink-500/30"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a 
              href="#" 
              className="p-2.5 rounded-full border border-(--border-color) text-(--text-color)/60 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-600/30"
              aria-label="Facebook"
            >
              <Facebook size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;