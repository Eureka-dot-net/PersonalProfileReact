import React from 'react';
import { Grid } from '@mui/material';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  onImageClick: (imageUrl: string) => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects, onImageClick }) => {
  return (
    <>
      {projects.map((project) => (
        <Grid size={12} key={project.id}>
          <ProjectCard project={project} onImageClick={onImageClick} />
        </Grid>
      ))}
    </>
  );
};