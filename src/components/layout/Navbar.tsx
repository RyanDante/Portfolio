import React from 'react';
import { LayoutGrid, Cpu, MessageSquare, Terminal as TerminalIcon, Fingerprint, Zap, UserRoundSearch } from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavbarProps {
  activeSection: string;
  onOpenResume: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection, onOpenResume }) => {
  return (
    <nav className="fixed left-0 top-0 bottom-0 w-20 flex-col justify-between items-center py-10 bg-bg-main border-r border-border hidden lg:flex z-50">
      <div className="font-bold text-accent text-xl tracking-tighter">S.B</div>
      <div className="flex flex-col gap-8">
        <a 
          href="#home" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'home' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="Home"
        >
          <Zap className="w-5 h-5" />
        </a>
        <a 
          href="#projects" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'projects' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="Projects"
        >
          <LayoutGrid className="w-5 h-5" />
        </a>
        <a 
          href="#systems" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'systems' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="Systems"
        >
          <Cpu className="w-5 h-5" />
        </a>
        <button 
          onClick={onOpenResume} 
          className="p-3 text-text-muted transition-all hover:text-accent"
          title="Resume"
        >
          <UserRoundSearch className="w-5 h-5" />
        </button>
        <a 
          href="#logs" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'logs' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="Logs"
        >
          <MessageSquare className="w-5 h-5" />
        </a>
        <a 
          href="#terminal" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'terminal' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="Terminal"
        >
          <TerminalIcon className="w-5 h-5" />
        </a>
        <a 
          href="#about" 
          className={cn("p-3 transition-all hover:text-accent", activeSection === 'about' ? "text-accent bg-accent/5 rounded-sm" : "text-text-muted")}
          title="About"
        >
          <Fingerprint className="w-5 h-5" />
        </a>
      </div>
      <div className="h-10 w-[1px] bg-border" />
    </nav>
  );
};
