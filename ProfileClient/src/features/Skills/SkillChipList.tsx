import React from 'react';
import { Box, Chip, useTheme } from '@mui/material';
import { getSkillColor } from '../../utils/skillUtils';

interface SkillChipListProps {
  skills: string[];
}

export const SkillChipList: React.FC<SkillChipListProps> = ({ skills }) => {
  const theme = useTheme();

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
      {skills.map((skill, skillIndex) => (
        <Chip
          key={skillIndex}
          label={skill}
          variant="filled"
          color={getSkillColor(skillIndex)}
          sx={{
            borderRadius: 3,
            fontWeight: 500,
            fontSize: '0.875rem',
            height: 36,
            cursor: 'default',
            // Removed hover effects to reduce clickable appearance
            '&:hover': {
              // Only subtle color change on hover, no movement or shadows
              opacity: 0.9,
            },
            // Softer appearance with reduced contrast
            bgcolor: theme.palette.mode === 'light' 
              ? (skillIndex % 2 === 0 ? 'rgba(25, 118, 210, 0.08)' : 'rgba(2, 136, 209, 0.08)')
              : (skillIndex % 2 === 0 ? 'rgba(144, 202, 249, 0.16)' : 'rgba(129, 212, 250, 0.16)'),
            color: theme.palette.mode === 'light' 
              ? (skillIndex % 2 === 0 ? 'rgba(25, 118, 210, 0.87)' : 'rgba(2, 136, 209, 0.87)')
              : (skillIndex % 2 === 0 ? 'rgba(144, 202, 249, 0.87)' : 'rgba(129, 212, 250, 0.87)'),
            border: 'none',
            transition: 'opacity 0.2s ease',
          }}
        />
      ))}
    </Box>
  );
};