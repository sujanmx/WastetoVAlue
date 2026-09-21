import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/constants';
import {
  Home,
  Camera,
  Layers,
  Compass,
  BarChart3,
  HelpCircle,
  Settings,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItemDef {
  label: string;
  path: string;
  icon: React.ElementType;
}

const PRIMARY_NAV: NavItemDef[] = [
  { label: 'Home', path: ROUTES.HOME, icon: Home },
  { label: 'Scan', path: ROUTES.SCAN, icon: Camera },
  { label: 'My Items', path: ROUTES.ITEMS, icon: Layers },
  { label: 'Discover', path: ROUTES.DISCOVER, icon: Compass },
  { label: 'Impact', path: ROUTES.IMPACT, icon: BarChart3 },
];

const UTILITY_NAV: NavItemDef[] = [
  { label: 'Help', path: ROUTES.HELP, icon: HelpCircle },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
  { label: 'Profile', path: ROUTES.PROFILE, icon: UserIcon },
];

export const DesktopSidebar: React.FC = () => {
  return (
    <aside
      className="hidden lg:flex flex-col w-sidebar h-screen sticky top-0 bg-surface border-r border-border select-none z-30"
      aria-label="Desktop Navigation"
    >
      {/* Brand Header */}
      <div className="p-6 border-b border-border/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-base">
            W
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-primary-text leading-none">
              Waste2Value
            </h1>
            <p className="text-[11px] text-secondary-text mt-0.5">Circular Intelligence</p>
          </div>
        </div>
      </div>

      {/* Primary Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-button text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-soft-green text-brand-green font-semibold'
                    : 'text-secondary-text hover:text-primary-text hover:bg-canvas'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Utility Bottom Navigation Links */}
      <div className="p-3 border-t border-border/60 space-y-1">
        {UTILITY_NAV.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2 rounded-button text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-soft-green text-brand-green font-semibold'
                    : 'text-secondary-text hover:text-primary-text hover:bg-canvas'
                )
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
