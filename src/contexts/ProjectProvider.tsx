import React, { useState, useEffect, type ReactNode } from "react";
import { ProjectContext, type Project } from "./ProjectContext";
import { db } from "../firebaseconfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";

interface ProjectProviderProps {
  children: ReactNode;
}

export const ProjectProvider: React.FC<ProjectProviderProps> = ({
  children,
}) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Assinar projetos do Firestore do usuário logado
  useEffect(() => {
    if (!user?.uid) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    const q = query(
      collection(db, "projects"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const toIsoString = (value: unknown): string => {
          if (value instanceof Timestamp) return value.toDate().toISOString();
          if (typeof value === "string") return value;
          // Narrow unknown without using any
          if (
            value !== null &&
            typeof value === "object" &&
            "toDate" in value &&
            typeof (value as { toDate: () => Date }).toDate === "function"
          ) {
            return (value as { toDate: () => Date }).toDate().toISOString();
          }
          return new Date().toISOString();
        };
        const list: Project[] = snapshot.docs.map((d) => {
          const data = d.data() as {
            userId: string;
            name: string;
            owner: string;
            location: string;
            area: string;
            status: Project["status"];
            createdAt?: unknown;
            updatedAt?: unknown;
            description?: string;
            coordinates?: string;
            soilType?: string;
            vegetation?: string;
            waterResources?: string;
          };
          return {
            id: d.id,
            userId: data.userId,
            name: data.name,
            owner: data.owner,
            location: data.location,
            area: data.area,
            status: data.status,
            createdAt: toIsoString(data.createdAt),
            updatedAt: toIsoString(data.updatedAt),
            description: data.description,
            coordinates: data.coordinates,
            soilType: data.soilType,
            vegetation: data.vegetation,
            waterResources: data.waterResources,
          };
        });
        setProjects(list);
        setIsLoading(false);
      },
      (error) => {
        console.error("Erro ao ler projetos:", error);
        setIsLoading(false);
      }
    );

    return () => unsub();
  }, [user?.uid]);

  const addProject = async (
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt" | "userId">
  ) => {
    if (!user?.uid) throw new Error("Usuário não autenticado");

    const payload = {
      ...projectData,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const ref = await addDoc(collection(db, "projects"), payload);

    // O snapshot em tempo real atualizará a lista; retornamos um objeto básico
    return {
      id: ref.id,
      userId: user.uid,
      name: projectData.name,
      owner: projectData.owner,
      location: projectData.location,
      area: projectData.area,
      status: projectData.status,
      description: projectData.description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Project;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    await updateDoc(doc(db, "projects", id), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  };

  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, "projects", id));
  };

  const getProjectById = (id: string) => {
    return projects.find((project) => project.id === id);
  };

  const value = {
    projects,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    isLoading,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
};
