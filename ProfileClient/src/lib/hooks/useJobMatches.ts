import { useQuery } from '@tanstack/react-query';
import agent from '../api/agent';

const JOB_MATCHES_KEY = ['jobMatches'];

export const useJobMatches = (filter?: JobMatchFilter) => {
  return useQuery<JobMatchListResponse, Error>({
    queryKey: [...JOB_MATCHES_KEY, filter],
    queryFn: async (): Promise<JobMatchListResponse> => {
      const params = new URLSearchParams();
      
      if (filter?.searchTerm) params.append('searchTerm', filter.searchTerm);
      if (filter?.minMatchPercentage !== undefined) params.append('minMatchPercentage', filter.minMatchPercentage.toString());
      if (filter?.status) params.append('status', filter.status);
      if (filter?.company) params.append('company', filter.company);
      if (filter?.fromDate) params.append('fromDate', filter.fromDate);
      if (filter?.toDate) params.append('toDate', filter.toDate);
      if (filter?.page) params.append('page', filter.page.toString());
      if (filter?.pageSize) params.append('pageSize', filter.pageSize.toString());

      const response = await agent.get<JobMatchListResponse>(`/jobmatch?${params.toString()}`);
      return response.data;
    },
  });
};