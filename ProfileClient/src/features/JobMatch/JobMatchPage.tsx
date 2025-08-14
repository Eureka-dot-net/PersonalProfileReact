import React, { useState } from 'react';
import { useJobMatch, type JobMatchDto } from '../../lib/hooks/useJobMatch';
import { useStatusMessages } from '../../lib/hooks/useStatusMessages';
import { downloadTailoredCv } from '../../utils/fileDownload';
import { JobMatchHeader } from './JobMatchHeader';
import { JobDescriptionInput } from './JobDescriptionInput';
import { MatchResults } from './MatchResults';
import { JobMatchEmptyState } from './JobMatchEmptyState';
import { ErrorDisplay } from './ErrorDisplay';
import { JobMatchHistoryPage } from './JobMatchHistoryPage';
import { Grid, Tabs, Tab, Box, Paper } from '@mui/material';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`jobmatch-tabpanel-${index}`}
      aria-labelledby={`jobmatch-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export const JobMatchPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<JobMatchDto | null>(null);
  const [errorDetails, setErrorDetails] = useState<Error | null>(null);
  const { mutate: analyzeMatch, isPending } = useJobMatch();
  const statusMessage = useStatusMessages(isPending);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

      {/* Tabs Section */}
      <Grid size={12}>
        <Paper elevation={2} sx={{ borderRadius: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="job match tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Analyze Job" id="jobmatch-tab-0" aria-controls="jobmatch-tabpanel-0" />
            <Tab label="Match History" id="jobmatch-tab-1" aria-controls="jobmatch-tabpanel-1" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
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
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <JobMatchHistoryPage />
          </TabPanel>
        </Paper>
      </Grid>
    </Grid>
  );
};