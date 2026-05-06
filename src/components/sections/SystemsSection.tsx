import React from 'react';
import { cn } from '../../lib/utils';

const SYSTEMS = [
  { id: '01', color: 'accent', title: 'MoMo Bridges', text: 'USSD gateways and payment automation logic for local markets.', label: 'Payments' },
  { id: '02', color: 'orange-500', title: 'Offline-First', text: 'Resilient sync protocols for high-latency environments.', label: 'Architecture' },
  { id: '03', color: 'accent', title: 'Chat-as-UX', text: 'Conversational logic for business process automation.', label: 'Interface' },
  { id: '04', color: 'orange-500', title: 'Real-World', text: 'Edge-case handling for unstable technology stacks.', label: 'Logic' },
];

export const SystemsSection: React.FC = () => {
  return (
    <section id="systems" className="py-40 px-6 lg:pl-44 lg:pr-24 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-12">/ sys_architectures</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEMS.map((box) => (
            <div 
              key={box.id} 
              className={cn(
                "p-6 border border-border bg-bg-card transition-all hover:border-accent/40 border-l-2", 
                box.id === '01' || box.id === '03' ? "border-l-accent" : "border-l-orange-500"
              )}
            >
              <p className="text-[9px] font-mono text-text-muted mb-3 uppercase tracking-widest">{box.id}_{box.label}</p>
              <h4 className="text-sm font-semibold text-white mb-2">{box.title}</h4>
              <p className="text-[10px] text-text-muted leading-relaxed font-light">{box.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
