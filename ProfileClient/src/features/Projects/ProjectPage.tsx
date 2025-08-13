import React from 'react';
import { Grid } from '@mui/material';
import { Code as CodeIcon } from '@mui/icons-material';
import { useProjects } from '../../lib/hooks/useProject';
import { useImageModal } from '../../lib/hooks/useImageModal';
import { LoadingState } from '../../components/shared/LoadingState';
import { ErrorState } from '../../components/shared/ErrorState';
import { EmptyState } from '../../components/shared/EmptyState';
import { ProjectList } from './ProjectList';
import { ProjectImageModal } from './ProjectImageModal';

export const ProjectPage: React.FC = () => {
  const { projects, isLoading, isError } = useProjects();
  const { selectedImage, openImage, closeImage } = useImageModal();

  if (isLoading) {
    return <LoadingState message="Loading your projects..." fullPage />;
  }

  if (isError || !projects) {
    return (
      <ErrorState 
        title="Error loading Project information"
        message="We couldn't load your project data. Please try again."
        onRetry={() => window.location.reload()} 
        fullPage 
      />
    );
  }

  return (
    <>
      <Grid container spacing={4}>
        {projects.length === 0 ? (
          <Grid size={12}>
            <EmptyState
              icon={<CodeIcon />}
              message="Your project portfolio will appear here once added."
            />
          </Grid>
        ) : (
          <ProjectList projects={projects} onImageClick={openImage} />
        )}
      </Grid>

      <ProjectImageModal imageUrl={selectedImage} onClose={closeImage} />
    </>
  );
};