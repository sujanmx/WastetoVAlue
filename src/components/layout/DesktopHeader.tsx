import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { User, Bell } from 'lucide-react';

interface DesktopHeaderProps {
  title?: string;
  subtitle?: string;
}

export const DesktopHeader: React.FC<DesktopHeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();

  return (
    <header className="hidden lg:flex items-center justify-between h-16 px-8 bg-surface border-b border-border/60 sticky top-0 z-20">
      <div>
        {title && <h2 className="text-lg font-semibold text-primary-text">{title}</h2>}
        {subtitle && <p className="text-xs text-secondary-text">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-4">
        <button
          className="p-2 text-secondary-text hover:text-primary-text hover:bg-canvas rounded-full transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-soft-green text-brand-green flex items-center justify-center font-medium text-xs">
            {user?.name ? user.name.charAt(0) : <User className="w-4 h-4" />}
          </div>
          <div className="text-left">
            <p className="text-xs font-medium text-primary-text leading-none">{user?.name || 'Alex Morgan'}</p>
            <p className="text-[11px] text-secondary-text mt-0.5 capitalize">{user?.role || 'Household'}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
