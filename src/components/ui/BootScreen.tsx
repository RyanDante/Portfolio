import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

interface BootScreenProps {
  onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const messages = [
    '> INITIALIZING CORE_SYSTEM_V4...',
    '> LOADING KERNEL MODULES...',
    '> AUTHENTICATING ACCESS_TOKEN...',
    '> ACCESS GRANTED: ETIENNE.LOG',
    '> SYNCING DEPLOYMENT MANIFESTS...',
    '> SYSTEM READY.'
  ];

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < messages.length) {
        setLogs(prev => [...prev, messages[index]]);
        index++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 800);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black flex items-center justify-center font-mono p-8 overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,194,1)_50%)] bg-[length:100%_4px] pointer-events-none" />
      <div className="max-w-md w-full">
        {logs.map((log, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }}
            className={cn("mb-2 text-sm", i === messages.length - 1 ? "text-accent font-bold" : "text-accent/60")}
          >
            {log}
          </motion.div>
        ))}
        {logs.length < messages.length && (
          <motion.div animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="h-4 w-2 bg-accent inline-block ml-1" />
        )}
      </div>
    </motion.div>
  );
};
