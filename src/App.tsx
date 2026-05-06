import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { BootScreen } from './components/ui/BootScreen';
import { Navbar } from './components/layout/Navbar';
import { Hero } from './components/sections/Hero';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { SystemsSection } from './components/sections/SystemsSection';
import { LogsSection } from './components/sections/LogsSection';
import { AboutSection } from './components/sections/AboutSection';
import { FeedbackSection } from './components/sections/FeedbackSection';
import { Terminal } from './components/ui/Terminal';
import { SlideOver } from './components/ui/SlideOver';
import { ResumeModal } from './components/ui/ResumeModal';
import { Project } from './types';
import { useAnalytics } from './hooks/useAnalytics';
import { ProjectsProvider } from './context/ProjectsContext';

// Admin Imports
import { AdminDashboard } from './components/admin/AdminDashboard';
import { Login } from './components/admin/Login';
import { useAuth } from './hooks/useAuth';

import { ErrorBoundary } from './components/ErrorBoundary';

function Portfolio() {
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { trackVisit } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    trackVisit(location.pathname);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'systems', 'logs', 'terminal', 'about'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el && window.scrollY >= el.offsetTop - 300) {
          setActiveSection(section);
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative selection:bg-accent selection:text-black">
      {/* Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_2px_2px,rgba(0,255,194,0.15)_1px,transparent_0)] bg-[length:40px_40px] [mask-image:radial-gradient(circle_at_center,black,transparent_80%)]" />
      </div>

      <Navbar 
        activeSection={activeSection} 
        onOpenResume={() => setIsResumeOpen(true)} 
      />

      <Hero />
      
      <ProjectsSection onProjectClick={(p) => setActiveProject(p)} />

      <SystemsSection />

      <LogsSection />

      <section id="terminal" className="py-40 px-6 lg:pl-44 lg:pr-24 flex items-center justify-center">
        <div className="w-full">
          <div className="flex flex-col items-center mb-16 text-center">
             <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-4">/ remote_shell</h2>
             <h3 className="text-3xl font-bold text-white tracking-tighter">System Interface</h3>
          </div>
          <Terminal />
        </div>
      </section>

      <AboutSection />

      <FeedbackSection />

      <footer className="py-20 px-6 lg:pl-44 lg:pr-24 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] uppercase text-text-muted tracking-widest">
          <div>© 2026 SYSTEM_BUILD_DLA. VER 4.0.2</div>
          <div className="flex gap-12">
            <a href="https://github.com/dante-eng" target="_blank" rel="noreferrer" className="hover:text-accent transition-colors">Git_Depot</a>
            <a href="/admin" className="hover:text-accent transition-colors">Admin_Terminal</a>
          </div>
        </div>
      </footer>

      <SlideOver 
        project={activeProject} 
        isOpen={!!activeProject} 
        onClose={() => setActiveProject(null)} 
      />
      <ResumeModal 
        isOpen={isResumeOpen} 
        onClose={() => setIsResumeOpen(false)} 
      />
    </div>
  );
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center font-mono text-accent">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-accent/20 rounded-full animate-ping" />
        <div className="absolute inset-0 w-16 h-16 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
      <span className="text-[10px] uppercase tracking-[0.5em] font-bold mt-8 animate-pulse text-glow">VERIFYING_CREDENTIALS...</span>
    </div>
  );

  if (!isAdmin) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

export default function App() {
  const [booting, setBooting] = useState(true);

  if (booting) return <BootScreen onComplete={() => setBooting(false)} />;

  return (
    <ErrorBoundary>
      <Router>
        <ProjectsProvider>
          <Routes>
            <Route path="/" element={<Portfolio />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Routes>
        </ProjectsProvider>
      </Router>
    </ErrorBoundary>
  );
}
