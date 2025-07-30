import { useMutation } from '@tanstack/react-query';
import agent from '../api/agent';

export interface JobMatchDto {
  isSuccess: boolean;
  isQuotaExceeded?: boolean;
  retryAfter?: number | null;
  matchPercentage?: number;
  explanation?: string;
  errorMessage?: string | null;
}

const JOB_MATCH_KEY = ['jobMatch'];

export const useJobMatch = () => {
  return useMutation<JobMatchDto, Error, string>({
    mutationKey: JOB_MATCH_KEY,
    mutationFn: async (jobDescription: string): Promise<JobMatchDto> => {
      const response = await agent.post<JobMatchDto>('/jobmatch', jobDescription, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
  });
};
