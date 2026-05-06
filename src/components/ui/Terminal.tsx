import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ input: string; output: string }[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [accessLevel, setAccessLevel] = useState<'Guest' | 'Admin'>('Guest');
  const [isPromptingPass, setIsPromptingPass] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const logCommand = async (cmd: string, output: string, authorized: boolean) => {
    try {
      await addDoc(collection(db, 'terminal_logs'), {
        command: cmd,
        output: output.substring(0, 500), // Truncate output for storage
        isAuthorized: authorized,
        userId: auth.currentUser?.uid || 'GUEST',
        userAgent: window.navigator.userAgent,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error('Failed to log command:', e);
    }
  };

  const simulateOperation = async (msg: string, duration: number = 2000) => {
    setIsProcessing(true);
    let progress = 0;
    const steps = 10;
    const interval = duration / steps;

    const entryId = Date.now();
    setHistory(prev => [...prev, { input: input, output: `<div id="proc-${entryId}">${msg}<br>[          ] 0%</div>` }]);

    for (let i = 1; i <= steps; i++) {
        await new Promise(r => setTimeout(r, interval));
        progress = i * 10;
        const bar = '='.repeat(i) + ' '.repeat(steps - i);
        setHistory(prev => prev.map((e, idx) => {
            if (idx === prev.length - 1) {
                return { ...e, output: `${msg}<br>[${bar}] ${progress}%` };
            }
            return e;
        }));
    }
    setIsProcessing(false);
  };

  // Load persistence
  useEffect(() => {
    const savedAccess = localStorage.getItem('term_access');
    if (savedAccess === 'Admin') setAccessLevel('Admin');
  }, []);

  const GUEST_COMMANDS: Record<string, string> = {
    'help': 'Available: <span class="text-accent">ls</span>, <span class="text-accent">sys-stat</span>, <span class="text-accent">projects</span>, <span class="text-accent">su</span>, <span class="text-accent">modules</span>, <span class="text-accent">clear</span>, <span class="text-accent">whoami</span>, <span class="text-accent">neofetch</span>',
    'ls': 'projects/<br>logs/<br>resumes/<br>configs/<br>README.md<br>protocol_alpha.bin',
    'sys-stat': 'Node: DLA-01<br>Uptime: 1,442 Hours<br>Latency: 42ms (Edge Node)<br>Load: 0.12, 0.08, 0.05<br>Security: AES-256-GCM Active',
    'projects': 'Fetching build manifests...<br>- [SOS_OFFLINE]: Resilient BLE Mesh network.<br>- [M_PAY_BRIDGE]: USSD-to-API abstraction.<br>- [GUSTO_SYNC]: SQLite-WatermelonDB conflict engine.<br>- [BOT_BILL]: NLU SMS processing automation.',
    'modules': 'Admin modules are <span class="text-red-500">RESTRICTED</span>. Elevate to ADMIN level to view.',
    'module': 'Admin modules are <span class="text-red-500">RESTRICTED</span>. Elevate to ADMIN level to view.',
    'whoami': 'Identity: guest_session_v4. Perspective: Read-Only.',
    'su': 'PROMPT_PASSWORD',
    'neofetch': '<span class="text-accent">etienne@DLA-01</span><br>-----------------<br><span class="text-accent">OS</span>: ResilienceOS v4.0.2 x86_64<br><span class="text-accent">Host</span>: Custom Edge Node<br><span class="text-accent">Kernel</span>: 6.2.0-secure-hardened<br><span class="text-accent">Uptime</span>: 60 days, 2 hours<br><span class="text-accent">Packages</span>: 42 (npm), 812 (total)<br><span class="text-accent">Shell</span>: dlash 2.4<br><span class="text-accent">CPU</span>: ARM Cortex-A72 (4) @ 1.500GHz<br><span class="text-accent">Memory</span>: 1.2GiB / 4.0GiB',
    'clear': 'CLEARED'
  };

  const ADMIN_COMMANDS: Record<string, string> = {
    'help': 'ADMIN_PROTOCOLS: <span class="text-accent">open [module]</span>, <span class="text-accent">upload [file]</span>, <span class="text-accent">download [file]</span>, <span class="text-accent">modules</span>, <span class="text-accent">sys-logs</span>, <span class="text-accent">db-status</span>, <span class="text-accent">exit</span>, <span class="text-accent">clear</span>, <span class="text-accent">neofetch</span>',
    'modules': 'Available Admin Modules:<br>- [home]: Main portfolio interface.<br>- [projects]: Build & deployment management.<br>- [analytics]: Traffic & intrusion logs.<br>- [health]: Regional node integrity.',
    'module': 'Available Admin Modules:<br>- [home]: Main portfolio interface.<br>- [projects]: Build & deployment management.<br>- [analytics]: Traffic & intrusion logs.<br>- [health]: Regional node integrity.',
    'open': 'Usage: open [home | projects | analytics | health]',
    'upload': 'Usage: upload [filename]',
    'download': 'Usage: download [filename]',
    'sys-logs': 'Fetching raw logs...<br>[2026.05.06 14:02] Unauthorized GET /api/v1/root rejected.<br>[2026.05.06 14:10] Firebase Auth tunnel established.<br>[2026.05.06 14:15] Rule deployment successful.',
    'db-status': 'Firestore Connection: <span class="text-accent">STABLE</span><br>Write Indexing: <span class="text-green-500">OPTIMIZED</span><br>Cache Hit: 89%',
    'whoami': 'Identity: ADMIN_ETIENNE. Access: Full RW/Control.',
    'neofetch': '<span class="text-accent">admin@DLA-01</span><br>-----------------<br><span class="text-accent">OS</span>: ResilienceOS v4.0.2 x86_64<br><span class="text-accent">Privileges</span>: ROOT_LEVEL<br><span class="text-accent">Kernel</span>: 6.2.0-secure-hardened<br><span class="text-accent">Memory</span>: 2.1GiB / 8.0GiB (Provisioned)',
    'exit': 'LOGOUT_SUCCESS',
    'clear': 'CLEARED'
  };

  const handleCommand = async (cmdText: string) => {
    const args = cmdText.trim().split(' ');
    const cmd = args[0].toLowerCase();
    
    // Log sensitive command attempts (elevated commands or su)
    const isElevated = accessLevel === 'Admin';
    
    setCommandHistory(prev => [cmdText, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);

    if (isPromptingPass) {
      if (cmdText === 'Pandora') {
        setAccessLevel('Admin');
        localStorage.setItem('term_access', 'Admin');
        setIsPromptingPass(false);
        setHistory(prev => [...prev, { input: '********', output: 'ACCESS_GRANTED: Welcome back, Etienne.' }]);
        logCommand('su (SUCCESS)', 'Elevated to Admin', true);
      } else {
        setIsPromptingPass(false);
        setHistory(prev => [...prev, { input: '********', output: '<span class="text-red-500">ERR: AUTH_FAILURE. Incident recorded.</span>' }]);
        logCommand(`su (FAILURE: ${cmdText})`, 'Unauthorized attempt', false);
      }
      return;
    }

    if (cmd === 'su') {
        const pass = args[1];
        if (pass === 'Pandora') {
            setAccessLevel('Admin');
            localStorage.setItem('term_access', 'Admin');
            setHistory(prev => [...prev, { input: cmdText, output: 'ACCESS_GRANTED: Welcome back, Etienne.' }]);
            logCommand(cmdText, 'Elevated to Admin (Direct)', true);
            return;
        } else if (pass) {
            setHistory(prev => [...prev, { input: cmdText, output: '<span class="text-red-500">ERR: AUTH_FAILURE. Incident recorded.</span>' }]);
            logCommand(cmdText, 'Unauthorized attempt', false);
            return;
        }
        
        setIsPromptingPass(true);
        setHistory(prev => [...prev, { input: 'su', output: 'Password required for elevation:' }]);
        return;
    }

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'exit' && accessLevel === 'Admin') {
      setAccessLevel('Guest');
      localStorage.removeItem('term_access');
      setHistory(prev => [...prev, { input: 'exit', output: 'Elevation revoked. Returned to GUEST_SHELL.' }]);
      logCommand('exit', 'Elevation revoked', true);
      return;
    }

    if (cmd === 'upload' && accessLevel === 'Admin') {
        const file = args[1] || 'unnamed_payload.bin';
        await simulateOperation(`Uploading ${file} to regional cloud cluster...`);
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output += `<br><span class="text-accent">SUCCESS: ${file} verified and stored.</span>`;
            return newHistory;
        });
        logCommand(cmdText, `Uploaded ${file}`, true);
        return;
    }

    if (cmd === 'download' && accessLevel === 'Admin') {
        const file = args[1] || 'secure_manifest.pdf';
        await simulateOperation(`Decrypting and streaming ${file} from edge node...`);
        setHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1].output += `<br><span class="text-accent">SUCCESS: ${file} received. File hash matches.</span>`;
            return newHistory;
        });
        logCommand(cmdText, `Downloaded ${file}`, true);
        return;
    }

    if (cmd === 'open' && accessLevel === 'Admin') {
        const target = args[1]?.toLowerCase();
        if (['projects', 'analytics', 'health', 'home'].includes(target)) {
            logCommand(cmdText, `Opened ${target}`, true);
            if (target === 'home') {
              setHistory(prev => [...prev, { input: cmdText, output: 'Closing terminal and returning to main system...' }]);
              setTimeout(() => navigate('/'), 1000);
              return;
            }
            const path = target === 'projects' ? '/admin/projects' : `/admin/${target === 'health' ? 'health' : target}`;
            setHistory(prev => [...prev, { input: cmdText, output: `Redirecting to ${target} module...` }]);
            setTimeout(() => navigate(path), 1000);
            return;
        }
        setHistory(prev => [...prev, { input: cmdText, output: 'ERR: Unknown module. Try: home, projects, analytics, health.' }]);
        logCommand(cmdText, 'Invalid module', true);
        return;
    }

    if (cmd === 'purge' && accessLevel === 'Admin') {
        const target = args[1]?.toLowerCase();
        const pass = args[2];
        if (target === 'logs') {
            if (pass === 'Pandoralogs') {
                setHistory(prev => [...prev, { input: cmdText, output: 'PURGING_TELEMETRY: All terminal logs have been wiped.' }]);
                // We'd need to trigger the actual delete here, but for now we simulate the command.
                // In a real app, we'd call a function to clear the collection.
                logCommand(cmdText, 'Logs purged', true);
                return;
            }
            setHistory(prev => [...prev, { input: cmdText, output: 'ERR: INVALID_KEY. Enter correct password to purge.' }]);
            return;
        }
    }

    const dict = accessLevel === 'Admin' ? ADMIN_COMMANDS : GUEST_COMMANDS;
    let output = dict[cmd];

    if (!output && accessLevel === 'Guest' && ADMIN_COMMANDS[cmd]) {
        output = '<span class="text-red-500 animate-pulse">ERR: PRIVILEGE_VIOLATION. This incident will be reported.</span>';
        setHistory(prev => [...prev, { input: cmdText, output }]);
        logCommand(cmdText, 'UNAUTHORIZED_ADMIN_COMMAND_ATTEMPT', false);
        return;
    }

    if (!output) output = `ERR: Command '${cmd}' not recognized. Type 'help' for protocols.`;
    
    setHistory(prev => [...prev, { input: cmdText, output }]);
    
    // Log general commands
    logCommand(cmdText, output.replace(/<[^>]*>?/gm, ''), isElevated);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        } else if (historyIndex === 0) {
            setHistoryIndex(-1);
            setInput('');
        }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    handleCommand(input.trim());
    setInput('');
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  return (
    <div id="terminal-interface" className="max-w-4xl mx-auto border border-border bg-[#050505] shadow-2xl relative overflow-hidden h-[450px] flex flex-col">
      <div className="bg-white/5 p-3 px-6 flex items-center justify-between border-b border-border">
        <div className="flex gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500/50" />
          <div className="w-2 h-2 rounded-full bg-orange-500/50" />
          <div className={cn("w-2 h-2 rounded-full", accessLevel === 'Admin' ? "bg-accent" : "bg-accent/50")} />
        </div>
        <div className={cn(
            "text-[10px] font-mono uppercase tracking-widest flex items-center gap-2",
            accessLevel === 'Admin' ? "text-accent font-bold" : "text-text-muted"
        )}>
          <TerminalIcon className="w-3 h-3" /> System_Access: {accessLevel}
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 p-6 font-mono text-sm overflow-y-auto no-scrollbar space-y-4">
        <div className="text-accent/40 mb-4">$ system_buffer_initialized [LEVEL_{accessLevel.toUpperCase()}]</div>
        {history.map((entry, i) => (
          <div key={i}>
            <div className="flex gap-2 text-accent mb-2">
              <span className="shrink-0">{accessLevel.toLowerCase()}@etienne:~$</span>
              <span className="text-white">{entry.input}</span>
            </div>
            <div className="text-text-muted mb-4 pl-4 border-l border-border" dangerouslySetInnerHTML={{ __html: entry.output }} />
          </div>
        ))}
        
        <form onSubmit={handleSubmit} className="flex gap-2 text-accent">
          <span className="shrink-0">{accessLevel.toLowerCase()}@etienne:~$</span>
          <input 
            type={isPromptingPass ? "password" : "text"} 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-white w-full focus:ring-0" 
            autoFocus 
            autoComplete="off"
            spellCheck="false"
            disabled={isProcessing}
          />
        </form>
      </div>
    </div>
  );
};
