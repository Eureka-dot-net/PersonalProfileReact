import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Button,
  Box,
  LinearProgress,
  Link,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Work as WorkIcon,
  LocationOn as LocationOnIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';

interface JobMatchCardProps {
  jobMatch: JobMatchItem;
  onStatusChange?: (id: string, newStatus: string) => void;
}

export const JobMatchCard: React.FC<JobMatchCardProps> = ({ jobMatch, onStatusChange }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
        return 'primary';
      case 'viewed':
        return 'info';
      case 'applied':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'success.main';
    if (percentage >= 60) return 'warning.main';
    return 'error.main';
  };

  return (
    <Card
      elevation={2}
      sx={{
        mb: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          elevation: 4,
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h6" component="h3" gutterBottom>
              {jobMatch.jobTitle}
            </Typography>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <WorkIcon color="action" fontSize="small" />
              <Typography variant="subtitle1" color="text.secondary">
                {jobMatch.company}
              </Typography>
            </Box>
            {jobMatch.location && (
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <LocationOnIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {jobMatch.location}
                </Typography>
              </Box>
            )}
          </Box>
          <Box textAlign="right">
            <Typography
              variant="h5"
              component="div"
              sx={{ color: getMatchColor(jobMatch.matchPercentage), fontWeight: 'bold' }}
            >
              {Math.round(jobMatch.matchPercentage)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Match
            </Typography>
          </Box>
        </Box>

        <Box mb={2}>
          <LinearProgress
            variant="determinate"
            value={jobMatch.matchPercentage}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'grey.200',
              '& .MuiLinearProgress-bar': {
                backgroundColor: getMatchColor(jobMatch.matchPercentage),
              },
            }}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <AccessTimeIcon color="action" fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              Matched on {formatDate(jobMatch.matchedDate)}
            </Typography>
          </Box>
          {jobMatch.salary && (
            <Typography variant="body2" color="text.secondary">
              {jobMatch.salary}
            </Typography>
          )}
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={jobMatch.status}
            color={getStatusColor(jobMatch.status) as any}
            size="small"
            variant="outlined"
          />
          {jobMatch.jobUrl && (
            <Link href={jobMatch.jobUrl} target="_blank" rel="noopener noreferrer">
              <Button
                size="small"
                startIcon={<OpenInNewIcon />}
                sx={{ textTransform: 'none' }}
              >
                View Job
              </Button>
            </Link>
          )}
        </Box>
      </CardContent>

      {onStatusChange && (
        <CardActions sx={{ pt: 0 }}>
          <Button
            size="small"
            onClick={() => onStatusChange(jobMatch.id, 'viewed')}
            disabled={jobMatch.status === 'viewed' || jobMatch.status === 'applied'}
          >
            Mark as Viewed
          </Button>
          <Button
            size="small"
            onClick={() => onStatusChange(jobMatch.id, 'applied')}
            disabled={jobMatch.status === 'applied'}
          >
            Mark as Applied
          </Button>
        </CardActions>
      )}
    </Card>
  );
};