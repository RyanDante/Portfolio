import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Enforce the specific admin email restricted in the request
        const isTargetAdmin = user.email === 'emperordante123@gmail.com';
        
        // We still check Firestore for additional verification or fallback, 
        // but the email check is the primary gatekeeper here.
        const adminDoc = await getDoc(doc(db, 'admins', user.uid));
        setIsAdmin(isTargetAdmin || adminDoc.exists());
        
        // If they are logged in but NOT an admin, we might want to log them out 
        // but useAuth is a hook, so we shouldn't perform side-effect signouts here 
        // that could cause infinite loops. The Login component handles the initial gate.
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAdmin, loading };
}
