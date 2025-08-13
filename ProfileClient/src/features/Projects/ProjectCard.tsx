import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  Grid,
  useTheme,
} from '@mui/material';
import {
  Code as CodeIcon,
  Work as WorkIcon,
  Image as ImageIcon,
  Build as BuildIcon,
} from '@mui/icons-material';
import { ProjectActions } from './ProjectActions.tsx';
import { ProjectImageGallery } from './ProjectImageGallery.tsx';


interface ProjectCardProps {
  project: Project;
  onImageClick: (imageUrl: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onImageClick }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-4px)',
        }
      }}
    >
      {/* Card Header */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
          p: { xs: 3, md: 4 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              {/* Hide the icon on small screens */}
              <Box
                sx={{
                  width: { xs: 0, md: 48 },
                  height: { xs: 0, md: 48 },
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: { xs: 'none', md: 'flex' },
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                }}
              >
                <CodeIcon />
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  component="h2"
                  sx={{ fontWeight: 700, color: 'text.primary' }}
                >
                  {project.name}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.secondary', mt: 0.5 }}
                >
                  {project.description}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
              <Chip
                icon={project.isInProgress ? <BuildIcon sx={{ fontSize: '1rem' }} /> : <WorkIcon sx={{ fontSize: '1rem' }} />}
                label={project.isInProgress ? 'In Progress' : 'Completed'}
                variant={project.isInProgress ? 'filled' : 'outlined'}
                size="small"
                color={project.isInProgress ? 'warning' : 'success'}
                sx={{ borderRadius: 2 }}
              />
              {project.images.length > 0 && (
                <Chip
                  icon={<ImageIcon sx={{ fontSize: '1rem' }} />}
                  label={`${project.images.length} Image${project.images.length > 1 ? 's' : ''}`}
                  variant="outlined"
                  size="small"
                  sx={{ borderRadius: 2 }}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Card Body */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        {/* Action Buttons */}
        <ProjectActions project={project} />

        {/* Project Images */}
        {project.images.length > 0 && (
          <ProjectImageGallery 
            images={project.images} 
            projectName={project.name}
            onImageClick={onImageClick} 
          />
        )}
      </Box>
    </Paper>
  );
};