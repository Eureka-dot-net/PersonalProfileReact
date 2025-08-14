import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';

interface BioSectionProps {
  bio: {
    en?: string;
    he?: string;
  };
}

export const BioSection: React.FC<BioSectionProps> = ({ bio }) => {
  return (
    <Paper elevation={4} sx={{ borderRadius: 3 }}>
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            mb: 3
          }}
        >
          About Me
        </Typography>

        {bio.en && (
          <Box sx={{ mb: bio.he ? 4 : 0 }}>
            <Typography
              variant="body1"
              sx={{
                fontSize: '1.1rem',
                lineHeight: 1.8,
                color: 'text.primary',
              }}
              dangerouslySetInnerHTML={{ __html: bio.en.replace(/\r?\n/g, "<br />") }}
            />
          </Box>
        )}

        {bio.he && (
          <>
            {bio.en && <Divider sx={{ my: 3 }} />}
            <Box sx={{ direction: 'rtl' }}>
              <Typography
                variant="body1"
                paragraph
                sx={{
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: 'text.primary'
                }}
              >
                {bio.he}
              </Typography>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
};