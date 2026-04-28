import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Plus,
  FileText,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Add Stock', icon: Plus, path: '/add-stock' },
  { label: 'Reports', icon: FileText, path: '/reports' },
//   { label: 'Settings', icon: Settings, path: '/settings' },
];

const Logo = () => (
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center w-7 h-7 bg-gray-900 rounded-lg">
      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 008 20C19 20 22 3 22 3c-1 2-8 2-12 4z"/>
      </svg>
    </div>
    <span className="text-sm font-semibold text-gray-900">FreshTrack</span>
  </div>
);

const NavItems = ({ onNavigate }) => (
  <nav className="px-3 py-4 space-y-0.5 flex-1">
    {navItems.map(({ label, icon: Icon, path }) => (
      <NavLink
        key={path}
        to={path}
        onClick={onNavigate}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
              ? 'bg-gray-900 text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`
        }
      >
        <Icon className="w-4 h-4 shrink-0" />
        {label}
      </NavLink>
    ))}
  </nav>
);

const LogoutButton = ({ onLogout }) => (
  <div className="px-3 py-4 border-t border-gray-100">
    <button
      onClick={onLogout}
      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors w-full"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      Logout
    </button>
  </div>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-gray-200 fixed top-0 left-0 h-screen z-30">
        <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
          <Logo />
        </div>
        <NavItems onNavigate={undefined} />
        <LogoutButton onLogout={handleLogout} />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 flex items-center justify-between px-4 h-14">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`md:hidden fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <Logo />
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
        <NavItems onNavigate={() => setMobileOpen(false)} />
        <div className="absolute bottom-0 left-0 right-0">
          <LogoutButton onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
};

export default Sidebar;