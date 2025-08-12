import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';

import { ExperienceHighlights } from './ExperienceHighlights';
import { calculateDuration, formatDate } from '../../utils/dateUtils';

interface ExperienceCardProps {
  experience: Experience;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-4px)',
        }
      }}
    >
      {/* Card Header */}
      <Box 
        sx={{
          background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
          p: { xs: 3, md: 4 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <WorkIcon />
              </Box>
              <Box>
                <Typography 
                  variant="h5" 
                  component="h2"
                  sx={{ fontWeight: 700, color: 'text.primary' }}
                >
                  {experience.title}
                </Typography>
                <Typography 
                  variant="h6" 
                  sx={{ color: 'primary.main', fontWeight: 600 }}
                >
                  {experience.company}
                </Typography>
              </Box>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                icon={<LocationIcon sx={{ fontSize: '1rem' }} />}
                label={experience.location}
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              />
              <Chip
                icon={<CalendarIcon sx={{ fontSize: '1rem' }} />}
                label={`${formatDate(experience.startDate)} - ${experience.endDate ? formatDate(experience.endDate) : 'Present'}`}
                variant="filled"
                size="small"
                color="primary"
                sx={{ borderRadius: 2 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                {calculateDuration(experience.startDate, experience.endDate)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Card Body - Highlights */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Typography 
          variant="h6" 
          gutterBottom
          sx={{ 
            fontWeight: 600,
            color: 'text.primary',
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}
        >
          Key Achievements
        </Typography>
        
        <ExperienceHighlights highlights={experience.highlights} />
      </Box>
    </Paper>
  );
};