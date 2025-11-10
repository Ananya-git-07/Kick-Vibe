import { NavLink, Outlet } from 'react-router-dom';
import { User, Package, Heart, Lock } from 'lucide-react';

const sidebarLinks = [
  { to: '/account', label: 'Profile', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  // We will implement Wishlist page in Phase 2
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart }, 
  { to: '/account/security', label: 'Security', icon: Lock },
];

const AccountLayout = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-(--brand-color) text-white'
                        : 'text-(--text-color)/70 hover:bg-(--border-light) dark:hover:bg-(--border-dark) hover:text-(--text-color)'
                    }`
                  }
                >
                  <Icon size={18} />
                  {link.label}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          <div className="bg-(--surface-color) border border-(--border-color) rounded-lg p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountLayout;