import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  LinearProgress,
  Chip,
  Divider,
  useTheme,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Psychology as PsychologyIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import type { JobMatchDto, FileDto } from '../../lib/hooks/useJobMatch';

interface MatchResultsProps {
  result: JobMatchDto;
  onDownloadCv: (file: FileDto) => void;
}

const getMatchColor = (percentage: number): 'success' | 'warning' | 'error' => {
  if (percentage >= 80) return 'success';
  if (percentage >= 60) return 'warning';
  return 'error';
};

const getMatchLabel = (percentage: number): string => {
  if (percentage >= 80) return 'Excellent Match';
  if (percentage >= 60) return 'Good Match';
  if (percentage >= 40) return 'Moderate Match';
  return 'Poor Match';
};

export const MatchResults: React.FC<MatchResultsProps> = ({ result, onDownloadCv }) => {
  const theme = useTheme();

  return (
    <Paper
      elevation={6}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Results Header */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #e8f5e8, #ffffff)',
          p: { xs: 2, md: 3 },
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} mb={2}>
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 1.5
            }}
          >
            <TrendingUpIcon />
            Match Analysis Results
          </Typography>
          {result.tailoredCv?.fileName && (
            <Button
              variant="outlined"
              color="primary"
              onClick={() => onDownloadCv(result.tailoredCv)}
              sx={{ borderRadius: 2 }}
            >
              Download CV
            </Button>
          )}
        </Box>

        {/* Quota Warning */}
        {result.isQuotaExceeded && (
          <Alert
            severity="warning"
            icon={<WarningIcon />}
            sx={{ borderRadius: 2, mb: 2 }}
          >
            <Typography variant="body2">
              API quota exceeded. Please try again {result.retryAfter ? `in ${result.retryAfter}` : 'tomorrow'}.
            </Typography>
          </Alert>
        )}

        {/* Error Message */}
        {result.errorMessage && (
          <Alert
            severity="error"
            icon={<ErrorIcon />}
            sx={{ borderRadius: 2, mb: 2 }}
          >
            <Typography variant="body2">
              {result.errorMessage}
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Results Body */}
      {result.isSuccess && result.matchEvaluation.matchPercentage !== undefined && (
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Match Percentage */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between', 
              mb: 2, 
              flexDirection: { xs: 'column', sm: 'row' }, 
              gap: { xs: 1, sm: 0 } 
            }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Match Score
              </Typography>
              <Chip
                label={getMatchLabel(result.matchEvaluation.matchPercentage)}
                color={getMatchColor(result.matchEvaluation.matchPercentage)}
                variant="filled"
                sx={{ borderRadius: 2, fontWeight: 600 }}
              />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
              <LinearProgress
                variant="determinate"
                value={result.matchEvaluation.matchPercentage}
                color={getMatchColor(result.matchEvaluation.matchPercentage)}
                sx={{
                  flexGrow: 1,
                  height: 12,
                  borderRadius: 6,
                  bgcolor: 'grey.200',
                  width: { xs: '100%', sm: 'auto' }
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: `${getMatchColor(result.matchEvaluation.matchPercentage)}.main`,
                  minWidth: '60px',
                  textAlign: { xs: 'center', sm: 'right' },
                  fontSize: { xs: '1.5rem', sm: '1.5rem' }
                }}
              >
                {result.matchEvaluation.matchPercentage}%
              </Typography>
            </Box>
          </Box>

          {/* Explanation */}
          {result.matchEvaluation.explanation && (
            <>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    color: 'text.primary',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <PsychologyIcon />
                  Analysis Explanation
                </Typography>

                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      lineHeight: 1.8,
                      color: 'text.primary',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {result.matchEvaluation.explanation}
                  </Typography>
                </Paper>
              </Box>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};