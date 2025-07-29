// src/hooks/useProjects.ts
import { useQuery } from '@tanstack/react-query';
import agent from '../api/agent';

const PROJECTS_KEY = ['projects'];

export const useProjects = () => {
  const {
    data: projects,
    isLoading,
    isError,
  } = useQuery({
    queryKey: PROJECTS_KEY,
    queryFn: async (): Promise<Project[]> => {
      const response = await agent.get<Project[]>('/projects');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    projects,
    isLoading,
    isError,
  };
};
