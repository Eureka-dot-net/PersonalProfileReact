import React from 'react';
import { Box, Paper, Typography, Stack, useTheme, useMediaQuery } from '@mui/material';
import {
  Email as EmailIcon,
  GitHub as GitHubIcon,
  LinkedIn as LinkedInIcon,
} from '@mui/icons-material';
import { ContactLink } from './ContactLink';

interface ContactSectionProps {
  email?: string;
  gitHub?: string;
  linkedIn?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ email, gitHub, linkedIn }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSocialClick = (url: string) => {
    if (url) {
      window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
    }
  };

  const handleEmailClick = () => {
    if (email) {
      window.location.href = `mailto:${email}`;
    }
  };

  // Don't render if no contact info is available
  if (!email && !gitHub && !linkedIn) {
    return null;
  }

  return (
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
          {email && (
            <ContactLink
              icon={<EmailIcon />}
              label={email}
              onClick={handleEmailClick}
            />
          )}

          {gitHub && (
            <ContactLink
              icon={<GitHubIcon />}
              label="GitHub"
              onClick={() => handleSocialClick(gitHub)}
            />
          )}

          {linkedIn && (
            <ContactLink
              icon={<LinkedInIcon />}
              label="LinkedIn"
              onClick={() => handleSocialClick(linkedIn)}
            />
          )}
        </Stack>
      </Box>
    </Paper>
  );
};