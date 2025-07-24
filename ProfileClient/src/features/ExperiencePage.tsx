// src/components/ExperiencePage.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  useTheme,
  Grid
} from '@mui/material';
import {
  Work as WorkIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { useExperiences } from '../lib/hooks/useExperience';

export const ExperiencePage: React.FC = () => {
  const { experiences, isLoading, isError } = useExperiences();
  const theme = useTheme();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };

  const calculateDuration = (startDate: string, endDate: string | null) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    
    const months = (end.getFullYear() - start.getFullYear()) * 12 + 
                   (end.getMonth() - start.getMonth());
    
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0 && remainingMonths > 0) {
      return `${years} year${years > 1 ? 's' : ''} ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    } else if (years > 0) {
      return `${years} year${years > 1 ? 's' : ''}`;
    } else {
      return `${remainingMonths} month${remainingMonths > 1 ? 's' : ''}`;
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8, mt: 12 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (isError || !experiences) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, mt: 12 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}
        >
          <Typography variant="h6">Error loading Experience information</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ width: '100%', py: 4, mt: 12 }}>
      <Grid container spacing={4}>

        {/* Experience Cards */}
        {experiences.map((experience) => (
          <Grid size={12} key={experience.id}>
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
                
                <Box component="ul" sx={{ pl: 0, m: 0, listStyle: 'none' }}>
                  {experience.highlights.map((highlight, highlightIndex) => (
                    <Box 
                      component="li" 
                      key={highlightIndex}
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
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Empty State */}
        {experiences.length === 0 && (
          <Grid size={12}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
              <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No experience data available
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};