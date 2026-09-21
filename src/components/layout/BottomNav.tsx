import React from 'react';
import { NavLink } from 'react-router-dom';
import { ROUTES } from '../../config/constants';
import { Home, Camera, Layers, BarChart3, User } from 'lucide-react';
import { cn } from '../../lib/utils';

export const BottomNav: React.FC = () => {
  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-md border-t border-border pb-safe"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around h-16 max-w-md mx-auto px-2">
        {/* Home */}
        <NavLink
          to={ROUTES.HOME}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full gap-1 text-[11px] transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-secondary-text hover:text-primary-text'
            )
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        {/* Scan (Emphasized core CTA) */}
        <NavLink
          to={ROUTES.SCAN}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center -mt-3 w-14 group',
              isActive ? 'text-brand-green font-semibold' : 'text-secondary-text'
            )
          }
        >
          <div className="w-12 h-12 rounded-full bg-deep-forest text-white shadow-raised flex items-center justify-center group-hover:scale-105 active:scale-95 transition-transform">
            <Camera className="w-6 h-6" />
          </div>
          <span className="text-[11px] mt-1">Scan</span>
        </NavLink>

        {/* Items */}
        <NavLink
          to={ROUTES.ITEMS}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full gap-1 text-[11px] transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-secondary-text hover:text-primary-text'
            )
          }
        >
          <Layers className="w-5 h-5" />
          <span>Items</span>
        </NavLink>

        {/* Impact */}
        <NavLink
          to={ROUTES.IMPACT}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full gap-1 text-[11px] transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-secondary-text hover:text-primary-text'
            )
          }
        >
          <BarChart3 className="w-5 h-5" />
          <span>Impact</span>
        </NavLink>

        {/* Profile */}
        <NavLink
          to={ROUTES.PROFILE}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center w-14 h-full gap-1 text-[11px] transition-colors',
              isActive ? 'text-brand-green font-semibold' : 'text-secondary-text hover:text-primary-text'
            )
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
