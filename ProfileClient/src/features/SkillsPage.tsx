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

  // Color mapping for skill chips
  const getSkillColor = (index: number) => {
    const colors = ['primary', 'secondary', 'success', 'info', 'warning'] as const;
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
          <Typography variant="h6">Error loading Skills information</Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
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
                      variant="outlined"
                      color={getSkillColor(skillIndex)}
                      sx={{
                        borderRadius: 3,
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        height: 36,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: theme.shadows[4],
                        },
                        transition: 'all 0.2s ease',
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
    </Container>
  );
};