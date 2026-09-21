import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useScanFlow } from '../hooks/useScanFlow';
import { ROUTES } from '../config/constants';
import { ArrowLeft, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';

export const ScanReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { imageData } = useScanFlow();

  if (!imageData?.previewUrl) {
    navigate(ROUTES.SCAN);
    return null;
  }

  return (
    <WorkspaceContainer maxWidth="lg">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="tertiary"
          size="sm"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate(ROUTES.SCAN)}
        >
          Back to upload
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Left: Image Preview */}
        <Card variant="resting" className="p-2 overflow-hidden flex items-center justify-center bg-black/5">
          <img
            src={imageData.previewUrl}
            alt="Scanned item preview"
            className="w-full h-auto max-h-[440px] object-contain rounded-input"
          />
        </Card>

        {/* Right: Inspection & Actions */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-primary-text mb-2">Review Image</h1>
            <p className="text-sm text-secondary-text mb-6">
              Ensure the entire object is visible and clearly lit before starting AI vision analysis.
            </p>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Object is well-centered in frame</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Sufficient ambient lighting detected</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-primary-text">
                <CheckCircle2 className="w-4 h-4 text-brand-green" />
                <span>Ready for Three-AI circular assessment</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <Button
              variant="secondary"
              leftIcon={<RefreshCw className="w-4 h-4" />}
              onClick={() => navigate(ROUTES.SCAN)}
            >
              Replace Image
            </Button>
            <Button
              variant="primary"
              fullWidth
              rightIcon={<Sparkles className="w-4 h-4" />}
              onClick={() => navigate(ROUTES.SCAN_ANALYZE)}
            >
              Analyze Item
            </Button>
          </div>
        </div>
      </div>
    </WorkspaceContainer>
  );
};
