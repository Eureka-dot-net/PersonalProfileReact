import { useQuery } from '@tanstack/react-query';
import agent from '../api/agent';

const SKILLS_KEY = ['skills'];

export const useSkills = () => {
  const { data: skills, isLoading, isError } = useQuery({
    queryKey: SKILLS_KEY,
    queryFn: async (): Promise<SkillCategory[]> => {
      const response = await agent.get<SkillCategory[]>('/skills');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    skills,
    isLoading,
    isError,
  };
};
