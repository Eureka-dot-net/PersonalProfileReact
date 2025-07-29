// src/components/SkillsPage.tsx
import React from 'react';
import { useSkills } from '../lib/hooks/useSkills';
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
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Cloud as CloudIcon,
  Build as ToolsIcon,
  Language as LanguageIcon,
  DeviceHub as DevOpsIcon,
} from '@mui/icons-material';

export const SkillsPage: React.FC = () => {
  const { skills, isLoading, isError } = useSkills();
  const theme = useTheme();

  // Icon mapping for different skill categories
  const getCategoryIcon = (category: string) => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('programming') || lowerCategory.includes('language')) {
      return <LanguageIcon />;
    } else if (lowerCategory.includes('database') || lowerCategory.includes('data')) {
      return <DatabaseIcon />;
    } else if (lowerCategory.includes('cloud') || lowerCategory.includes('aws') || lowerCategory.includes('azure')) {
      return <CloudIcon />;
    } else if (lowerCategory.includes('devops') || lowerCategory.includes('ci/cd')) {
      return <DevOpsIcon />;
    } else if (lowerCategory.includes('tools') || lowerCategory.includes('software')) {
      return <ToolsIcon />;
    } else {
      return <CodeIcon />;
    }
  };

  // Simplified color scheme with muted colors
  const getSkillColor = (index: number) => {
    const colors = ['primary', 'info'] as const;
    return colors[index % colors.length];
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8, mt: 12 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (isError || !skills) {
    return (
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}
        >
          <Typography variant="h6">Error loading Skills information</Typography>
        </Paper>
    );
  }

  return (
      <Grid container spacing={4}>
        {/* Skills Categories */}
        {skills.map((skillCategory) => (
          <Grid size={{ xs: 12, md: 6 }} key={skillCategory.category}>
            <Paper 
              elevation={6}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': {
                  elevation: 8,
                  transform: 'translateY(-4px)',
                }
              }}
            >
              {/* Category Header */}
              <Box 
                sx={{
                  background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
                  p: { xs: 3, md: 4 },
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
                    {getCategoryIcon(skillCategory.category)}
                  </Box>
                  <Typography 
                    variant="h6" 
                    component="h2"
                    sx={{ fontWeight: 700, color: 'text.primary' }}
                  >
                    {skillCategory.category}
                  </Typography>
                </Box>
              </Box>

              {/* Skills List */}
              <Box sx={{ p: { xs: 3, md: 4 } }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                  {skillCategory.skills.map((skill, skillIndex) => (
                    <Chip
                      key={skillIndex}
                      label={skill}
                      variant="filled"
                      color={getSkillColor(skillIndex)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        height: 36,
                        cursor: 'default',
                        // Removed hover effects to reduce clickable appearance
                        '&:hover': {
                          // Only subtle color change on hover, no movement or shadows
                          opacity: 0.9,
                        },
                        // Softer appearance with reduced contrast
                        bgcolor: theme.palette.mode === 'light' 
                          ? (skillIndex % 2 === 0 ? 'rgba(25, 118, 210, 0.08)' : 'rgba(2, 136, 209, 0.08)')
                          : (skillIndex % 2 === 0 ? 'rgba(144, 202, 249, 0.16)' : 'rgba(129, 212, 250, 0.16)'),
                        color: theme.palette.mode === 'light' 
                          ? (skillIndex % 2 === 0 ? 'rgba(25, 118, 210, 0.87)' : 'rgba(2, 136, 209, 0.87)')
                          : (skillIndex % 2 === 0 ? 'rgba(144, 202, 249, 0.87)' : 'rgba(129, 212, 250, 0.87)'),
                        border: 'none',
                        transition: 'opacity 0.2s ease',
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}

        {/* Empty State */}
        {skills.length === 0 && (
          <Grid size={12}>
            <Paper elevation={4} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
              <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                No skills data available
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
  );
};