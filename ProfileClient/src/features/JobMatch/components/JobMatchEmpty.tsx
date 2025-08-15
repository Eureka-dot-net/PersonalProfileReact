import React from 'react';
import { Paper, Typography } from '@mui/material';
import { WorkOff as WorkOffIcon } from '@mui/icons-material';

export const JobMatchEmpty: React.FC = () => {
  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 3,
        p: 4,
        textAlign: 'center',
        bgcolor: 'grey.50',
      }}
    >
      <WorkOffIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
        No job matches found
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Try adjusting your search filters or analyze more job descriptions to build your match history.
      </Typography>
    </Paper>
  );
};