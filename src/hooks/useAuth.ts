import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for terminal-based elevation first
    const checkTerminalAdmin = () => {
      const savedAccess = localStorage.getItem('term_access');
      if (savedAccess === 'Admin') {
        setIsAdmin(true);
      }
    };

    checkTerminalAdmin();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const isTargetAdmin = user.email === 'emperordante123@gmail.com';
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(isTargetAdmin || adminDoc.exists());
      } else {
        // Only reset if terminal admin isn't set
        if (localStorage.getItem('term_access') !== 'Admin') {
          setIsAdmin(false);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
