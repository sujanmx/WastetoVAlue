import { Component, ErrorInfo, ReactNode } from 'react';
import { ActionableError } from './ActionableError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  isChunkError: boolean;
}

export const CHUNK_RELOAD_STORAGE_KEY = 'w2v_chunk_reload_time';
export const CHUNK_RELOAD_COOLDOWN_MS = 10000;

/**
 * Determines whether an uncaught error is caused by a missing or failed dynamic chunk import
 * (e.g., following a new production deployment or transient CDN chunk delivery error).
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message = (error instanceof Error ? error.message : String(error)).toLowerCase();
  const name = error instanceof Error ? error.name : '';
  return (
    name === 'ChunkLoadError' ||
    message.includes('failed to fetch dynamically imported module') ||
    message.includes('error loading dynamically imported module') ||
    message.includes('importing a module script failed') ||
    message.includes('unable to preload') ||
    message.includes('dynamically imported module')
  );
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    isChunkError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      isChunkError: isChunkLoadError(error),
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);

    // If dynamic chunk fetch fails (e.g. stale deployment chunk rotated out on Vercel),
    // perform a single safe reload from the server while guarding against infinite loops.
    if (isChunkLoadError(error) && typeof window !== 'undefined') {
      try {
        const lastReload = window.sessionStorage.getItem(CHUNK_RELOAD_STORAGE_KEY);
        const now = Date.now();

        if (!lastReload || now - parseInt(lastReload, 10) > CHUNK_RELOAD_COOLDOWN_MS) {
          window.sessionStorage.setItem(CHUNK_RELOAD_STORAGE_KEY, String(now));
          window.location.reload();
        }
      } catch {
        // Fall back gracefully if sessionStorage is restricted/disabled
      }
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, isChunkError: false });
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isChunk = this.state.isChunkError;

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <ActionableError
            title={isChunk ? 'Update Available' : 'Application Error'}
            message={
              isChunk
                ? 'A new version of Waste2Value is available or network connectivity was interrupted. Please reload to load the latest version.'
                : this.state.error?.message ||
                  'An unexpected client error occurred. Try refreshing the workspace.'
            }
            recoveryLabel={isChunk ? 'Reload Latest Version' : 'Reload Application'}
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
