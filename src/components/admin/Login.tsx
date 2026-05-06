import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ShieldCheck, Activity } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Login: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAdmin && !loading) {
      navigate('/admin/projects', { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono text-accent">
      <div className="flex flex-col items-center gap-6">
        <Activity className="w-10 h-10 animate-pulse text-accent" />
        <div className="space-y-2 text-center">
          <p className="text-xs tracking-[0.4em] uppercase font-bold animate-pulse">Synchronizing_Core</p>
          <p className="text-[10px] text-accent/40 font-mono italic">Initializing_Admin_Protocol_v4.2.0</p>
        </div>
      </div>
    </div>
  );

  // isAdmin logic is handled by the useEffect redirect above
  // if isAdmin is still true here, it means navigate hasn't fired yet
  if (isAdmin) return null;

  return (
    <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent">
      <div className="w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 border border-accent/20 bg-accent/5 mb-8 rounded-full">
           <ShieldCheck className="w-10 h-10 text-accent animate-pulse" />
        </div>
        
        <h1 className="text-3xl font-bold text-white tracking-tighter mb-4 italic">RESTRICTED_ACCESS</h1>
        <p className="text-text-muted text-sm font-mono uppercase tracking-[0.2em] mb-12">
          Identity Verification Required via System Terminal.
        </p>

        <div className="space-y-8 p-10 border border-border bg-bg-card/50 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2">
            <Activity className="w-3 h-3 text-accent" />
          </div>
          
          <div className="text-left space-y-4">
             <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-accent text-accent flex items-center justify-center text-[10px] font-mono mt-1">1</div>
                <div>
                   <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-1">Invoke Terminal</p>
                   <p className="text-[10px] text-text-muted leading-relaxed">Press <kbd className="bg-white/10 px-1.5 py-0.5 rounded text-white font-mono">ESC</kbd> or click the terminal icon on the main screen.</p>
                </div>
             </div>

             <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-accent text-accent flex items-center justify-center text-[10px] font-mono mt-1">2</div>
                <div>
                   <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-1">Execute Command</p>
                   <p className="text-[10px] text-text-muted leading-relaxed">Type <code className="text-accent underline">su</code> and hit Enter.</p>
                </div>
             </div>

             <div className="flex items-start gap-4">
                <div className="w-6 h-6 border border-accent text-accent flex items-center justify-center text-[10px] font-mono mt-1">3</div>
                <div>
                   <p className="text-[11px] text-white font-bold uppercase tracking-widest mb-1">Auth_Challenge</p>
                   <p className="text-[10px] text-text-muted leading-relaxed">Input the administrative passcode to decrypt the console.</p>
                </div>
             </div>
          </div>
        </div>

        <a href="/" className="inline-block mt-12 text-[10px] font-mono text-text-muted hover:text-accent transition-colors uppercase tracking-widest shadow-sm">
          &larr; Return to Central System
        </a>
      </div>
    </div>
  );
};
