import React from 'react';
import { Box, Skeleton, Card, CardContent } from '@mui/material';

export const JobMatchLoading: React.FC = () => {
  return (
    <Box>
      {[...Array(3)].map((_, index) => (
        <Card key={index} elevation={2} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box flex={1}>
                <Skeleton variant="text" width="60%" height={32} />
                <Skeleton variant="text" width="40%" height={24} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="30%" height={20} sx={{ mt: 1 }} />
              </Box>
              <Box textAlign="right">
                <Skeleton variant="text" width={60} height={32} />
                <Skeleton variant="text" width={40} height={20} />
              </Box>
            </Box>
            
            <Skeleton variant="rectangular" width="100%" height={8} sx={{ mb: 2, borderRadius: 4 }} />
            
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Skeleton variant="text" width="40%" height={20} />
              <Skeleton variant="text" width="20%" height={20} />
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Skeleton variant="rectangular" width={80} height={24} sx={{ borderRadius: 12 }} />
              <Skeleton variant="rectangular" width={100} height={32} sx={{ borderRadius: 1 }} />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};