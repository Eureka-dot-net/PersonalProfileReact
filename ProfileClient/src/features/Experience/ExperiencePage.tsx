import React from 'react';
import { Grid } from '@mui/material';
import { LoadingState } from '../../components/shared/LoadingState';
import { ErrorState } from '../../components/shared/ErrorState';
import { useExperiences } from '../../lib/hooks/useExperience';
import { ExperienceList } from './ExperienceList';
import { EmptyState } from '../../components/shared/EmptyState';

export const ExperiencePage: React.FC = () => {
  const { experiences, isLoading, isError } = useExperiences();

  if (isLoading) {
    return <LoadingState message="Loading your experience..." fullPage />;
  }

  if (isError || !experiences) {
    return (
      <ErrorState 
        title="Error loading Experience information"
        message="We couldn't load your experience data. Please try again."
        onRetry={() => window.location.reload()} // Simple retry logic
        fullPage 
      />
    );
  }

  return (
    <Grid container spacing={4}>
      {experiences.length === 0 ? (
        <Grid size={12}>
          <EmptyState
            message="No experience data available"
          />
        </Grid>
      ) : (
        <ExperienceList experiences={experiences} />
      )}
    </Grid>
  );
};