import React, { useState } from 'react';
import { Grid } from '@mui/material';
import { useJobMatches } from '../../lib/hooks/useJobMatches';
import { JobMatchHistoryHeader } from './components/JobMatchHistoryHeader';
import { JobMatchFilters } from './components/JobMatchFilters';
import { JobMatchList } from './components/JobMatchList';

export const JobMatchHistoryPage: React.FC = () => {
  const [filters, setFilters] = useState<JobMatchFilter>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading, refetch } = useJobMatches(filters);

  const handleFiltersChange = (newFilters: JobMatchFilter) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      page: 1,
      pageSize: 10,
    });
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setFilters({ ...filters, page: value });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    // TODO: Implement status update API call
    console.log('Update status:', id, newStatus);
    // For now, just refetch the data
    refetch();
  };

  const handleRefresh = () => {
    refetch();
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export job matches');
  };

  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <JobMatchHistoryHeader
          onRefresh={handleRefresh}
          onExport={handleExport}
          isLoading={isLoading}
        />
      </Grid>

      <Grid size={12}>
        <JobMatchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      </Grid>

      <Grid size={12}>
        <JobMatchList
          jobMatches={data?.jobMatches || []}
          totalCount={data?.totalCount || 0}
          page={data?.page || 1}
          totalPages={data?.totalPages || 0}
          isLoading={isLoading}
          onPageChange={handlePageChange}
          onStatusChange={handleStatusChange}
        />
      </Grid>
    </Grid>
  );
};