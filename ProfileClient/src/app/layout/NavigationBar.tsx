// src/components/NavigationBar.tsx
import React, { useState } from 'react';
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
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useMediaQuery,
} from '@mui/material';
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useAbout } from '../../lib/hooks/useAbout';
import { useNavigate } from 'react-router-dom';

export const NavigationBar: React.FC = () => {
  const { about, isLoading, isError } = useAbout();
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: 'Job Match', path: '/jobmatch' },
  ];

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
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
          <Toolbar sx={{ p: { xs: 1, md: 2 }, minHeight: { xs: 64, md: 70 } }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}>
              {/* Logo/Profile Section */}
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

              {/* Desktop Navigation Links */}
              {!isMobile && (
                <Stack
                  direction="row"
                  spacing={3}
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
              )}

              {/* Mobile Hamburger Menu */}
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={handleMobileMenuToggle}
                  sx={{
                    color: 'text.primary',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
            pt: 2,
          },
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          px: 2,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            Navigation
          </Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => handleMobileNavClick(item.path)}
                sx={{
                  py: 2,
                  px: 3,
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'action.hover',
                    transform: 'translateX(4px)',
                  }
                }}
              >
                <ListItemText 
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    color: 'text.primary',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        {/* Profile info in drawer */}
        <Box sx={{ 
          mt: 'auto', 
          p: 3, 
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center'
        }}>
          <Avatar
            src={about.profilePictureUrl || undefined}
            sx={{
              width: 60,
              height: 60,
              mx: 'auto',
              mb: 2,
              bgcolor: 'primary.main',
              border: `2px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[2]
            }}
          >
            {!about.profilePictureUrl && <PersonIcon fontSize="large" />}
          </Avatar>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
            {about.fullName.en}
          </Typography>
          {about.location.en && (
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                cursor: 'pointer',
                '&:hover': {
                  color: 'primary.main',
                  textDecoration: 'underline',
                }
              }}
              onClick={() => {
                window.open(`https://maps.google.com/?q=${encodeURIComponent(about.location.en)}`, '_blank');
                setMobileMenuOpen(false);
              }}
            >
              📍 {about.location.en}
            </Typography>
          )}
        </Box>
      </Drawer>
    </>
  );
};