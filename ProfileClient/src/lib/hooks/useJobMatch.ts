import { useMutation } from '@tanstack/react-query';
import agent from '../api/agent';

export interface FileDto {
  fileName: string;
  contentType: string;
  content: string; // base64-encoded string
}

export interface MatchEvaluationDto {
  matchPercentage: number;
  explanation: string;
}

export interface JobMatchDto {
  isSuccess: boolean;
  isQuotaExceeded?: boolean;
  retryAfter?: number | null;
  matchEvaluation: MatchEvaluationDto;
  tailoredCv: FileDto;
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
