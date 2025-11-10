import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

const sidebarLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { to: '/admin/users', label: 'Users', icon: Users },
];

const AdminLayout = () => {
  return (
    <PageWrapper>
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-(--surface-color) border-r border-(--border-color)">
          <div className="p-4">
            <h2 className="text-xl font-bold text-(--brand-color)">Admin Panel</h2>
          </div>
          <nav className="flex flex-col p-4 space-y-1">
            {sidebarLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-(--brand-color) text-white'
                      : 'text-(--text-color)/70 hover:bg-(--border-light) dark:hover:bg-(--border-dark) hover:text-(--text-color)'
                  }`
                }
              >
                <link.icon size={18} />
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-(--bg-color)">
          <Outlet />
        </main>
      </div>
    </PageWrapper>
  );
};
export default AdminLayout;