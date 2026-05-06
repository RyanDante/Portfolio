import React, { createContext, useContext } from 'react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../types';

interface ProjectsContextType {
  projects: Project[];
  loading: boolean;
  error: Error | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<any>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<any>;
  deleteProject: (id: string) => Promise<any>;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projectsData = useProjects();
  return (
    <ProjectsContext.Provider value={projectsData}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjectsContext = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjectsContext must be used within a ProjectsProvider');
  }
  return context;
};
