import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone, Play, Image as ImageIcon } from 'lucide-react';
import { Project } from '../../types';
import { cn } from '../../lib/utils';

const iconMap: Record<string, any> = {
  Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone
};

interface SlideOverProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SlideOver: React.FC<SlideOverProps> = ({ project, isOpen, onClose }) => {
  const IconComponent = project ? (iconMap[project.iconName] || Box) : Box;

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
        return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
        return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    return null;
  };
  
  const handleViewCode = () => {
    if (project?.repoUrl) {
      window.open(project.repoUrl, '_blank');
    } else {
      alert('This repository is currently private. Please contact the administrator for access.');
    }
  };

  const VideoPlayer = ({ url, className }: { url: string; className?: string }) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const embedUrl = getEmbedUrl(url);

    const toggleFullscreen = () => {
        if (videoRef.current) {
            if (videoRef.current.requestFullscreen) {
                videoRef.current.requestFullscreen();
            }
        }
    };

    if (embedUrl) {
        return (
            <iframe 
                src={embedUrl}
                className={cn("w-full h-full", className)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        );
    }

    return (
        <div className={cn("relative group", className)}>
            <video 
                ref={videoRef}
                src={url} 
                className="w-full h-full object-cover" 
                controls
            />
            <button 
                onClick={toggleFullscreen}
                className="absolute bottom-4 right-4 p-2 bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent hover:text-black"
                title="Full Screen"
            >
                <Monitor className="w-4 h-4" />
            </button>
        </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && project && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 w-full md:w-[600px] bg-[#050505] border-l border-accent/20 z-[201] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.8)]"
          >
            <div className="p-6 border-b border-border flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 border border-accent/20 flex items-center justify-center text-accent">
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-white font-bold tracking-tight">{project.title}</h2>
                  <p className="text-[10px] font-mono text-accent/60 uppercase">{project.tagline}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 font-light text-gray-400 space-y-12 no-scrollbar">
              {/* Media Section - Primary Hero */}
              {(project.imageUrl || project.videoUrl) && (
                <div className="space-y-4">
                  {project.videoUrl ? (
                    <div className="aspect-video w-full bg-black border border-white/5 relative group overflow-hidden">
                      <VideoPlayer url={project.videoUrl} />
                    </div>
                  ) : (
                    project.imageUrl && (
                      <div className="aspect-video w-full bg-black border border-white/5 overflow-hidden">
                        <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-8 py-4 border-b border-white/5">
                <div>
                  <span className="block text-[10px] font-mono text-gray-600 mb-1 uppercase">RUNTIME_ENV</span>
                  <span className="text-sm text-white">{project.env}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-gray-600 mb-1 uppercase">STABLE_SINCE</span>
                  <span className="text-sm text-white">{project.stableSince}</span>
                </div>
              </div>

              {/* Gallery Section - Overview Assets */}
              {((project.images && project.images.length > 1) || (project.videos && project.videos.length > 1)) && (
                <section>
                    <h3 className="text-xs font-mono text-accent uppercase mb-4 tracking-widest">/ field_overview_assets</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {/* Other Images */}
                        {project.images?.slice(1).map((img, i) => (
                            <div key={`img-${i}`} className="aspect-[4/3] bg-black border border-white/5 overflow-hidden group">
                                <img 
                                    src={img} 
                                    alt={`Overview ${i}`} 
                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer" 
                                    referrerPolicy="no-referrer"
                                    onClick={() => window.open(img, '_blank')}
                                />
                            </div>
                        ))}
                        {/* Other Videos */}
                        {project.videos?.slice(1).map((vid, i) => (
                             <div key={`vid-${i}`} className="aspect-[4/3] bg-black border border-white/5 overflow-hidden relative group">
                                <VideoPlayer url={vid} className="opacity-60 group-hover:opacity-100 transition-opacity" />
                             </div>
                        ))}
                    </div>
                </section>
              )}

              <section>
                <h3 className="text-xs font-mono text-accent uppercase mb-4 tracking-widest">/ tactical_overview</h3>
                <p className="text-sm leading-relaxed mb-6">{project.description}</p>
                <div className="space-y-4">
                  {project.features.map((f, i) => (
                    <div key={i} className="border-l border-accent/20 pl-4 py-1">
                      <strong className="text-white text-xs block mb-1 uppercase tracking-tighter">{f.name}</strong>
                      <p className="text-[11px] font-light">{f.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xs font-mono text-accent uppercase mb-4 tracking-widest">/ core_impact_report</h3>
                <p className="text-sm border-l-2 border-accent/40 pl-6 py-2 italic text-gray-400">
                  {project.impact}
                </p>
              </section>

              <section>
                <h3 className="text-xs font-mono text-white/40 uppercase mb-4 tracking-widest">/ engineering_stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(s => (
                    <span key={s} className="text-[9px] font-mono px-2 py-0.5 border border-[#222] bg-[#111] uppercase text-[#666]">
                      {s}
                    </span>
                  ))}
                </div>
              </section>

              <section className="p-6 bg-accent/[0.03] border border-accent/10 rounded-sm">
                <h3 className="text-[10px] font-mono text-accent uppercase mb-3 tracking-widest">System Logic Summary</h3>
                <p className="text-xs italic leading-relaxed text-gray-500">{project.logic}</p>
              </section>
            </div>

            <div className="p-8 border-t border-border bg-black/40">
              <button 
                onClick={handleViewCode}
                className="flex items-center justify-center gap-3 bg-accent text-black px-8 py-4 font-bold uppercase tracking-widest text-[10px] hover:bg-white transition-colors w-full"
              >
                View Repository Code <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
