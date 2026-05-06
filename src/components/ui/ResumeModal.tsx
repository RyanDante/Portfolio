import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download } from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[300]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-[301] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-4xl p-8 bg-[#080808] border border-border shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/10 to-transparent pointer-events-none" />
              <button 
                onClick={onClose} 
                className="absolute top-4 right-4 text-gray-600 hover:text-white transition-colors p-2"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="md:col-span-1 border-r border-border pr-8">
                  <div className="mb-12">
                    <h2 className="text-3xl font-bold text-white mb-2">Personnel</h2>
                    <p className="text-accent font-mono text-[10px] uppercase tracking-widest">Record_45.DLA</p>
                  </div>
                  <div className="space-y-8">
                    <div>
                      <span className="block text-[10px] font-mono text-gray-600 mb-2 uppercase tracking-widest">Core_Competency</span>
                      <ul className="text-xs space-y-3 text-gray-400">
                        <li className="flex items-center gap-2"><div className="h-1 w-1 bg-accent rounded-full shrink-0" />Mobile-First Architecture</li>
                        <li className="flex items-center gap-2"><div className="h-1 w-1 bg-accent rounded-full shrink-0" />USSD & Fintech Bridges</li>
                        <li className="flex items-center gap-2"><div className="h-1 w-1 bg-accent rounded-full shrink-0" />Constraint Engineering</li>
                      </ul>
                    </div>
                    <div>
                      <span className="block text-[10px] font-mono text-gray-600 mb-2 uppercase tracking-widest">Identity</span>
                      <p className="text-xs text-white">Etienne Dante</p>
                      <p className="text-[10px] text-gray-500">Software Engineer | Douala, CMR</p>
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-xs font-mono text-white/40 uppercase mb-8 tracking-widest">/ deployment_history</h3>
                  <div className="space-y-10">
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-lg font-bold text-white tracking-tight text-glow">Independent Systems Engineer</h4>
                        <span className="text-[10px] font-mono text-accent">2023 - PRESENT</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">Building production-grade mobile interfaces and offline-sync engines for local commerce. Specialized in bridging the "Internet Gap" for retail vendors using automated mobile money triggers.</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-lg font-bold text-white tracking-tight">Tech Solutions Developer (Freelance)</h4>
                        <span className="text-[10px] font-mono text-accent">2021 - 2023</span>
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">Focused on WordPress to Native transitions and developing highly customized Telegram/WhatsApp bot logic for automated bill collection.</p>
                    </div>
                    <div className="pt-6 border-t border-border">
                      <button className="inline-flex items-center gap-3 text-xs font-bold text-accent hover:text-white transition-colors group tracking-widest uppercase font-mono">
                        DOWNLOAD_FULL_REDACTED_CV.PDF 
                        <Download className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
