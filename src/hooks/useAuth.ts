import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('term_access') === 'Admin');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Immediate check
    const savedAccess = localStorage.getItem('term_access');
    const isTermAdmin = savedAccess === 'Admin';
    setIsAdmin(isTermAdmin);

    // If terminal admin, we can release loading early
    if (isTermAdmin) {
      setLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      // If we're not a terminal admin, we wait for firebase auth to be sure
      // but in this version terminal is king.
      setLoading(false);
    }, (error) => {
      console.error("Auth state error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
