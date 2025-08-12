import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { Error as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  title = "Something went wrong",
  message = "An error occurred while loading the data.",
  onRetry,
  fullPage = false 
}) => {
  const content = (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: 'error.light',
        color: 'error.contrastText',
        borderRadius: 2
      }}
    >
      <ErrorIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ mb: onRetry ? 3 : 0 }}>
        {message}
      </Typography>
      {onRetry && (
        <Button
          variant="contained"
          startIcon={<RefreshIcon />}
          onClick={onRetry}
          sx={{ mt: 2 }}
        >
          Try Again
        </Button>
      )}
    </Paper>
  );

  if (fullPage) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, mt: 12 }}>
        {content}
      </Container>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      {content}
    </Box>
  );
};