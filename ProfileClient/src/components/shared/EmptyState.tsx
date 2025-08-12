import React from 'react';
import { Grid, Paper, Typography, type SvgIconProps } from '@mui/material';
import { Work as WorkIcon } from '@mui/icons-material';

interface EmptyState {
  message?: string;
  icon?: React.ReactElement<SvgIconProps>;
}

export const EmptyState: React.FC<EmptyState> = ({ 
    icon,
  message = "Loading..."
}) => {
  return (
    <Grid size={12}>
      <Paper elevation={4} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
        {/* Render the passed icon or fallback to WorkIcon */}
        {icon ? (
          React.isValidElement(icon) ? (
            React.cloneElement(icon, { sx: { fontSize: 64, color: 'text.secondary', mb: 2, ...icon.props.sx } })
          ) : (
            icon
          )
        ) : (
          <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        )}
        <WorkIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          {message}
        </Typography>
      </Paper>
    </Grid>
  );
};