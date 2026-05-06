import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

export interface TerminalLog {
  id: string;
  command: string;
  output: string;
  isAuthorized: boolean;
  userId: string;
  userAgent: string;
  timestamp: any;
}

export const useTerminalLogs = () => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'terminal_logs'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TerminalLog[];
      setLogs(docs);
      setLoading(false);
    }, (error) => {
      console.error("Terminal logs fetch error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const deleteLogs = async (ids: string[]) => {
    for (const id of ids) {
      await deleteDoc(doc(db, 'terminal_logs', id));
    }
  };

  return { logs, loading, deleteLogs };
};
