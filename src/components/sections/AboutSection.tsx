import React from 'react';
import { motion } from 'motion/react';
import { Github, Linkedin } from 'lucide-react';
import { useConfig } from '../../hooks/useConfig';

export const AboutSection: React.FC = () => {
  const { config } = useConfig();

  return (
    <section id="about" className="py-40 px-6 lg:pl-44 lg:pr-24 bg-bg-card/20 grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <motion.div 
        initial={{ opacity: 0, filter: 'blur(10px)' }}
        whileInView={{ opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        className="relative order-2 lg:order-1"
      >
        <div className="absolute -inset-4 border border-white/5 scale-[1.02] -z-10" />
        <div className="absolute inset-0 bg-accent/5 -z-20" />
        <img 
          src={config?.profileImageUrl || "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070"} 
          alt="System Engineering" 
          loading="lazy"
          className="w-full grayscale border border-border" 
          referrerPolicy="no-referrer"
        />
      </motion.div>
      <div className="order-1 lg:order-2">
        <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-8">/ identity_stub</h2>
        <h3 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-10 leading-tight">
          {config?.memberTitle || 'Engineering for Constraints.'}
        </h3>
        <div className="space-y-6 text-text-muted leading-relaxed font-light whitespace-pre-line">
          {config?.aboutText || (
            <>
              <p>I build engineering systems that don't assume a perfect environment. My work focuses on the African digital infrastructure, where data is expensive, networks are inconsistent, and hardware is often low-end.</p>
              <p>Whether it's a mobile money bridge for a street vendor or a mesh-based emergency alert for urban centers, I prioritize performance and reliability over flashy features.</p>
            </>
          )}
        </div>
        <div className="mt-12 flex gap-8">
          <a href={config?.githubUrl || "https://github.com/dante-eng"} target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors"><Github className="w-5 h-5" /></a>
          <a href={config?.linkedinUrl || "https://linkedin.com/in/etiennedante"} target="_blank" rel="noreferrer" className="text-text-muted hover:text-white transition-colors"><Linkedin className="w-5 h-5" /></a>
        </div>
      </div>
    </section>
  );
};
