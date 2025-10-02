import { NavLink, Outlet } from 'react-router-dom';
import { User, ShoppingBag, Lock } from 'lucide-react';

const DashboardPage = () => {
  const commonClasses = "flex items-center gap-3 rounded-lg px-3 py-2 text-(--text-color)/80 transition-all hover:text-(--text-color)";
  const activeClasses = "bg-(--border-light) dark:bg-(--border-dark) text-(--text-color)";

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid min-h-[calc(100vh-20rem)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] gap-8">
        <div className="hidden border-r border-(--border-color) md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 sticky top-24">
            <div className="flex-1">
              <nav className="grid items-start gap-2 text-sm font-medium">
                <NavLink
                  to="/dashboard/profile"
                  className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </NavLink>
                <NavLink
                  to="/dashboard/orders"
                  className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}
                >
                  <ShoppingBag className="h-4 w-4" />
                  My Orders
                </NavLink>
                <NavLink
                  to="/dashboard/security"
                  className={({ isActive }) => `${commonClasses} ${isActive ? activeClasses : ''}`}
                >
                  <Lock className="h-4 w-4" />
                  Security
                </NavLink>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <Outlet /> {/* This will render the nested route components */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;