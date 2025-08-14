import React from 'react';
import { Paper, IconButton, Typography } from '@mui/material';

interface ContactLinkProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export const ContactLink: React.FC<ContactLinkProps> = ({ icon, label, onClick }) => {
  return (
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
      onClick={onClick}
    >
      <IconButton color="primary" size="small">
        {icon}
      </IconButton>
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {label}
      </Typography>
    </Paper>
  );
};