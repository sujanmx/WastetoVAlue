import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  ErrorBoundary,
  isChunkLoadError,
  CHUNK_RELOAD_STORAGE_KEY,
  CHUNK_RELOAD_COOLDOWN_MS,
} from '../components/feedback/ErrorBoundary';
import vercelConfig from '../../vercel.json';

describe('Lazy Route Modules Structural & Import Integrity', () => {
  const routesToTest = [
    { name: 'LandingPage', path: '../pages/LandingPage' },
    { name: 'LoginPage', path: '../pages/LoginPage' },
    { name: 'SignUpPage', path: '../pages/SignUpPage' },
    { name: 'ForgotPasswordPage', path: '../pages/ForgotPasswordPage' },
    { name: 'ResetPasswordPage', path: '../pages/ResetPasswordPage' },
    { name: 'OnboardingPage', path: '../pages/OnboardingPage' },
    { name: 'HomePage', path: '../pages/HomePage' },
    { name: 'ScanPage', path: '../pages/ScanPage' },
    { name: 'ScanReviewPage', path: '../pages/ScanReviewPage' },
    { name: 'ScanAnalyzePage', path: '../pages/ScanAnalyzePage' },
    { name: 'ScanResultPage', path: '../pages/ScanResultPage' },
    { name: 'ReceiversPage', path: '../pages/ReceiversPage' },
    { name: 'ReceiverDetailPage', path: '../pages/ReceiverDetailPage' },
    { name: 'ItemsPage', path: '../pages/ItemsPage' },
    { name: 'ItemTrackPage', path: '../pages/ItemTrackPage' },
    { name: 'CreateListingPage', path: '../pages/CreateListingPage' },
    { name: 'HandoverConfirmPage', path: '../pages/HandoverConfirmPage' },
    { name: 'HandoverSuccessPage', path: '../pages/HandoverSuccessPage' },
    { name: 'DiscoverPage', path: '../pages/DiscoverPage' },
    { name: 'ImpactPage', path: '../pages/ImpactPage' },
    { name: 'ProfilePage', path: '../pages/ProfilePage' },
    { name: 'SettingsPage', path: '../pages/SettingsPage' },
    { name: 'HelpPage', path: '../pages/HelpPage' },
    { name: 'NotFoundPage', path: '../pages/NotFoundPage' },
  ];

  it.each(routesToTest)('dynamically imports and resolves $name correctly', async ({ name, path: modPath }) => {
    const mod = await import(/* @vite-ignore */ modPath);
    expect(mod).toBeDefined();

    // Module must export either the named export or default export
    const component = mod[name] || mod.default;
    expect(component).toBeDefined();
    expect(typeof component === 'function' || typeof component === 'object').toBe(true);
  });

  it('verifies DiscoverPage provides both named and default exports', async () => {
    const mod = await import('../pages/DiscoverPage');
    expect(mod.DiscoverPage).toBeDefined();
    expect(mod.default).toBeDefined();
    expect(mod.DiscoverPage).toBe(mod.default);
  });
});

