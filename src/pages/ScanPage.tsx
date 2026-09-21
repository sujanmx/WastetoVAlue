import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkspaceContainer } from '../components/layout/WorkspaceContainer';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useScanFlow } from '../hooks/useScanFlow';
import { ROUTES, UPLOAD_LIMITS } from '../config/constants';
import { Camera, Upload, Image as ImageIcon, ShieldCheck } from 'lucide-react';

export const ScanPage: React.FC = () => {
  const navigate = useNavigate();
  const { setImage } = useScanFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.size > UPLOAD_LIMITS.maxFileSizeBytes) {
      alert(`File size exceeds ${UPLOAD_LIMITS.maxFileSizeMb}MB limit.`);
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    setImage({ file, previewUrl });
    navigate(ROUTES.SCAN_REVIEW);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  // Quick demo sample (The "Wooden Chair" from design specifications)
  const handleLoadSample = () => {
    setImage({
      previewUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=800&q=80',
    });
    navigate(ROUTES.SCAN_REVIEW);
  };

  return (
    <WorkspaceContainer maxWidth="lg">
      <div className="text-center max-w-xl mx-auto mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary-text tracking-tight">
          Give your item a second look.
        </h1>
        <p className="text-sm text-secondary-text mt-1.5">
          Capture or upload an image to identify material properties and uncover circular next-value pathways.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {/* Upload / Camera Main Zone */}
        <Card
          variant="resting"
          className="lg:col-span-2 flex flex-col items-center justify-center p-8 sm:p-12 border-2 border-dashed border-border hover:border-brand-green/50 transition-colors text-center cursor-pointer min-h-[340px]"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={UPLOAD_LIMITS.acceptedExtensions.join(',')}
            className="hidden"
            onChange={handleInputChange}
          />
          <div className="w-16 h-16 rounded-full bg-soft-green text-brand-green flex items-center justify-center mb-4">
            <Camera className="w-8 h-8" />
          </div>
          <h3 className="text-base font-semibold text-primary-text mb-1">
            Take a photo or upload an image
          </h3>
          <p className="text-xs text-secondary-text max-w-xs mb-6">
            Supports JPEG, PNG, and WebP up to 10MB. For best results, ensure clear lighting and isolated item background.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              type="button"
              variant="primary"
              leftIcon={<Upload className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Choose File
            </Button>
            <Button
              type="button"
              variant="secondary"
              leftIcon={<ImageIcon className="w-4 h-4" />}
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
            >
              Use Demo Sample
            </Button>
          </div>
        </Card>

        {/* How It Works Sidebar Panel (Desktop 1024px+) */}
        <Card variant="resting" className="lg:col-span-1 p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-semibold text-primary-text mb-3">How it works</h4>
            <ol className="space-y-4 text-xs text-secondary-text">
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-canvas border border-border flex items-center justify-center font-bold text-[10px] text-primary-text flex-shrink-0">
                  1
                </span>
                <div>
                  <strong className="text-primary-text block font-medium">Vision AI</strong>
                  Identifies item geometry, composition, and physical condition.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-canvas border border-border flex items-center justify-center font-bold text-[10px] text-primary-text flex-shrink-0">
                  2
                </span>
                <div>
                  <strong className="text-primary-text block font-medium">Value AI</strong>
                  Evaluates 4 pathways (Reuse, Donate, Resell, Recycle).
                </div>
              </li>
              <li className="flex gap-3">
                <span className="w-5 h-5 rounded-full bg-canvas border border-border flex items-center justify-center font-bold text-[10px] text-primary-text flex-shrink-0">
                  3
                </span>
                <div>
                  <strong className="text-primary-text block font-medium">Matching AI</strong>
                  Connects to verified local hubs and drop-off partners.
                </div>
              </li>
            </ol>
          </div>

          <div className="mt-6 pt-4 border-t border-border flex items-center gap-2 text-[11px] text-secondary-text">
            <ShieldCheck className="w-4 h-4 text-brand-green flex-shrink-0" />
            <span>Images are processed locally and securely.</span>
          </div>
        </Card>
      </div>
    </WorkspaceContainer>
  );
};
