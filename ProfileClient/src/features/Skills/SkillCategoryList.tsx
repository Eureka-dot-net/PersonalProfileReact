import React from 'react';
import { Grid } from '@mui/material';
import { SkillCategoryCard } from './SkillCategoryCard';

interface SkillCategoryListProps {
  skills: SkillCategory[];
}

export const SkillCategoryList: React.FC<SkillCategoryListProps> = ({ skills }) => {
  return (
    <>
      {skills.map((skillCategory) => (
        <Grid size={{ xs: 12, md: 6 }} key={skillCategory.category}>
          <SkillCategoryCard skillCategory={skillCategory} />
        </Grid>
      ))}
    </>
  );
};