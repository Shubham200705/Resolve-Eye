import { NavLink, Link } from 'react-router-dom';
import { useAppStore } from '@/store/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Home,
  Compass,
  FilePlus,
  Inbox,
  Building2,
  Bell,
  User,
  Eye,
  Plus,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Home', icon: Home },
  { to: '/explore', label: 'Explore', icon: Compass },
  { to: '/my-issues', label: 'My Issues', icon: Inbox },
  { to: '/management', label: 'Authorities', icon: Building2 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/profile', label: 'Profile', icon: User },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { unreadCount } = useAppStore();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-navy text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Logo */}
        <div className="px-6 py-6 flex items-center gap-3 border-b border-white/10">
          <Link to="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
              <Eye className="h-5 w-5 text-sky" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight leading-none">ResolveEye</h1>
              <p className="text-xs text-white/50 mt-0.5">Resolution over reviews</p>
            </div>
          </Link>
        </div>

        {/* Report CTA */}
        <div className="px-4 pt-5 pb-3">
          <Link to="/report" onClick={onClose}>
            <Button className="w-full bg-sky hover:bg-sky/90 text-white font-semibold gap-2 h-11 rounded-xl">
              <Plus className="h-4.5 w-4.5" />
              Report an Issue
            </Button>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  )
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5" />
                  {item.label}
                </div>
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sky px-1.5 text-xs font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-4 mt-4 border-t border-white/10">
            <NavLink
              to="/ai-assistant"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                )
              }
            >
              <span className="text-lg">✦</span>
              AI Assistant
              <span className="ml-auto rounded-full bg-white/10 px-2 py-0.5 text-[0.65rem] font-semibold text-white/70">
                Simulated
              </span>
            </NavLink>
          </div>
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-white/10">
          <Link to="/profile" onClick={onClose} className="flex items-center gap-3 group">
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="avatar"
              className="h-9 w-9 rounded-full border-2 border-white/20"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">Aarav Sharma</p>
              <p className="text-xs text-white/50 truncate">User</p>
            </div>
          </Link>
        </div>
      </aside>
    </>
  );
}
