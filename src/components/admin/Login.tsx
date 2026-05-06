import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in. Please verify your connection.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center font-mono text-accent">
      AUTHENTICATING...
    </div>
  );

  if (user && isAdmin) return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full border border-border bg-bg-card p-12 text-center">
        <div className="inline-flex p-4 bg-accent/5 border border-accent/20 rounded-full mb-8">
          <LogIn className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4 tracking-tighter uppercase">Admin Access</h1>
        <p className="text-text-muted text-sm mb-12 font-light">
          Unauthorized access attempts are logged and monitored. 
          Use your primary engineering identity to proceed.
        </p>

        {user && !isAdmin && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
            ACCESS_DENIED: Identity verified but unauthorized for system console.
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs">
            AUTH_ERROR: {error}
          </div>
        )}

        <button 
          onClick={handleLogin}
          className="w-full py-4 bg-accent text-black font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-all flex items-center justify-center gap-3"
        >
          Sign in with Google
        </button>

        <a href="/" className="inline-block mt-8 text-[10px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-widest">
          &larr; Return to Central System
        </a>
      </div>
    </div>
  );
};
