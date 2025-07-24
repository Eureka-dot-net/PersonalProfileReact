// src/components/UnderConstructionPage.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  useTheme,
  Chip,
  Stack,
} from '@mui/material';
import {
  Construction as ConstructionIcon,
  Code as CodeIcon,
  Palette as PaletteIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';

export const UnderConstructionPage: React.FC = () => {
  const theme = useTheme();

  const features = [
    { icon: <CodeIcon />, label: 'Clean Code', color: 'primary' as const },
    { icon: <PaletteIcon />, label: 'Modern Design', color: 'secondary' as const },
    { icon: <SpeedIcon />, label: 'Fast Performance', color: 'success' as const },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Paper 
          elevation={8}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            maxWidth: 600,
          }}
        >
          {/* Header */}
          <Box 
            sx={{
              background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
              p: { xs: 4, md: 6 },
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: 'warning.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                mx: 'auto',
                mb: 3,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%': {
                    transform: 'scale(1)',
                  },
                  '50%': {
                    transform: 'scale(1.05)',
                  },
                  '100%': {
                    transform: 'scale(1)',
                  },
                },
              }}
            >
              <ConstructionIcon sx={{ fontSize: 40 }} />
            </Box>

            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Under Construction
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              This section is currently being built
            </Typography>
          </Box>

          {/* Body */}
          <Box sx={{ p: { xs: 4, md: 6 } }}>
            <Typography 
              variant="body1"
              paragraph
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.7,
                color: 'text.primary',
                textAlign: 'center',
                mb: 4
              }}
            >
              I'm working hard to bring you an amazing experience. This page will showcase 
              exciting features and content very soon!
            </Typography>

            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  color: 'primary.main',
                }}
              >
                What to expect:
              </Typography>

              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2}
                justifyContent="center"
                alignItems="center"
                sx={{ mt: 2 }}
              >
                {features.map((feature, index) => (
                  <Chip
                    key={index}
                    icon={feature.icon}
                    label={feature.label}
                    variant="outlined"
                    color={feature.color}
                    sx={{
                      borderRadius: 3,
                      fontWeight: 500,
                      height: 40,
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                      },
                      transition: 'all 0.2s ease',
                    }}
                  />
                ))}
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ fontStyle: 'italic' }}
              >
                Check back soon for updates! 🚀
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};