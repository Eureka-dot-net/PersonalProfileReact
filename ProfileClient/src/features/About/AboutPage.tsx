// src/components/About/AboutPage.tsx
import React from 'react';
import { useAbout } from '../../lib/hooks/useAbout';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Divider,
  Stack,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';

export const AboutPage: React.FC = () => {
  const { about, isLoading, isError } = useAbout();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Container>
    );
  }

  if (isError || !about) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            textAlign: 'center',
            bgcolor: 'error.light',
            color: 'error.contrastText'
          }}
        >
          <Typography variant="h6">Error loading About Me information</Typography>
        </Paper>
      </Container>
    );
  }

  const handleSocialClick = (url: string) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (about.email) {
      window.location.href = `mailto:${about.email}`;
    }
  };

  return (
      <Grid container spacing={4}>
        {/* Bio Section */}
        <Grid size={12}>
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

              {about.bio.en && (
                <Box sx={{ mb: about.bio.he ? 4 : 0 }}>
                  <Typography
                    variant="body1"
                    sx={{
                      fontSize: '1.1rem',
                      lineHeight: 1.8,
                      color: 'text.primary',
                    }}
                    dangerouslySetInnerHTML={{ __html: about.bio.en.replace(/\r?\n/g, "<br />") }}
                  />
                </Box>
              )}

              {about.bio.he && (
                <>
                  {about.bio.en && <Divider sx={{ my: 3 }} />}
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
                      {about.bio.he}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Contact & Social Links */}
        <Grid size={12}>
          <Paper elevation={4} sx={{ borderRadius: 3 }}>
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Typography
                variant="h5"
                component="h3"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: 'primary.main',
                  mb: 3
                }}
              >
                Let's Connect
              </Typography>

              <Stack
                direction={isMobile ? 'column' : 'row'}
                spacing={3}
                alignItems={isMobile ? 'stretch' : 'center'}
                flexWrap="wrap"
                useFlexGap
              >
                {about.email && (
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={handleEmailClick}
                  >
                    <IconButton color="primary" size="small">
                      <EmailIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {about.email}
                    </Typography>
                  </Paper>
                )}

                {about.gitHub && (
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleSocialClick(about.gitHub)}
                  >
                    <IconButton color="primary" size="small">
                      <GitHubIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      GitHub
                    </Typography>
                  </Paper>
                )}

                {about.linkedIn && (
                  <Paper
                    elevation={2}
                    sx={{
                      borderRadius: 3,
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        elevation: 4,
                        transform: 'translateY(-2px)',
                        bgcolor: 'action.hover'
                      }
                    }}
                    onClick={() => handleSocialClick(about.linkedIn)}
                  >
                    <IconButton color="primary" size="small">
                      <LinkedInIcon />
                    </IconButton>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      LinkedIn
                    </Typography>
                  </Paper>
                )}
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
  );
};