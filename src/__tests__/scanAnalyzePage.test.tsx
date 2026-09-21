import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { ScanAnalyzePage } from '../pages/ScanAnalyzePage';
import { ScanFlowProvider, useScanFlowContext } from '../context/ScanFlowContext';
import { services } from '../services';
import { AppError } from '../services/api/apiError';

const Initializer: React.FC<{ initialUrl: string }> = ({ initialUrl }) => {
  const { setImage } = useScanFlowContext();
  React.useEffect(() => {
    setImage({ previewUrl: initialUrl });
  }, [initialUrl, setImage]);
  return <ScanAnalyzePage />;
};

describe('ScanAnalyzePage Resilience & In-Memory Image Preservation', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ActionableError with friendly message when AI analysis fails, not raw technical errors', async () => {
    const networkAppError = AppError.fromAiEdgeFunction({
      name: 'FunctionsFetchError',
      message: 'Failed to send a request to the Edge Function',
      context: new TypeError('Failed to fetch'),
    });

    vi.spyOn(services.ai, 'identifyItem').mockRejectedValue(networkAppError);

    render(
      <MemoryRouter>
        <ScanFlowProvider>
          <Initializer initialUrl="blob:http://localhost/test-photo" />
        </ScanFlowProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Connection Interrupted')).toBeInTheDocument();
    });

    // Friendly user message must be shown, NOT raw "FunctionsFetchError: Failed to send a request"
    expect(
      screen.getByText('Unable to connect to the AI analysis service. Please check your connection and retry.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry Analysis/i })).toBeInTheDocument();
  });

  it('preserves user image in memory on retry without triggering window.location.reload()', async () => {
    const reloadSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { ...window.location, reload: reloadSpy },
    });

    const identifySpy = vi
      .spyOn(services.ai, 'identifyItem')
      .mockRejectedValueOnce(
        AppError.fromAiEdgeFunction({
          name: 'FunctionsFetchError',
          message: 'Failed to send a request to the Edge Function',
        })
      )
      .mockResolvedValueOnce({
        detectedObject: 'Glass Jar',
        category: 'Glass',
        material: 'Glass',
        condition: 'Usable',
        confidence: 'High',
        confidenceScore: 0.95,
        tags: ['glass', 'jar'],
      });

    vi.spyOn(services.ai, 'recommendValuePaths').mockResolvedValue({
      recommendedPath: 'reuse',
      summaryReasoning: 'Reusable glass container.',
      paths: {
        reuse: {
          path: 'reuse',
          title: 'Reuse',
          tagline: 'Refill or store food',
          isRecommended: true,
          reasoning: ['Clean and unbroken'],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: '100%',
        },
        donate: {
          path: 'donate',
          title: 'Donate',
          tagline: 'Community kitchen',
          isRecommended: false,
          reasoning: ['Can donate'],
          potentialDemand: 'Moderate',
          estimatedEffort: 'Moderate',
          recoveryPotential: 'Direct utility',
        },
        resell: {
          path: 'resell',
          title: 'Resell',
          tagline: 'Sell',
          isRecommended: false,
          reasoning: ['Low price'],
          potentialDemand: 'Low',
          estimatedEffort: 'High',
          recoveryPotential: 'Minimal cash',
        },
        recycle: {
          path: 'recycle',
          title: 'Recycle',
          tagline: 'Remelt glass',
          isRecommended: false,
          reasoning: ['Recyclable'],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: 'Material only',
        },
      },
    });

    render(
      <MemoryRouter>
        <ScanFlowProvider>
          <Initializer initialUrl="blob:http://localhost/test-photo" />
        </ScanFlowProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Retry Analysis/i })).toBeInTheDocument();
    });

    // Click Retry
    fireEvent.click(screen.getByRole('button', { name: /Retry Analysis/i }));

    // Verify window.location.reload was NOT called (image preserved in context)
    expect(reloadSpy).not.toHaveBeenCalled();

    // Verify identifyItem was re-invoked with the preserved image
    await waitFor(() => {
      expect(identifySpy).toHaveBeenCalledTimes(2);
      expect(identifySpy).toHaveBeenLastCalledWith('blob:http://localhost/test-photo', expect.any(Function));
    });
  });

  it('prompts user with Sign In button when session expiration/auth error occurs', async () => {
    vi.spyOn(services.ai, 'identifyItem').mockRejectedValue(AppError.aiAuthRequired());

    render(
      <MemoryRouter>
        <ScanFlowProvider>
          <Initializer initialUrl="blob:http://localhost/test-photo" />
        </ScanFlowProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Sign In Required')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Sign In/i })).toBeInTheDocument();
    });
  });
});
