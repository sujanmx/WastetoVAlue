import React from 'react';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { DataHonestyBadge } from '../components/feedback/DataHonestyBadge';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { StateView } from '../components/feedback/StateView';

export const ImpactPage: React.FC = () => {
  const { data: impact, isLoading, error } = useAsync(
    () => services.impact.getPersonalImpact(),
    { immediate: true }
  );

  const { data: history } = useAsync(
    () => services.impact.getImpactHistory(),
    { immediate: true }
  );

  return (
    <WorkspaceContainer>
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Your Impact</h1>
          <DataHonestyBadge type="demo-data" />
        </div>
        <p className="text-sm text-secondary-text">
          Transparent metrics representing your circular resource preservation and material diversion.
        </p>
      </div>

      <StateView isLoading={isLoading} error={error}>
        {/* Primary Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card variant="resting" className="p-5">
            <span className="text-xs text-secondary-text font-medium">Total Diverted</span>
            <p className="text-3xl font-bold text-primary-text mt-2 font-mono">
              {impact?.totalItemsGivenNextValue ?? 12}
            </p>
            <p className="text-xs text-secondary-text mt-1">Items given a second life</p>
          </Card>

          <Card variant="resting" className="p-5">
            <span className="text-xs text-secondary-text font-medium">Direct Reuse</span>
            <p className="text-3xl font-bold text-brand-green mt-2 font-mono">
              {impact?.reusedCount ?? 5}
            </p>
            <p className="text-xs text-secondary-text mt-1">High-utility retention</p>
          </Card>

          <Card variant="resting" className="p-5">
            <span className="text-xs text-secondary-text font-medium">Donations</span>
            <p className="text-3xl font-bold text-primary-text mt-2 font-mono">
              {impact?.donatedCount ?? 3}
            </p>
            <p className="text-xs text-secondary-text mt-1">Community assistance</p>
          </Card>

          <Card variant="resting" className="p-5">
            <span className="text-xs text-secondary-text font-medium">Material Recycled</span>
            <p className="text-3xl font-bold text-primary-text mt-2 font-mono">
              {impact?.recycledCount ?? 2}
            </p>
            <p className="text-xs text-secondary-text mt-1">Certified material streams</p>
          </Card>
        </div>

        {/* Environmental Estimates (Honest disclosure) */}
        <Card variant="resting" className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-primary-text">
              Environmental Divergence Telemetry
            </h3>
            <DataHonestyBadge type="estimated" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="p-4 bg-canvas rounded-card border border-border/60">
              <span className="text-xs text-secondary-text block mb-1">Estimated Diverted Mass</span>
              <p className="text-2xl font-bold text-primary-text font-mono">
                {impact?.estimatedMaterialWeightKg ?? 46.5} kg
              </p>
              <p className="text-xs text-secondary-text mt-1">
                Calculated from approximate solid timber and electronic components.
              </p>
            </div>

            <div className="p-4 bg-canvas rounded-card border border-border/60">
              <span className="text-xs text-secondary-text block mb-1">Estimated Lifecycle CO₂ Offset</span>
              <p className="text-2xl font-bold text-primary-text font-mono">
                {impact?.estimatedCo2SavedKg ?? 82.0} kg CO₂e
              </p>
              <p className="text-xs text-secondary-text mt-1">
                Avoided virgin material extraction and manufacturing emissions.
              </p>
            </div>
          </div>
        </Card>

        {/* Historical Monthly Progression */}
        {history && history.length > 0 && (
          <Card variant="resting" className="p-6">
            <h3 className="text-base font-semibold text-primary-text mb-4">Activity Timeline</h3>
            <div className="grid grid-cols-5 gap-2 text-center text-xs">
              {history.map((h) => (
                <div key={h.date} className="p-3 bg-canvas rounded-card border border-border/60">
                  <span className="font-mono text-secondary-text block mb-1">{h.date}</span>
                  <span className="text-lg font-bold text-primary-text font-mono">
                    {h.itemsProcessed}
                  </span>
                  <span className="block text-[10px] text-brand-green uppercase font-semibold mt-1">
                    {h.primaryPath}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </StateView>
    </WorkspaceContainer>
  );
};
