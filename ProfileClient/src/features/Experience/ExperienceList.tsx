import React from 'react';
import { Grid } from '@mui/material';
import { ExperienceCard } from './ExperienceCard';

interface ExperienceListProps {
  experiences: Experience[];
}

export const ExperienceList: React.FC<ExperienceListProps> = ({ experiences }) => {
  return (
    <>
      {experiences.map((experience) => (
        <Grid size={12} key={experience.id}>
          <ExperienceCard experience={experience} />
        </Grid>
      ))}
    </>
  );
};