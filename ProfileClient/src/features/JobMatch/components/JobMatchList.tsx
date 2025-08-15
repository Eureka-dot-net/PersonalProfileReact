import React from 'react';
import { Box, Pagination, Typography } from '@mui/material';
import { JobMatchCard } from './JobMatchCard';
import { JobMatchLoading } from './JobMatchLoading';
import { JobMatchEmpty } from './JobMatchEmpty';

interface JobMatchListProps {
  jobMatches: JobMatchItem[];
  totalCount: number;
  page: number;
  totalPages: number;
  isLoading?: boolean;
  onPageChange: (event: React.ChangeEvent<unknown>, value: number) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export const JobMatchList: React.FC<JobMatchListProps> = ({
  jobMatches,
  totalCount,
  page,
  totalPages,
  isLoading = false,
  onPageChange,
  onStatusChange,
}) => {
  if (isLoading) {
    return <JobMatchLoading />;
  }

  if (!jobMatches || jobMatches.length === 0) {
    return <JobMatchEmpty />;
  }

  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Found {totalCount} job match{totalCount !== 1 ? 'es' : ''}
      </Typography>

      <Box sx={{ mb: 3 }}>
        {jobMatches.map((jobMatch) => (
          <JobMatchCard
            key={jobMatch.id}
            jobMatch={jobMatch}
            onStatusChange={onStatusChange}
          />
        ))}
      </Box>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={onPageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Box>
  );
};