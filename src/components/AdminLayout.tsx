import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Package, Image, MessageSquare, LogOut, Settings } from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'დეშბორდი' },
  { to: '/admin/products', icon: Package, label: 'პროდუქტები' },
  { to: '/admin/messages', icon: MessageSquare, label: 'შეტყობინებები' },
];

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 hidden md:flex">
        <div className="p-4 border-b border-border">
          <Link to="/admin/dashboard" className="text-lg font-bold">
            <span className="text-gold-gradient">Elite</span> Works
          </Link>
          <p className="text-xs text-muted-foreground mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {sidebarLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-gold/10 text-gold'
                  : 'text-foreground/70 hover:text-foreground hover:bg-muted'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <p className="text-xs text-muted-foreground px-3 mb-2 truncate">{user?.email}</p>
          <button
            onClick={signOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut size={18} />
            გასვლა
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-gold-gradient">Admin</span>
        <div className="flex gap-2">
          {sidebarLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`p-2 rounded-lg ${
                location.pathname === link.to ? 'bg-gold/10 text-gold' : 'text-foreground/70'
              }`}
            >
              <link.icon size={18} />
            </Link>
          ))}
          <button onClick={signOut} className="p-2 rounded-lg text-foreground/70 hover:text-destructive">
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 p-6 md:p-8 mt-14 md:mt-0 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
