import { createContext } from "react";

export interface Project {
  id: string;
  userId: string;
  name: string;
  owner: string;
  location: string;
  area: string;
  status: "active" | "pending" | "completed" | "cancelled";
  createdAt: string;
  updatedAt: string;
  description?: string;
  coordinates?: string;
  soilType?: string;
  vegetation?: string;
  waterResources?: string;
}

interface ProjectContextType {
  projects: Project[];
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  ) => Promise<Project>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProjectById: (id: string) => Project | undefined;
  isLoading: boolean;
}

export const ProjectContext = createContext<ProjectContextType | undefined>(
  undefined
);
