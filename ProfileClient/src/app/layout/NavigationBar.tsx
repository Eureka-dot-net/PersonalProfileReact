// src/components/NavigationBar.tsx
import React from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Avatar,
  useTheme,
  Stack,
  Button,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  Person as PersonIcon,
} from '@mui/icons-material';
import { useAbout } from '../../lib/hooks/useAbout';
import { useNavigate } from 'react-router-dom';

export const NavigationBar: React.FC = () => {
  const { about, isLoading, isError } = useAbout();
  const theme = useTheme();
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
        <CircularProgress size={30} />
      </Container>
    );
  }

  if (isError || !about) {
    return null; // Don't show navigation if we can't load user info
  }

  const navItems = [
    { label: 'About', path: '/about' },
    { label: 'Experience', path: '/experience' },
    { label: 'Skills', path: '/skills' },
    { label: 'Projects', path: '/projects' },
  ];

  return (
    <Box
  sx={{
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    display: "flex",
    justifyContent: "center",
    pointerEvents: "none", // AppBar will handle interactions
  }}
>
  <AppBar
    position="static" // Use static since Box is handling positioning
    sx={{
      width: "95%",
      pointerEvents: "auto",
      background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
      borderRadius: 3,
      boxShadow: 3,
    }}
  >
    <Toolbar sx={{ p: { xs: 2, md: 3 } }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 }
          }}>
            {/* Logo/Profile Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={about.profilePictureUrl || undefined}
                sx={{
                  width: 50,
                  height: 50,
                  bgcolor: 'primary.main',
                  fontSize: '1.5rem',
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
                      fontSize: '0.875rem',
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

            {/* Navigation Links */}
            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={{ xs: 1, sm: 3 }}
              alignItems="center"
            >
              {navItems.map((item) => (
                <Button
                  key={item.label}
                  variant="text"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 500,
                    fontSize: '1rem',
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    transition: 'all 0.2s',
                    '&:hover': {
                      bgcolor: 'action.hover',
                      transform: 'translateY(-1px)',
                      color: 'primary.main',
                    }
                  }}
                  onClick={() => navigate(item.path)}
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Box>
        </Toolbar>
    </AppBar>
    </Box>
  );
};