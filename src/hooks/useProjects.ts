import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ProjectStatus } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Project[];
        setProjects(projectsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching projects:", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addProject = async (project: Omit<Project, 'id'>) => {
    return await addDoc(collection(db, 'projects'), {
      ...project,
      updatedAt: serverTimestamp(),
    });
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const projectRef = doc(db, 'projects', id);
    return await updateDoc(projectRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteProject = async (id: string) => {
    return await deleteDoc(doc(db, 'projects', id));
  };

  return { projects, loading, error, addProject, updateProject, deleteProject };
}
