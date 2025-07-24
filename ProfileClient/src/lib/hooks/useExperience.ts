import { useQuery } from '@tanstack/react-query';
import agent from '../api/agent';

const EXPERIENCE_KEY = ['experiences'];

export const useExperiences = () => {
  const { data: experiences, isLoading, isError } = useQuery({
    queryKey: EXPERIENCE_KEY,
    queryFn: async (): Promise<Experience[]> => {
      const response = await agent.get<Experience[]>('/experience');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    experiences,
    isLoading,
    isError,
  };
};
