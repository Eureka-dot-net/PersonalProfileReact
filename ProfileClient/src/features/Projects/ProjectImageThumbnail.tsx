import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';

interface ProjectImageThumbnailProps {
  image: string;
  alt: string;
  onClick: () => void;
}

export const ProjectImageThumbnail: React.FC<ProjectImageThumbnailProps> = ({
  image,
  alt,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        height: { xs: '150px', sm: '180px', md: '200px' },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: 'grey.50',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: theme.shadows[4],
          '& .hover-overlay': {
            opacity: 1,
          }
        }
      }}
      onClick={onClick}
    >
      <Box
        component="img"
        src={image}
        alt={alt}
        loading="lazy"
        sx={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'contain',
          display: 'block',
        }}
      />
      {/* Hover overlay */}
      <Box
        className="hover-overlay"
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          color: 'white',
          borderRadius: 2,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Click to view full size
        </Typography>
      </Box>
    </Box>
  );
};