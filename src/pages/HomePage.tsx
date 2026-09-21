import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { DataHonestyBadge } from '../components/feedback/DataHonestyBadge';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { ROUTES } from '../config/constants';
import { Camera, Layers, ArrowRight, Clock, Sparkles } from 'lucide-react';
import { StateView } from '../components/feedback/StateView';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: recentItems, isLoading: itemsLoading } = useAsync(
    () => services.items.getRecentItems(2),
    { immediate: true }
  );

  const { data: impact } = useAsync(
    () => services.impact.getPersonalImpact(),
    { immediate: true }
  );

  return (
    <WorkspaceContainer>
      {/* Hero Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text tracking-tight">
          Good morning, {user?.name?.split(' ')[0] || 'Alex'}.
        </h1>
        <p className="text-sm sm:text-base text-secondary-text mt-1">
          Turn something unwanted into something useful.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 mt-5">
          <Button
            variant="primary"
            leftIcon={<Camera className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.SCAN)}
          >
            Scan Your Waste
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Layers className="w-4 h-4" />}
            onClick={() => navigate(ROUTES.ITEMS)}
          >
            View My Items
          </Button>
        </div>
      </div>

      {/* Metrics Row (Transparently labeled) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <Card variant="resting" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Items Diverted</span>
            {impact?.isEstimated && <DataHonestyBadge type="demo-data" />}
          </div>
          <p className="text-2xl font-bold text-primary-text mt-2 font-mono">
            {impact?.totalItemsGivenNextValue ?? 12}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">Given a second life</p>
        </Card>

        <Card variant="resting" className="p-4">
          <span className="text-xs text-secondary-text">Reused & Donated</span>
          <p className="text-2xl font-bold text-brand-green mt-2 font-mono">
            {(impact?.reusedCount ?? 5) + (impact?.donatedCount ?? 3)}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">High-utility retention</p>
        </Card>

        <Card variant="resting" className="p-4">
          <span className="text-xs text-secondary-text">Recycled</span>
          <p className="text-2xl font-bold text-primary-text mt-2 font-mono">
            {impact?.recycledCount ?? 2}
          </p>
          <p className="text-[11px] text-secondary-text mt-1">Material recovery</p>
        </Card>

        <Card variant="resting" className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-secondary-text">Est. CO₂ Offset</span>
            <DataHonestyBadge type="estimated" />
          </div>
          <p className="text-2xl font-bold text-primary-text mt-2 font-mono">
            {impact?.estimatedCo2SavedKg ?? 82} kg
          </p>
          <p className="text-[11px] text-secondary-text mt-1">Estimated lifecycle savings</p>
        </Card>
      </div>

      {/* Main Grid: Quick Scan + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Scan Card */}
        <Card
          variant="interactive"
          onClick={() => navigate(ROUTES.SCAN)}
          className="lg:col-span-1 bg-surface border-border flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-control bg-soft-green text-brand-green flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-base text-primary-text">Quick AI Scan</h3>
            </div>
            <p className="text-xs text-secondary-text leading-relaxed">
              Snap a photo or upload an image of any discarded item. Vision AI identifies the material, and Value AI determines the best circular pathway.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-semibold text-brand-green">
            <span>Start Scan Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </Card>

        {/* Recent Items Activity */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider">
              Recent Activity
            </h3>
            <button
              onClick={() => navigate(ROUTES.ITEMS)}
              className="text-xs text-brand-green font-medium hover:underline"
            >
              See all
            </button>
          </div>

          <StateView isLoading={itemsLoading}>
            <div className="space-y-3">
              {recentItems?.map((item) => (
                <Card
                  key={item.id}
                  variant="interactive"
                  onClick={() => navigate(`/items/${item.id}/track`)}
                  className="p-3.5 sm:p-4 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-input object-cover border border-border"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-primary-text">{item.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-secondary-text mt-0.5">
                        <span className="capitalize">{item.category}</span>
                        <span>•</span>
                        <span className="text-brand-green font-medium uppercase text-[11px]">
                          {item.recommendedValuePath}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs text-secondary-text">
                      <Clock className="w-3 h-3" />
                      In progress
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </StateView>
        </div>
      </div>

      {/* Four Circular Pathways Row */}
      <div>
        <h3 className="text-sm font-semibold text-primary-text uppercase tracking-wider mb-3">
          Circular Pathways
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'Reuse', desc: 'Direct repair & reuse' },
            { name: 'Donate', desc: 'Shelters & charities' },
            { name: 'Resell', desc: 'Secondary marketplace' },
            { name: 'Recycle', desc: 'Material recovery' },
          ].map((path) => (
            <Card key={path.name} variant="resting" className="p-4">
              <h4 className="text-sm font-semibold text-primary-text">{path.name}</h4>
              <p className="text-xs text-secondary-text mt-1">{path.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </WorkspaceContainer>
  );
};
