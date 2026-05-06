import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const FeedbackSection: React.FC = () => {
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setStatus('loading');
        try {
            await addDoc(collection(db, 'feedback'), {
                message: message.trim(),
                contact: contact.trim() || 'Anonymous',
                timestamp: serverTimestamp(),
                userAgent: navigator.userAgent
            });
            setStatus('success');
            setMessage('');
            setContact('');
            setTimeout(() => setStatus('idle'), 5000);
        } catch (error) {
            console.error('Feedback Error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 5000);
        }
    };

    return (
        <section id="contact" className="py-40 px-6 lg:pl-44 lg:pr-24">
            <div className="max-w-4xl mx-auto border border-border p-8 md:p-16 relative bg-bg-card/30 backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-1 h-20 bg-accent" />
                
                <div className="mb-12">
                    <h3 className="text-xs font-mono text-accent uppercase tracking-[0.4em] mb-4">/ initiate_connection</h3>
                    <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter italic">ESTABLISH_UPLINK</h2>
                    <p className="text-sm text-text-muted mt-4 font-light max-w-md">
                        Transmit feedback, bug reports, or partnership proposals directly into the system core.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Identification (Optional)</label>
                            <input 
                                type="text"
                                value={contact}
                                onChange={(e) => setContact(e.target.value)}
                                placeholder="Email, Matrix, or Alias"
                                className="w-full bg-black/50 border border-border p-4 text-white focus:border-accent outline-none text-sm font-mono placeholder:text-gray-700 transition-all"
                            />
                        </div>
                        <div className="flex items-end pb-2">
                             <div className="text-[9px] font-mono text-gray-600 uppercase italic">
                                Note: All transmissions are logged for security protocol.
                             </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Payload_Data (Message)</label>
                        <textarea 
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Message body here..."
                            rows={4}
                            className="w-full bg-black/50 border border-border p-4 text-white focus:border-accent outline-none text-sm font-light placeholder:text-gray-700 transition-all resize-none no-scrollbar"
                        />
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-8 pt-4">
                        <button 
                            type="submit"
                            disabled={status === 'loading'}
                            className="group relative inline-flex items-center gap-4 bg-accent text-black px-12 py-5 font-bold uppercase tracking-[0.3em] text-[11px] hover:bg-white transition-all disabled:opacity-50 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                {status === 'loading' ? (
                                    <>UPLOADING...</>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> 
                                        Transmit_Feedback
                                    </>
                                )}
                            </span>
                        </button>

                        {status === 'success' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-accent font-mono text-[10px] uppercase tracking-widest"
                            >
                                <CheckCircle2 className="w-4 h-4" /> Uplink Successful. Signal Captured.
                            </motion.div>
                        )}

                        {status === 'error' && (
                            <motion.div 
                                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-red-500 font-mono text-[10px] uppercase tracking-widest"
                            >
                                <AlertCircle className="w-4 h-4" /> Transmission Failed. Retry Protocol.
                            </motion.div>
                        )}
                    </div>
                </form>

                <div className="mt-16 pt-8 border-t border-border flex flex-wrap gap-x-12 gap-y-4">
                    <div>
                        <div className="text-[9px] font-mono text-gray-600 uppercase mb-2">Direct_Channel</div>
                        <a href="mailto:emperordante123@gmail.com" className="text-xs text-text-muted hover:text-accent transition-colors font-mono tracking-tighter">emperordante123@gmail.com</a>
                    </div>
                    <div>
                        <div className="text-[9px] font-mono text-gray-600 uppercase mb-2">Social_Node</div>
                        <div className="flex gap-4">
                             <a href="#" className="text-xs text-text-muted hover:text-white font-mono tracking-tighter">Github</a>
                             <a href="#" className="text-xs text-text-muted hover:text-white font-mono tracking-tighter">LinkedIn</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
