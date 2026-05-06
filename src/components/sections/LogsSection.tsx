import React from 'react';
import { motion } from 'motion/react';
import { LOGS } from '../../data/mockData';

export const LogsSection: React.FC = () => {
  return (
    <section id="logs" className="py-40 px-6 lg:pl-44 lg:pr-24 border-t border-border">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xs font-mono text-accent uppercase tracking-[0.3em] mb-12">/ technical_stubs</h2>
        <div className="space-y-4">
          {LOGS.map(log => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 bg-bg-card border border-border group hover:border-accent/40 lg:flex gap-12 transition-colors"
            >
              <div className="shrink-0 mb-4 lg:mb-0">
                <div className="text-[10px] font-mono text-text-muted mb-1">{log.id}</div>
                <div className="text-[10px] font-mono text-accent uppercase tracking-widest">{log.tag}</div>
              </div>
              <div>
                <h4 className="text-lg font-bold text-white mb-3 tracking-tight group-hover:text-accent transition-colors">{log.title}</h4>
                <p className="text-sm text-text-muted leading-relaxed font-light">{log.body}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
