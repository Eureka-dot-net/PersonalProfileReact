import React from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { Image as ImageIcon } from '@mui/icons-material';
import { ProjectImageThumbnail } from './ProjectImageThumbnail';

interface ProjectImageGalleryProps {
  images: string[];
  projectName: string;
  onImageClick: (imageUrl: string) => void;
}

export const ProjectImageGallery: React.FC<ProjectImageGalleryProps> = ({ 
  images, 
  projectName, 
  onImageClick 
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h6"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <ImageIcon />
        Project Screenshots
      </Typography>

      <ImageList
        sx={{
          width: '100%',
          height: 'auto',
          overflow: 'hidden',
          gridTemplateColumns: {
            xs: 'repeat(1, 1fr) !important',
            sm: 'repeat(2, 1fr) !important',
            md: 'repeat(3, 1fr) !important'
          },
          gap: '16px !important',
        }}
        variant="quilted"
        cols={3}
        rowHeight={120}
      >
        {images.map((image, index) => (
          <ImageListItem key={index}>
            <ProjectImageThumbnail
              image={image}
              alt={`${projectName} screenshot ${index + 1}`}
              onClick={() => onImageClick(image)}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
};