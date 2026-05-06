import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SiteConfig {
  memberName: string;
  memberTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  email: string;
  githubUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  profileImageUrl: string;
}

export function useConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'config', 'main'), (snapshot) => {
      if (snapshot.exists()) {
        setConfig(snapshot.data() as SiteConfig);
      }
      setLoading(false);
    }, (error) => {
      console.error("Config synchronization error:", error);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const updateConfig = async (newConfig: Partial<SiteConfig>) => {
    await setDoc(doc(db, 'config', 'main'), {
      ...newConfig,
      lastUpdated: serverTimestamp()
    }, { merge: true });
  };

  return { config, loading, updateConfig };
}
