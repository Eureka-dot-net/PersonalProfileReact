import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import agent from '../api/agent';
import type { AboutMe } from '../types';

const ABOUT_KEY = ['about'];

export const useAbout = () => {
  const queryClient = useQueryClient();

  // 1. Fetch the “About Me” record
  const { data: about, isLoading, isError } = useQuery({
    queryKey: ABOUT_KEY,
    queryFn: async (): Promise<AboutMe> => {
      const response = await agent.get<AboutMe>('/aboutme');
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5m cache
  });

  // 2. Mutation to update it
  const updateAbout = useMutation({
    mutationFn: async (values: AboutMe) => {
      await agent.put('/aboutme', values);
    },
    onSuccess: () => {
      // refetch the about data
      queryClient.invalidateQueries({ queryKey: ABOUT_KEY });
    },
  });

  return {
    about,
    isLoading,
    isError,
    updateAbout,
  };
};