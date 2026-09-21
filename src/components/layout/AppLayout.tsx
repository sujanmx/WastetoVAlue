import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DesktopSidebar } from './DesktopSidebar';
import { DesktopHeader } from './DesktopHeader';
import { MobileHeader } from './MobileHeader';
import { BottomNav } from './BottomNav';
import { ROUTES } from '../../config/constants';

function getHeaderInfo(pathname: string): { title: string; subtitle?: string } {
  if (pathname.startsWith(ROUTES.SCAN)) {
    return { title: 'Scan & Identify', subtitle: 'Vision AI material recognition' };
  }
  if (pathname.startsWith(ROUTES.ITEMS)) {
    return { title: 'My Items', subtitle: 'Track and manage your circular inventory' };
  }
  if (pathname.startsWith(ROUTES.RECEIVERS)) {
    return { title: 'Find Receivers', subtitle: 'Match with local organizations and recyclers' };
  }
  if (pathname.startsWith(ROUTES.DISCOVER)) {
    return { title: 'Discover', subtitle: 'Circular opportunities in your area' };
  }
  if (pathname.startsWith(ROUTES.IMPACT)) {
    return { title: 'Your Impact', subtitle: 'Measured and estimated circular metrics' };
  }
  if (pathname.startsWith(ROUTES.PROFILE)) {
    return { title: 'Profile', subtitle: 'Manage your credentials and preferences' };
  }
  if (pathname.startsWith(ROUTES.SETTINGS)) {
    return { title: 'Settings', subtitle: 'Application and account preferences' };
  }
  return { title: 'Waste2Value', subtitle: 'Don’t throw it away. Find its next value.' };
}

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { title, subtitle } = getHeaderInfo(location.pathname);
  const isScanSubRoute = location.pathname !== ROUTES.SCAN && location.pathname.startsWith(ROUTES.SCAN);

  return (
    <div className="flex min-h-screen bg-canvas text-primary-text">
      {/* Persistent Left Sidebar on Desktop */}
      <DesktopSidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Desktop Header */}
        <DesktopHeader title={title} subtitle={subtitle} />

        {/* Mobile Header */}
        <MobileHeader title={title} showBack={isScanSubRoute} />

        {/* Page Content Viewport */}
        <main className="flex-1 pb-24 lg:pb-8 overflow-y-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
};
