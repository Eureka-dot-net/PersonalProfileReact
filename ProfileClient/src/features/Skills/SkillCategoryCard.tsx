import React from 'react';
import {
  Box,
  Paper,
  Typography,
  useTheme,
} from '@mui/material';
import { getCategoryIcon } from '../../utils/skillUtils';
import { SkillChipList } from './SkillChipList';
import type { SkillCategory } from '../../lib/hooks/useSkills';

interface SkillCategoryCardProps {
  skillCategory: SkillCategory;
}

export const SkillCategoryCard: React.FC<SkillCategoryCardProps> = ({ skillCategory }) => {
  const theme = useTheme();

  return (
    <Paper 
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-4px)',
        }
      }}
    >
      {/* Category Header */}
      <Box 
        sx={{
          background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
          p: { xs: 3, md: 4 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            {getCategoryIcon(skillCategory.category)}
          </Box>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ fontWeight: 700, color: 'text.primary' }}
          >
            {skillCategory.category}
          </Typography>
        </Box>
      </Box>

      {/* Skills List */}
      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <SkillChipList skills={skillCategory.skills} />
      </Box>
    </Paper>
  );
};