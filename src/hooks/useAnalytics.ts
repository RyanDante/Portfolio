import { useEffect } from 'react';
import { collection, addDoc, serverTimestamp, query, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useState } from 'react';

export function useAnalytics() {
  const trackVisit = async (path: string) => {
    try {
      await addDoc(collection(db, 'analytics_visits'), {
        timestamp: serverTimestamp(),
        path,
        userAgent: navigator.userAgent,
        referrer: document.referrer || 'direct'
      });
    } catch (err) {
      console.error("Failed to track visit:", err);
    }
  };

  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const [visitCount, setVisitCount] = useState(0);

  const fetchStats = () => {
    const q = query(collection(db, 'analytics_visits'), orderBy('timestamp', 'desc'), limit(100));
    return onSnapshot(q, (snapshot) => {
      setRecentVisits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setVisitCount(snapshot.size); 
    }, (error) => {
      console.error("Analytics fetch error:", error);
    });
  };

  return { trackVisit, fetchStats, recentVisits, visitCount };
}
