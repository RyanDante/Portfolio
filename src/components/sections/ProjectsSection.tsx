import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useProjectsContext } from '../../context/ProjectsContext';
import { ProjectCard } from '../ui/ProjectCard';
import { Project } from '../../types';
import { cn } from '../../lib/utils';
import { Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone } from 'lucide-react';

const iconMap: Record<string, any> = {
  Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone
};

interface ProjectsSectionProps {
  onProjectClick: (project: Project) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ onProjectClick }) => {
  const [techFilter, setTechFilter] = useState('ALL');
  const { projects, loading } = useProjectsContext();

  const UNIQUE_TECHS = React.useMemo(() => {
    const techs = new Set(['ALL']);
    projects.forEach(p => p.stack.forEach(s => techs.add(s.toUpperCase())));
    return Array.from(techs).sort((a, b) => a === 'ALL' ? -1 : b === 'ALL' ? 1 : a.localeCompare(b));
  }, [projects]);

  const filteredProjects = projects.filter(p => 
    techFilter === 'ALL' || p.stack.some(s => s.toUpperCase() === techFilter)
  );

  if (loading) return (
    <div className="py-40 text-center animate-pulse font-mono text-accent">
      SYNCING_BUILD_MANIFESTS...
    </div>
  );

  return (
    <section id="projects" className="py-40 px-6 lg:pl-44 lg:pr-24 bg-bg-card/30">
      <div className="max-w-7xl mx-auto">
        <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-4">/ deployments_log</h2>
            <h3 className="text-4xl md:text-7xl font-bold text-white tracking-tighter">Core Projects</h3>
          </div>
          <div className="flex flex-col items-end gap-6">
            <div className="text-text-muted font-mono text-xs uppercase text-right leading-loose hidden md:block">
              Focusing on practical solutions for high-latency environments.
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              {UNIQUE_TECHS.map(tech => (
                <button 
                  key={tech}
                  onClick={() => setTechFilter(tech)}
                  className={cn(
                    "text-[9px] font-mono px-3 py-1 border transition-all uppercase tracking-widest",
                    techFilter === tech 
                      ? "bg-accent text-black border-accent" 
                      : "border-border text-text-muted hover:border-accent/40"
                  )}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 lg:grid-cols-2 gap-1 px-1 bg-white/5 border border-border"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map(project => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard 
                  project={project} 
                  onClick={() => onProjectClick(project)} 
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
