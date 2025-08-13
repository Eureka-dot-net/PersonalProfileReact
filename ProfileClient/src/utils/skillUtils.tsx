import React from 'react';
import {
  Code as CodeIcon,
  Storage as DatabaseIcon,
  Cloud as CloudIcon,
  Build as ToolsIcon,
  Language as LanguageIcon,
  DeviceHub as DevOpsIcon,
} from '@mui/icons-material';

// Icon mapping for different skill categories
export const getCategoryIcon = (category: string): React.ReactElement => {
  const lowerCategory = category.toLowerCase();
  
  if (lowerCategory.includes('programming') || lowerCategory.includes('language')) {
    return <LanguageIcon />;
  } else if (lowerCategory.includes('database') || lowerCategory.includes('data')) {
    return <DatabaseIcon />;
  } else if (lowerCategory.includes('cloud') || lowerCategory.includes('aws') || lowerCategory.includes('azure')) {
    return <CloudIcon />;
  } else if (lowerCategory.includes('devops') || lowerCategory.includes('ci/cd')) {
    return <DevOpsIcon />;
  } else if (lowerCategory.includes('tools') || lowerCategory.includes('software')) {
    return <ToolsIcon />;
  } else {
    return <CodeIcon />;
  }
};

// Simplified color scheme with muted colors
export const getSkillColor = (index: number): 'primary' | 'info' => {
  const colors = ['primary', 'info'] as const;
  return colors[index % colors.length];
};