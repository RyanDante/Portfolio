import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, Home, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="min-h-screen bg-black flex items-center justify-center p-6">
          <div className="max-w-md w-full border border-red-500/20 bg-red-500/5 p-8 text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-12 h-12 text-red-500" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest">System_Failure</h2>
              <p className="text-sm text-gray-500 font-mono">
                A critical exception has occurred in the application layer. 
                Error_Code: {this.state.error?.name || 'UNKNOWN_EXCEPTION'}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-black font-bold uppercase text-[10px] tracking-widest hover:bg-white transition-all"
              >
                <RefreshCcw className="w-4 h-4" /> Restart_System
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-red-500/30 text-red-500 font-bold uppercase text-[10px] tracking-widest hover:bg-red-500/10 transition-all"
              >
                <Home className="w-4 h-4" /> Return_To_Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
