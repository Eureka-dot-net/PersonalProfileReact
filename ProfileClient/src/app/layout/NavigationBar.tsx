import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useAbout } from '../../lib/hooks/useAbout';
import { 
  ProfileSection, 
  DesktopNavigation, 
  MobileNavigation, 
  dummyAbout 
} from '../../components/navigation';

export const NavigationBar: React.FC = () => {
  const { about } = useAbout();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Use real data if available, otherwise use dummy data
  const displayData = about || dummyAbout;

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
              {/* Profile Section */}
              <ProfileSection about={displayData} />

              {/* Desktop Navigation Links */}
              {!isMobile && <DesktopNavigation />}

              {/* Mobile Navigation */}
              {isMobile && <MobileNavigation about={displayData} />}
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
};