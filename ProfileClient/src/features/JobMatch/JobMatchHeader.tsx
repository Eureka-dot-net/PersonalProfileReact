import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import { Work as WorkIcon, Google as GoogleIcon } from '@mui/icons-material';

export const JobMatchHeader: React.FC = () => {
  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
        p: { xs: 3, md: 4 },
        mb: 2,
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2, 
        mb: 1.5, 
        flexDirection: { xs: 'column', sm: 'row' }, 
        textAlign: { xs: 'center', sm: 'left' } 
      }}>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            flexShrink: 0,
          }}
        >
          <WorkIcon sx={{ fontSize: '2rem' }} />
        </Box>
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              mb: 0.5,
              fontSize: { xs: '1.75rem', sm: '2.125rem' }
            }}
          >
            Job Match Analyzer
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.9rem', sm: '1rem' }
            }}
          >
            Paste a job description below to see how well it matches your profile
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
        <Chip
          icon={<GoogleIcon sx={{ fontSize: '1rem' }} />}
          label="Powered by Gemini AI"
          variant="outlined"
          size="small"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Paper>
  );
};