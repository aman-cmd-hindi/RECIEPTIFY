import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-red-600 bg-white rounded-xl shadow-sm max-w-lg mx-auto my-12">
          <h1 className="text-xl font-bold mb-3">Something went wrong</h1>
          <pre className="text-xs bg-red-50 p-4 rounded-lg overflow-x-auto">{this.state.error?.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}
