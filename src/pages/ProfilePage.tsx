import React from 'react';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, MapPin, Shield, LogOut } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <WorkspaceContainer maxWidth="md">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Profile</h1>
        <p className="text-sm text-secondary-text mt-1">Manage your identity and member account details.</p>
      </div>

      <Card variant="resting" className="p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-4 pb-6 border-b border-border/60">
          <div className="w-16 h-16 rounded-full bg-soft-green text-brand-green flex items-center justify-center font-bold text-xl">
            {user?.name ? user.name.charAt(0) : <User className="w-8 h-8" />}
          </div>
          <div>
            <h2 className="text-lg font-bold text-primary-text">{user?.name || 'Alex Morgan'}</h2>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-canvas border border-border text-xs font-semibold capitalize text-secondary-text mt-1">
              {user?.role || 'household'}
            </span>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 text-secondary-text">
            <Mail className="w-4 h-4 text-secondary-text" />
            <span>{user?.email || 'alex.morgan@example.com'}</span>
          </div>

          <div className="flex items-center gap-3 text-secondary-text">
            <MapPin className="w-4 h-4 text-secondary-text" />
            <span>{user?.location?.city || 'San Francisco, CA'}</span>
          </div>

          <div className="flex items-center gap-3 text-secondary-text">
            <Shield className="w-4 h-4 text-secondary-text" />
            <span>Member since January 2026</span>
          </div>
        </div>

        <div className="pt-6 border-t border-border/60 flex justify-end">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={() => logout()}
          >
            Sign out
          </Button>
        </div>
      </Card>
    </WorkspaceContainer>
  );
};
