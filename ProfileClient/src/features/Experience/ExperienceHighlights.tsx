import React from 'react';
import { Box, Typography } from '@mui/material';

interface ExperienceHighlightsProps {
  highlights: string[];
}

export const ExperienceHighlights: React.FC<ExperienceHighlightsProps> = ({ highlights }) => {
  return (
    <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
      {highlights.map((highlight, index) => (
        <Box 
          component="li" 
          key={index}
          sx={{ 
            display: 'flex',
            alignItems: 'flex-start',
            mb: 2,
            '&:last-child': { mb: 0 }
          }}
        >
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: 'primary.main',
              flexShrink: 0,
              mt: 1,
              mr: 2,
            }}
          />
          <Typography 
            variant="body1"
            sx={{ 
              fontSize: '1rem',
              lineHeight: 1.7,
              color: 'text.primary'
            }}
          >
            {highlight}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};