import React from 'react';
import { Alert, Typography } from '@mui/material';
import { Error as ErrorIcon } from '@mui/icons-material';

interface ErrorDisplayProps {
  error: Error;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  return (
    <Alert
      severity="error"
      icon={<ErrorIcon />}
      sx={{ borderRadius: 2 }}
    >
      <Typography variant="body1" gutterBottom>
        Failed to analyze job match. Please try again.
      </Typography>
      <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
        {JSON.stringify(error, Object.getOwnPropertyNames(error), 2)}
      </Typography>
    </Alert>
  );
};