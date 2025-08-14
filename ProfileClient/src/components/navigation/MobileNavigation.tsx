import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  useTheme,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import {
  Person as PersonIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { navigationItems, type NavigationItem } from './navigationItems';

interface MobileNavigationProps {
  about: AboutMe;
  items?: NavigationItem[];
}

export const MobileNavigation: React.FC<MobileNavigationProps> = ({ 
  about,
  items = navigationItems 
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Menu */}
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
          {items.map((item) => (
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