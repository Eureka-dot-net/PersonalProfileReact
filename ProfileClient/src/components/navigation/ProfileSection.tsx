import React from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
} from '@mui/material';
import {
  Person as PersonIcon,
} from '@mui/icons-material';

interface ProfileSectionProps {
  about: AboutMe;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ about }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={about.profilePictureUrl || undefined}
        sx={{
          width: { xs: 40, md: 50 },
          height: { xs: 40, md: 50 },
          bgcolor: 'primary.main',
          fontSize: { xs: '1.2rem', md: '1.5rem' },
          border: `2px solid ${theme.palette.background.paper}`,
          boxShadow: theme.shadows[3]
        }}
      >
        {!about.profilePictureUrl && <PersonIcon fontSize="inherit" />}
      </Avatar>

      <Box>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.1rem', md: '1.25rem' },
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {about.fullName.en}
        </Typography>

        {about.location.en && (
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', md: '0.875rem' },
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
                textDecoration: 'underline',
              }
            }}
            onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(about.location.en)}`, '_blank')}
          >
            📍 {about.location.en}
          </Typography>
        )}
      </Box>
    </Box>
  );
};