import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { DataHonestyBadge } from '../components/feedback/DataHonestyBadge';
import { StateView } from '../components/feedback/StateView';
import { useScanFlow } from '../hooks/useScanFlow';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { Receiver } from '../types/receiver';
import { formatDistance } from '../lib/formatters';
import { Search, MapPin, Clock, ArrowRight, Filter } from 'lucide-react';

export const ReceiversPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedValuePath, visionResult, selectReceiver } = useScanFlow();

  const [query, setQuery] = useState('');
  const [maxDistance, setMaxDistance] = useState<number>(10);

  const { data: receivers, isLoading, error, reload } = useAsync(
    () =>
      services.receivers.matchReceivers({
        item: visionResult || {},
        valuePath: selectedValuePath || 'reuse',
        filters: { query, maxDistanceKm: maxDistance },
      }),
    { immediate: true }
  );

  const handleSelect = (receiver: Receiver) => {
    selectReceiver(receiver);
    navigate(`/receivers/${receiver.id}`);
  };

  return (
    <WorkspaceContainer>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Find a place for it.</h1>
        <p className="text-sm text-secondary-text mt-1">
          Showing suitable partners for your{' '}
          <strong className="text-brand-green uppercase font-semibold">
            {selectedValuePath || 'reuse'}
          </strong>{' '}
          pathway.
        </p>
      </div>

      {/* Desktop 3-column / Mobile stacked layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: Filter Sidebar */}
        <Card variant="resting" className="lg:col-span-1 p-5 h-fit space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-border/60">
            <Filter className="w-4 h-4 text-secondary-text" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary-text">Filters</h3>
          </div>

          <div>
            <label className="text-xs font-medium text-secondary-text block mb-1.5">
              Maximum Distance: {maxDistance} km
            </label>
            <input
              type="range"
              min="1"
              max="25"
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full accent-brand-green"
            />
          </div>

          <div className="pt-2">
            <Button size="sm" variant="secondary" fullWidth onClick={() => reload()}>
              Apply Filters
            </Button>
          </div>
        </Card>

        {/* Right: Receiver Results Grid & List */}
        <div className="lg:col-span-3 space-y-4">
          <Input
            placeholder="Search organizations, recyclers, and reuse hubs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />

          <StateView
            isLoading={isLoading}
            error={error}
            onRetry={reload}
            isEmpty={receivers?.length === 0}
            emptyProps={{
              title: 'No suitable matches nearby',
              description: 'Try increasing the search radius or choose an alternative value path.',
              actionLabel: 'Increase Distance',
              onAction: () => setMaxDistance(25),
            }}
          >
            <div className="space-y-3">
              {receivers?.map((receiver) => (
                <Card
                  key={receiver.id}
                  variant="interactive"
                  onClick={() => handleSelect(receiver)}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-base font-semibold text-primary-text">{receiver.name}</h4>
                      <DataHonestyBadge type="demo-receiver" />
                    </div>
                    <p className="text-xs font-medium text-brand-green">{receiver.typeLabel}</p>
                    <p className="text-xs text-secondary-text leading-relaxed line-clamp-2">
                      {receiver.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-secondary-text pt-1">
                      <span className="flex items-center gap-1 font-mono font-medium text-primary-text">
                        <MapPin className="w-3.5 h-3.5 text-secondary-text" />
                        {formatDistance(receiver.distanceKm)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-secondary-text" />
                        {receiver.openHours}
                      </span>
                    </div>
                  </div>

                  <div className="flex-shrink-0 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant="primary"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(receiver);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </StateView>
        </div>
      </div>
    </WorkspaceContainer>
  );
};