describe('Dynamic Chunk Load Error Detection & Recovery UX', () => {
  let originalLocation: Location;
  const reloadMock = vi.fn();

  beforeEach(() => {
    sessionStorage.clear();
    reloadMock.mockClear();

    originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      writable: true,
      value: {
        ...originalLocation,
        reload: reloadMock,
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'location', {
      writable: true,
      value: originalLocation,
    });
    vi.restoreAllMocks();
  });

  it('correctly identifies various dynamic import failure signatures', () => {
    expect(
      isChunkLoadError(
        new TypeError(
          'Failed to fetch dynamically imported module: https://vite-flame-gamma.vercel.app/assets/DiscoverPage-VP5IxhTx.js'
        )
      )
    ).toBe(true);

    expect(
      isChunkLoadError(new Error('error loading dynamically imported module /assets/ItemsPage.js'))
    ).toBe(true);

    expect(isChunkLoadError(new Error('Importing a module script failed.'))).toBe(true);

    const chunkErr = new Error('Loading chunk 4 failed');
    chunkErr.name = 'ChunkLoadError';
    expect(isChunkLoadError(chunkErr)).toBe(true);

    expect(isChunkLoadError(new Error('Unable to preload CSS for /assets/index.css'))).toBe(true);

    // Regular errors should NOT be treated as chunk load errors
    expect(isChunkLoadError(new Error('Cannot read properties of undefined (reading "title")'))).toBe(
      false
    );
    expect(isChunkLoadError(new Error('NetworkError when attempting to fetch resource.'))).toBe(false);
    expect(isChunkLoadError(null)).toBe(false);
  });

  it('automatically triggers reload and sets cooldown timestamp on first chunk error', () => {
    const ChunkCrashingComponent: React.FC = () => {
      throw new TypeError(
        'Failed to fetch dynamically imported module: https://vite-flame-gamma.vercel.app/assets/DiscoverPage-VP5IxhTx.js'
      );
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ChunkCrashingComponent />
      </ErrorBoundary>
    );

    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY)).toBeTruthy();
    consoleSpy.mockRestore();
  });

  it('prevents infinite reload loops when a chunk error recurs within the cooldown window', () => {
    sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(Date.now()));

    const ChunkCrashingComponent: React.FC = () => {
      throw new TypeError(
        'Failed to fetch dynamically imported module: https://vite-flame-gamma.vercel.app/assets/DiscoverPage-VP5IxhTx.js'
      );
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ChunkCrashingComponent />
      </ErrorBoundary>
    );

    expect(reloadMock).not.toHaveBeenCalled();

    expect(screen.getByText(/Update Available/i)).toBeInTheDocument();
    expect(
      screen.getByText(/A new version of Waste2Value is available or network connectivity was interrupted/i)
    ).toBeInTheDocument();

    const reloadButton = screen.getByRole('button', { name: /Reload Latest Version/i });
    expect(reloadButton).toBeInTheDocument();

    fireEvent.click(reloadButton);
    expect(reloadMock).toHaveBeenCalledTimes(1);

    consoleSpy.mockRestore();
  });

  it('allows reload if cooldown has expired', () => {
    const expiredTime = Date.now() - (CHUNK_RELOAD_COOLDOWN_MS + 1000);
    sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(expiredTime));

    const ChunkCrashingComponent: React.FC = () => {
      throw new TypeError(
        'Failed to fetch dynamically imported module: https://vite-flame-gamma.vercel.app/assets/DiscoverPage-VP5IxhTx.js'
      );
    };

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ChunkCrashingComponent />
      </ErrorBoundary>
    );

    expect(reloadMock).toHaveBeenCalledTimes(1);
    consoleSpy.mockRestore();
  });
});

describe('Vercel Routing & Deployment Configuration Integrity', () => {
  it('validates vercel.json rewrites and headers prevent asset rewrite loops', () => {
    expect(vercelConfig).toBeDefined();

    // Verify rewrites
    expect(vercelConfig.rewrites).toBeDefined();
    expect(Array.isArray(vercelConfig.rewrites)).toBe(true);

    const spaRewrite = vercelConfig.rewrites.find((r: { destination: string }) => r.destination === '/index.html');
    expect(spaRewrite).toBeDefined();

    // The rewrite regex MUST NOT rewrite /assets/* to /index.html (anchored as Vercel does)
    const rewriteRegex = new RegExp('^' + spaRewrite!.source + '$');

    // SPA routes MUST match
    expect(rewriteRegex.test('/discover')).toBe(true);
    expect(rewriteRegex.test('/items')).toBe(true);
    expect(rewriteRegex.test('/items/123')).toBe(true);
    expect(rewriteRegex.test('/impact')).toBe(true);
    expect(rewriteRegex.test('/profile')).toBe(true);
    expect(rewriteRegex.test('/settings')).toBe(true);
    expect(rewriteRegex.test('/help')).toBe(true);

    // Assets MUST NOT match
    expect(rewriteRegex.test('/assets/DiscoverPage-VP5IxhTx.js')).toBe(false);
    expect(rewriteRegex.test('/assets/index-DNgvOwC9.js')).toBe(false);
    expect(rewriteRegex.test('/assets/vendor-react-BX03LesH.js')).toBe(false);

    // Verify cache headers
    const assetHeaderRule = vercelConfig.headers.find(
      (h: { source: string }) => h.source === '/assets/(.*)'
    );
    expect(assetHeaderRule).toBeDefined();
    const assetCacheHeader = assetHeaderRule!.headers.find(
      (entry: { key: string }) => entry.key === 'Cache-Control'
    );
    expect(assetCacheHeader).toBeDefined();
    expect(assetCacheHeader!.value).toContain('immutable');

    const htmlHeaderRule = vercelConfig.headers.find(
      (h: { source: string }) => h.source === '/((?!assets/).*)'
    );
    expect(htmlHeaderRule).toBeDefined();
    const htmlCacheHeader = htmlHeaderRule!.headers.find(
      (entry: { key: string }) => entry.key === 'Cache-Control'
    );
    expect(htmlCacheHeader).toBeDefined();
    expect(htmlCacheHeader!.value).toContain('must-revalidate');
  });
});
