import React from 'react';
import { Box, Button } from '@mui/material';
import { Launch as LaunchIcon, GitHub as GitHubIcon } from '@mui/icons-material';

interface ProjectActionsProps {
  project: Project;
}

export const ProjectActions: React.FC<ProjectActionsProps> = ({ project }) => {
  const hasActions = project.url || project.gitHubRepo;

  if (!hasActions) return null;

  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
      {project.url && (
        <Button
          variant="contained"
          startIcon={<LaunchIcon />}
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 2 }}
        >
          View Live
        </Button>
      )}
      {project.gitHubRepo && (
        <Button
          variant="outlined"
          startIcon={<GitHubIcon />}
          href={project.gitHubRepo}
          target="_blank"
          rel="noopener noreferrer"
          sx={{ borderRadius: 2 }}
        >
          View Code
        </Button>
      )}
    </Box>
  );
};