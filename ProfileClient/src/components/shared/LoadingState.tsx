import React from 'react';
import { Container, CircularProgress, Typography, Box } from '@mui/material';

interface LoadingStateProps {
  message?: string;
  size?: number;
  fullPage?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...", 
  size = 60,
  fullPage = false 
}) => {
  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <CircularProgress size={size} />
      {message && (
        <Typography variant="body1" color="text.secondary">
          {message}
        </Typography>
      )}
    </Box>
  );

  if (fullPage) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8, mt: 12 }}>
        {content}
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
      {content}
    </Box>
  );
};