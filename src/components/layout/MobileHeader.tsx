import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User as UserIcon } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title = 'Waste2Value',
  showBack = false,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className="lg:hidden flex items-center justify-between h-14 px-4 bg-surface border-b border-border sticky top-0 z-20 pt-safe">
      <div className="flex items-center gap-2">
        {showBack ? (
          <button
            onClick={handleBack}
            className="p-2 -ml-2 text-primary-text hover:bg-canvas rounded-control transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-6 h-6 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-xs">
            W
          </div>
        )}
        <h2 className="text-sm font-semibold text-primary-text tracking-tight truncate max-w-[200px]">
          {title}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-soft-green text-brand-green flex items-center justify-center font-medium text-xs">
          {user?.name ? user.name.charAt(0) : <UserIcon className="w-3.5 h-3.5" />}
        </div>
      </div>
    </header>
  );
};
