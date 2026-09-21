import { Component, ErrorInfo, ReactNode } from 'react';
import { ActionableError } from './ActionableError';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught component error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] flex items-center justify-center p-6">
          <ActionableError
            title="Application Error"
            message={
              this.state.error?.message ||
              'An unexpected client error occurred. Try refreshing the workspace.'
            }
            recoveryLabel="Reload Application"
            onRetry={this.handleReset}
          />
        </div>
      );
    }

    return this.props.children;
  }
}
