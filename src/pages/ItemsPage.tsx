import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { StateView } from '../components/feedback/StateView';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { formatDate } from '../lib/formatters';
import { Camera, Plus, Eye } from 'lucide-react';
import { cn } from '../lib/utils';

export const ItemsPage: React.FC = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'active' | 'completed'>('all');

  const { data: items, isLoading, error, reload } = useAsync(
    () => services.items.getItems(),
    { immediate: true }
  );

  const filteredItems = items?.filter((item) => {
    if (tab === 'active') return item.status !== 'completed' && item.status !== 'cancelled';
    if (tab === 'completed') return item.status === 'completed';
    return true;
  });

  return (
    <WorkspaceContainer>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">My Items</h1>
          <p className="text-sm text-secondary-text mt-1">
            Track and manage your scanned items across their circular lifecycles.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.CREATE_LISTING)}
          >
            Create Listing
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SCAN)}
          >
            Scan New Item
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 mb-6 gap-6 text-sm font-medium">
        {(['all', 'active', 'completed'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              'pb-3 capitalize transition-colors relative',
              tab === t
                ? 'text-brand-green font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-brand-green'
                : 'text-secondary-text hover:text-primary-text'
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Desktop Table / Mobile Card Hybrid */}
      <StateView
        isLoading={isLoading}
        error={error}
        onRetry={reload}
        isEmpty={filteredItems?.length === 0}
        emptyProps={{
          title: 'No items found',
          description: 'Your circular inventory is empty. Start by scanning your first item.',
          actionLabel: 'Scan Your Waste',
          onAction: () => navigate(ROUTES.SCAN),
        }}
      >
        {/* Desktop Table (Visible on lg+) */}
        <div className="hidden lg:block bg-surface border border-border rounded-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-canvas border-b border-border text-secondary-text uppercase font-semibold">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Value Path</th>
                <th className="p-4">Receiver Hub</th>
                <th className="p-4">Status</th>
                <th className="p-4">Updated</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredItems?.map((item) => (
                <tr key={item.id} className="hover:bg-canvas/50 transition-colors">
                  <td className="p-4 font-semibold text-primary-text flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-10 h-10 rounded-control object-cover border border-border"
                    />
                    <span>{item.title}</span>
                  </td>
                  <td className="p-4 text-secondary-text">{item.category}</td>
                  <td className="p-4 font-semibold text-brand-green uppercase">
                    {item.recommendedValuePath}
                  </td>
                  <td className="p-4 text-primary-text font-medium">
                    {item.receiverName || 'Not matched yet'}
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-secondary-text">{item.status.replace('_', ' ')}</span>
                  </td>
                  <td className="p-4 text-secondary-text font-mono">
                    {formatDate(item.updatedAt)}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      leftIcon={<Eye className="w-3.5 h-3.5" />}
                      onClick={() => navigate(`/items/${item.id}/track`)}
                    >
                      Track
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards (Visible on <lg) */}
        <div className="lg:hidden space-y-3">
          {filteredItems?.map((item) => (
            <Card
              key={item.id}
              variant="interactive"
              onClick={() => navigate(`/items/${item.id}/track`)}
              className="p-4 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-12 h-12 rounded-input object-cover border border-border"
                />
                <div>
                  <h4 className="text-sm font-semibold text-primary-text">{item.title}</h4>
                  <p className="text-xs text-secondary-text mt-0.5">
                    {item.category} •{' '}
                    <span className="text-brand-green font-semibold uppercase">
                      {item.recommendedValuePath}
                    </span>
                  </p>
                </div>
              </div>
              <Button size="sm" variant="secondary">
                View
              </Button>
            </Card>
          ))}
        </div>
      </StateView>
    </WorkspaceContainer>
  );
};
