import React from 'react';
import { Person as PersonIcon } from '@mui/icons-material';
import { useAbout } from '../../lib/hooks/useAbout';
import { EmptyState } from '../../components/shared/EmptyState';
import { ErrorState } from '../../components/shared/ErrorState';
import { LoadingState } from '../../components/shared/LoadingState';
import { AboutContent } from './AboutContent';

export const AboutPage: React.FC = () => {
  const { about, isLoading, isError } = useAbout();

  if (isLoading) {
    return <LoadingState message="Loading about information..." fullPage />;
  }

  if (isError || !about) {
    return (
      <ErrorState 
        title="Error loading About Me information"
        message="We couldn't load your about information. Please try again."
        onRetry={() => {window.location.reload()}}
        fullPage 
      />
    );
  }

  // Check if there's any content to display
  const hasContent = about.bio.en || about.bio.he || about.email || about.gitHub || about.linkedIn;

  if (!hasContent) {
    return (
      <EmptyState
        icon={<PersonIcon />}
        message="Your personal information and bio will appear here once added."
      />
    );
  }

  return <AboutContent about={about} />;
};