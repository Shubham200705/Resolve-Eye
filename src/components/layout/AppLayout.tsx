import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageMeta: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your reported issues and activity' },
  '/explore': { title: 'Explore Places', subtitle: 'Discover restaurants, hostels, and PGs' },
  '/my-issues': { title: 'My Issues', subtitle: 'Track and manage all your reported complaints' },
  '/management': { title: 'Management Dashboard', subtitle: 'Manage and resolve complaints efficiently' },
  '/notifications': { title: 'Notifications', subtitle: 'Stay updated on your reported issues' },
  '/profile': { title: 'Profile', subtitle: 'Your account and report history' },
  '/ai-assistant': { title: 'AI Assistant', subtitle: 'Get help writing effective complaints' },
  '/report': { title: 'Report an Issue', subtitle: 'Submit a detailed complaint with AI assistance' },
  '/admin': { title: 'Admin Dashboard', subtitle: 'Platform management and oversight' },
};

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const meta = pageMeta[location.pathname] ?? { title: 'ResolveEye' };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          title={meta.title}
          subtitle={meta.subtitle}
        />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
