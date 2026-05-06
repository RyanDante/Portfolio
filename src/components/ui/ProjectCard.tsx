import React, { useRef } from 'react';
import { motion } from 'motion/react';
import { Project } from '../../types';
import { cn } from '../../lib/utils';
import { Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone, Image as ImageIcon } from 'lucide-react';

const iconMap: Record<string, any> = {
  Radio, Wallet, MessageSquare, Utensils, Box, ShieldCheck, Zap, Globe, Cpu, Database, Server, Code2, Monitor, Smartphone
};

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const statusConfig = {
  PROD_READY: { label: 'PROD_READY', color: 'text-accent border-accent/20 bg-accent/5' },
  BETA_DEV: { label: 'BETA_DEV', color: 'text-orange-500 border-orange-500/20 bg-orange-500/5' },
  STABLE: { label: 'STABLE', color: 'text-blue-400 border-blue-400/20 bg-blue-400/5' },
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const status = statusConfig[project.status];
  const IconComponent = iconMap[project.iconName] || Box;

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;
    
    cardRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group p-8 md:p-12 bg-bg-card border border-border hover:bg-[#0d0d0d] transition-all relative overflow-hidden cursor-pointer flex flex-col h-full perspective-1000"
      style={{ transformStyle: 'preserve-3d', transition: 'all 0.3s ease-out' }}
    >
      {/* Background Image Layer */}
      {project.imageUrl && (
        <div 
          className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700 pointer-events-none grayscale group-hover:grayscale-0 scale-110 group-hover:scale-100"
          style={{ 
            backgroundImage: `url(${project.imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      <div className="absolute top-0 left-0 w-[2px] h-0 bg-accent group-hover:h-full transition-all duration-300" />
      <div className="flex justify-between items-start mb-12 translate-z-[20px]">
        <div className="text-accent opacity-50 group-hover:opacity-100 transition-opacity">
          <IconComponent className="w-8 h-8" />
        </div>
        <span className={cn(
          "text-[9px] font-mono px-2 py-0.5 border uppercase tracking-widest",
          status.color
        )}>
          {status.label}
        </span>
      </div>
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-2xl font-bold text-white tracking-tight translate-z-[15px] group-hover:text-glow transition-all">{project.title}</h4>
        {project.images && project.images.length > 1 && (
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-accent/60 bg-accent/5 border border-accent/20 px-2 py-0.5">
                <ImageIcon className="w-3 h-3" />
                <span>{project.images.length}</span>
            </div>
        )}
      </div>
      <p className="text-text-muted text-sm mb-8 max-w-md translate-z-[10px]">
        <span className="text-[10px] font-mono uppercase text-accent/60 block mb-2">Problem_Space</span>
        {project.problemSpace}
      </p>
      <div className="flex gap-2 flex-wrap mb-8 mt-auto translate-z-[5px]">
        {project.stack.slice(0, 3).map(tag => (
          <span key={tag} className="text-[9px] font-mono px-2 py-0.5 border border-[#222] bg-[#111] uppercase text-[#666] group-hover:text-accent group-hover:border-accent/40 transition-all">
            {tag}
          </span>
        ))}
      </div>
      <button className="w-full py-2 bg-[#111] border border-[#222] text-[10px] font-mono text-[#666] group-hover:border-accent group-hover:text-accent transition-all uppercase tracking-widest">
        Deployment Details
      </button>
    </motion.div>
  );
};
