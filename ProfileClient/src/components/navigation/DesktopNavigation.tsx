import React from 'react';
import {
  Stack,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { navigationItems, type NavigationItem } from './navigationItems';

interface DesktopNavigationProps {
  items?: NavigationItem[];
}

export const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ 
  items = navigationItems 
}) => {
  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      spacing={3}
      alignItems="center"
    >
      {items.map((item) => (
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
  );
};