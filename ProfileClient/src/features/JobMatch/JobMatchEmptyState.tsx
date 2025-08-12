import React from 'react';
import { Paper, Typography } from '@mui/material';
import { Psychology as PsychologyIcon } from '@mui/icons-material';

export const JobMatchEmptyState: React.FC = () => {
  return (
    <Paper
      elevation={4}
      sx={{
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        bgcolor: 'grey.50'
      }}
    >
      <PsychologyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        Ready to analyze your job match
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Paste a job description above and click "Analyze Match" to get started
      </Typography>
    </Paper>
  );
};