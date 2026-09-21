import React from 'react';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
  return (
    <WorkspaceContainer maxWidth="md">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Settings</h1>
        <p className="text-sm text-secondary-text mt-1">Configure preferences, accessibility, and privacy.</p>
      </div>

      <div className="space-y-6">
        {/* Account Section */}
        <Card variant="resting" className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text mb-4 pb-2 border-b border-border/60">
            Account Preferences
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-text">Email Notifications</p>
                <p className="text-secondary-text">Receive updates when a receiver accepts your item.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-border accent-brand-green" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-text">Location Radius</p>
                <p className="text-secondary-text">Default search radius for receiver discovery.</p>
              </div>
              <span className="font-mono text-primary-text font-medium">10 km</span>
            </div>
          </div>
        </Card>

        {/* Accessibility Section */}
        <Card variant="resting" className="p-6">
          <h3 className="text-sm font-bold uppercase tracking-wider text-primary-text mb-4 pb-2 border-b border-border/60">
            Accessibility (WCAG 2.2 AA)
          </h3>
          <div className="space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-text">Respect Reduced Motion</p>
                <p className="text-secondary-text">Disables fluid animations for sensitive viewports.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-border accent-brand-green" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-primary-text">High Contrast Focus Halo</p>
                <p className="text-secondary-text">3px soft-green keyboard ring active across controls.</p>
              </div>
              <span className="text-brand-green font-semibold">Active</span>
            </div>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card variant="resting" className="p-6 border-[#FECDCA] bg-[#FEF3F2]/30">
          <h3 className="text-sm font-bold uppercase tracking-wider text-error mb-2">
            Danger Zone
          </h3>
          <p className="text-xs text-secondary-text mb-4">
            Permanently delete your account and all associated item journey records.
          </p>
          <Button variant="destructive" size="sm">
            Delete Account
          </Button>
        </Card>
      </div>
    </WorkspaceContainer>
  );
};
