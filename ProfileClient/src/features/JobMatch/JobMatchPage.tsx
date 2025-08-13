import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import { useJobMatch, type JobMatchDto } from '../../lib/hooks/useJobMatch';
import { useStatusMessages } from '../../lib/hooks/useStatusMessages';
import { downloadTailoredCv } from '../../utils/fileDownload';
import { JobMatchHeader } from './JobMatchHeader';
import { JobDescriptionInput } from './JobDescriptionInput';
import { MatchResults } from './MatchResults';
import { JobMatchEmptyState } from './JobMatchEmptyState';
import { ErrorDisplay } from './ErrorDisplay';

export const JobMatchPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<JobMatchDto | null>(null);
  const [errorDetails, setErrorDetails] = useState<Error | null>(null);
  const { mutate: analyzeMatch, isPending } = useJobMatch();
  const statusMessage = useStatusMessages(isPending);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.length > 2500) return;

    analyzeMatch(jobDescription, {
      onSuccess: (data) => {
        setResult(data);
        setErrorDetails(null);
      },
      onError: (error) => {
        console.error('Job match analysis failed:', error);
        setErrorDetails(error);
        setResult(null);
      }
    });
  };

  return (
      <Grid container spacing={2}>
        {/* Header Section */}
        <Grid size={12}>
          <JobMatchHeader />
        </Grid>

        {/* Input Section */}
        <Grid size={12}>
          <JobDescriptionInput
            jobDescription={jobDescription}
            setJobDescription={setJobDescription}
            onSubmit={handleSubmit}
            isPending={isPending}
            statusMessage={statusMessage}
          />
        </Grid>

        {/* Error State */}
        {errorDetails && (
          <Grid size={12}>
            <ErrorDisplay error={errorDetails} />
          </Grid>
        )}

        {/* Results Section */}
        {result && (
          <Grid size={12}>
            <MatchResults result={result} onDownloadCv={downloadTailoredCv} />
          </Grid>
        )}

        {/* Empty State / Instructions */}
        {!result && !isPending && !errorDetails && (
          <Grid size={12}>
            <JobMatchEmptyState />
          </Grid>
        )}
      </Grid>
  );
};