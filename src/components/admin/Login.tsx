import React from 'react';
import { Navigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../../lib/firebase';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const { user, isAdmin, loading } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [rememberMe, setRememberMe] = React.useState(true);

  const handleLogin = async () => {
    setError(null);
    try {
      const user = await signInWithGoogle(rememberMe);
      
      // Explicitly check for the allowed email
      if (user.email !== 'emperordante123@gmail.com') {
        // Log them out immediately if they aren't the allowed user
        await auth.signOut();
        setError("ACCESS_DENIED: Critical identity mismatch. This incident has been logged.");
      }
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
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-left font-mono">
            ERR: ACCESS_DENIED. <br/>
            IDENTITY: {user.email} <br/>
            STATUS: UNAUTHORIZED
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-mono">
            AUTH_ERROR: {error}
          </div>
        )}

        <div className="space-y-6">
          <button 
            onClick={handleLogin}
            className="w-full py-4 bg-accent text-black font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_-5px_rgba(var(--accent-rgb),0.3)]"
          >
            Authorize with Google
          </button>

          <label className="flex items-center justify-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5 border border-border bg-black group-hover:border-accent transition-colors">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              {rememberMe && (
                <div className="w-2.5 h-2.5 bg-accent" />
              )}
            </div>
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest group-hover:text-accent transition-colors">Maintain_Persistent_Session</span>
          </label>
        </div>

        <a href="/" className="inline-block mt-12 text-[10px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-widest">
          &larr; Return to Central System
        </a>
      </div>
    </div>
  );
};
