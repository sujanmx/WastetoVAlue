import React, { useState } from 'react';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { useAsync } from '../hooks/useAsync';
import { services } from '../services';
import { StateView } from '../components/feedback/StateView';
import { Search, MapPin } from 'lucide-react';
import { formatDistance } from '../lib/formatters';

export const DiscoverPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const fetchReceivers = React.useCallback(
    () => services.receivers.getReceivers({ query }),
    [query]
  );

  const { data: receivers, isLoading, error } = useAsync(
    fetchReceivers,
    { immediate: true }
  );

  return (
    <WorkspaceContainer>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text">Discover</h1>
        <p className="text-sm text-secondary-text mt-1">
          Explore regional reuse centers, certified recyclers, and circular economy drop-offs.
        </p>
      </div>

      <div className="max-w-md mb-6">
        <Input
          placeholder="Find partners in your neighborhood..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />
      </div>

      <StateView isLoading={isLoading} error={error}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {receivers?.map((receiver) => (
            <Card key={receiver.id} variant="resting" className="p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-brand-green uppercase">
                    {receiver.typeLabel}
                  </span>
                  <Badge variant="default" size="sm">
                    {formatDistance(receiver.distanceKm)}
                  </Badge>
                </div>
                <h3 className="font-semibold text-base text-primary-text mb-1">{receiver.name}</h3>
                <p className="text-xs text-secondary-text mb-4 leading-relaxed line-clamp-3">
                  {receiver.description}
                </p>
              </div>

              <div className="pt-3 border-t border-border/60 text-xs flex items-center gap-1.5 text-secondary-text">
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate">{receiver.address}</span>
              </div>
            </Card>
          ))}
        </div>
      </StateView>
    </WorkspaceContainer>
  );
};

export default DiscoverPage;
