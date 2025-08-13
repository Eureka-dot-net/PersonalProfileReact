import React from 'react';
import { Grid } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { useSkills } from '../../lib/hooks/useSkills';
import { LoadingState } from '../../components/shared/LoadingState';
import { ErrorState } from '../../components/shared/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import { SkillCategoryList } from './SkillCategoryList';

export const SkillsPage: React.FC = () => {
  const { skills, isLoading, isError } = useSkills();

  if (isLoading) {
    return <LoadingState message="Loading your skills..." fullPage />;
  }

  if (isError || !skills) {
    return (
      <ErrorState 
        title="Error loading Skills information"
        message="We couldn't load your skills data. Please try again."
        onRetry={() => {window.location.reload()}}
        fullPage 
      />
    );
  }

  return (
    <Grid container spacing={4}>
      {skills.length === 0 ? (
        <Grid size={12}>
          <EmptyState
            icon={<CodeIcon />}
            message="Your technical skills will appear here once added."
          />
        </Grid>
      ) : (
        <SkillCategoryList skills={skills} />
      )}
    </Grid>
  );
};