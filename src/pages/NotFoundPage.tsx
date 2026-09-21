import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { ROUTES } from '../config/constants';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-lg mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-primary-text mb-2">Page not found</h1>
      <p className="text-sm text-secondary-text max-w-sm mb-6">
        The circular page or resource you requested could not be located.
      </p>
      <Button
        variant="primary"
        leftIcon={<ArrowLeft className="w-4 h-4" />}
        onClick={() => navigate(ROUTES.HOME)}
      >
        Return to Workspace
      </Button>
    </div>
  );
};
