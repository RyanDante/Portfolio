import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

export const Hero: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-6 pt-20 lg:pl-44 lg:pr-24 overflow-hidden">
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-3 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-[10px] font-mono text-accent uppercase tracking-widest leading-none">Status: Available for Systems Core Deployment</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-white mb-8 leading-[0.95]">
            {config?.heroTitle || 'BUILDING RESILIENT CORE SYSTEMS.'}
          </h1>
          
          <div className="text-lg md:text-xl text-text-muted max-w-xl mb-12 font-light leading-relaxed whitespace-pre-line">
            {config?.heroSubtitle || <>Specializing in <span className="text-white font-normal underline decoration-accent/30">offline-first mobile architecture</span> and payment bridges for the Global South.</>}
          </div>

          <div className="flex flex-col sm:flex-row gap-6">
            <a href="#projects" className="btn-primary group flex items-center justify-center gap-4 px-10 py-5 bg-accent text-black font-bold uppercase tracking-widest text-[11px] hover:bg-white transition-colors">
              View Build Manifest <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href={`mailto:${config?.email || 'emperordante123@gmail.com'}`} className="px-10 py-5 border border-border text-white font-bold uppercase tracking-widest text-[11px] hover:bg-white/5 transition-colors flex items-center justify-center">
              System Sync
            </a>
          </div>
        </motion.div>

        <div className="hidden lg:block relative">
          <div className="absolute inset-0 bg-accent/10 blur-[120px] rounded-full animate-pulse" />
          <div className="relative border border-border p-12 bg-black/40 backdrop-blur-md">
            {config?.profileImageUrl && (
                <div className="absolute -top-12 -right-12 w-32 h-32 border border-accent bg-black p-2 z-10 rotate-3">
                    <img src={config.profileImageUrl} alt="Identity Assets" className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                </div>
            )}
            <pre className="text-[10px] font-mono text-accent/60 leading-relaxed overflow-hidden whitespace-pre">
{`{
  "engineer": "${config?.memberName || 'Etienne Dante'}",
  "title": "${config?.memberTitle || 'Fullstack Engineer'}",
  "location": "Douala (DLA)",
  "timezone": "UTC+1",
  "status": "Online_Active",
  "mission": "Bridging Digital Gaps"
}`}
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
