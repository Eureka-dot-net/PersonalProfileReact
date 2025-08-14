import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  History as HistoryIcon,
} from '@mui/icons-material';

interface JobMatchHistoryHeaderProps {
  onRefresh: () => void;
  onExport?: () => void;
  isLoading?: boolean;
}

export const JobMatchHistoryHeader: React.FC<JobMatchHistoryHeaderProps> = ({
  onRefresh,
  onExport,
  isLoading = false,
}) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ mb: 3 }}
    >
      <Box display="flex" alignItems="center" gap={1}>
        <HistoryIcon color="primary" sx={{ fontSize: 32 }} />
        <Box>
          <Typography variant="h4" component="h2" fontWeight="bold">
            Job Match History
          </Typography>
          <Typography variant="body1" color="text.secondary">
            View and manage your previously analyzed job matches
          </Typography>
        </Box>
      </Box>

      <Box display="flex" alignItems="center" gap={1}>
        <Tooltip title="Refresh job matches">
          <IconButton
            onClick={onRefresh}
            disabled={isLoading}
            color="primary"
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>

        {onExport && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExport}
            disabled={isLoading}
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
        )}
      </Box>
    </Box>
  );
};