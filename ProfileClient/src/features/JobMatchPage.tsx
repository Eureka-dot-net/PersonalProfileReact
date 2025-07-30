// src/components/JobMatchPage.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  useTheme,
  Grid,
  Button,
  TextField,
  Alert,
  LinearProgress,
  Divider,
} from '@mui/material';
import {
  Work as WorkIcon,
  Send as SendIcon,
  Psychology as PsychologyIcon,
  TrendingUp as TrendingUpIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Google as GoogleIcon,
} from '@mui/icons-material';
import { useJobMatch, type JobMatchDto } from '../lib/hooks/useJobMatch';

export const JobMatchPage: React.FC = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<JobMatchDto | null>(null);
  const { mutate: analyzeMatch, isPending, isError } = useJobMatch();
  const theme = useTheme();

  const MAX_CHARACTERS = 2500;
  const isOverLimit = jobDescription.length > MAX_CHARACTERS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim() || isOverLimit) return;

    analyzeMatch(jobDescription, {
      onSuccess: (data) => {
        setResult(data);
      },
      onError: (error) => {
        console.error('Job match analysis failed:', error);
      }
    });
  };

  const getMatchColor = (percentage: number) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getMatchLabel = (percentage: number) => {
    if (percentage >= 80) return 'Excellent Match';
    if (percentage >= 60) return 'Good Match';
    if (percentage >= 40) return 'Moderate Match';
    return 'Poor Match';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 2, px: { xs: 2, sm: 3 } }}>
      <Grid container spacing={2}>
        {/* Header Section */}
        <Grid size={12}>
          <Paper 
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
              p: { xs: 3, md: 4 },
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5, flexDirection: { xs: 'column', sm: 'row' }, textAlign: { xs: 'center', sm: 'left' } }}>
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  flexShrink: 0,
                }}
              >
                <WorkIcon sx={{ fontSize: '2rem' }} />
              </Box>
              <Box>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700, 
                    color: 'text.primary', 
                    mb: 0.5,
                    fontSize: { xs: '1.75rem', sm: '2.125rem' }
                  }}
                >
                  Job Match Analyzer
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    color: 'text.secondary',
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                >
                  Paste a job description below to see how well it matches your profile
                </Typography>
              </Box>
            </Box>
            
            {/* Powered by Gemini indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Chip
                icon={<GoogleIcon sx={{ fontSize: '1rem' }} />}
                label="Powered by Gemini AI"
                variant="outlined"
                size="small"
                sx={{ borderRadius: 2 }}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Input Section */}
        <Grid size={12}>
          <Paper 
            elevation={6}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ p: { xs: 2, md: 3 } }}>
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
                <SendIcon />
                Job Description
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the job description here..."
                  variant="outlined"
                  error={isOverLimit}
                  sx={{ 
                    mb: 1.5,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', sm: '1rem' }
                    }
                  }}
                />

                {/* Character counter and validation */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography 
                    variant="caption" 
                    color={isOverLimit ? 'error' : 'text.secondary'}
                    sx={{ fontWeight: 500 }}
                  >
                    {jobDescription.length} / {MAX_CHARACTERS} characters
                  </Typography>
                  {isOverLimit && (
                    <Chip
                      label="Too long"
                      color="error"
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: 2 }}
                    />
                  )}
                </Box>

                {/* Over limit warning */}
                {isOverLimit && (
                  <Alert 
                    severity="warning" 
                    icon={<WarningIcon />}
                    sx={{ borderRadius: 2, mb: 3 }}
                  >
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Job description is too long!</strong>
                    </Typography>
                    <Typography variant="body2">
                      Please shorten your job description to {MAX_CHARACTERS} characters or less. 
                      Consider using an AI tool like ChatGPT or Claude to summarize the key requirements and responsibilities.
                    </Typography>
                  </Alert>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <PsychologyIcon />}
                  disabled={isPending || !jobDescription.trim() || isOverLimit}
                  sx={{ 
                    borderRadius: 2, 
                    px: 4,
                    width: { xs: '100%', sm: 'auto' },
                    fontSize: { xs: '0.9rem', sm: '1rem' }
                  }}
                  size="large"
                >
                  {isPending ? 'Analyzing...' : 'Analyze Match'}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Error State */}
        {isError && (
          <Grid size={12}>
            <Alert 
              severity="error" 
              icon={<ErrorIcon />}
              sx={{ borderRadius: 2 }}
            >
              <Typography variant="body1">
                Failed to analyze job match. Please try again.
              </Typography>
            </Alert>
          </Grid>
        )}

        {/* Results Section */}
        {result && (
          <Grid size={12}>
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
              {result.isSuccess && result.matchPercentage !== undefined && (
                <Box sx={{ p: { xs: 2, md: 3 } }}>
                  {/* Match Percentage */}
                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 1, sm: 0 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Match Score
                      </Typography>
                      <Chip
                        label={getMatchLabel(result.matchPercentage)}
                        color={getMatchColor(result.matchPercentage)}
                        variant="filled"
                        sx={{ borderRadius: 2, fontWeight: 600 }}
                      />
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                      <LinearProgress
                        variant="determinate"
                        value={result.matchPercentage}
                        color={getMatchColor(result.matchPercentage)}
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
                          color: `${getMatchColor(result.matchPercentage)}.main`,
                          minWidth: '60px',
                          textAlign: { xs: 'center', sm: 'right' },
                          fontSize: { xs: '1.5rem', sm: '1.5rem' }
                        }}
                      >
                        {result.matchPercentage}%
                      </Typography>
                    </Box>
                  </Box>

                  {/* Explanation */}
                  {result.explanation && (
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
                              whiteSpace: 'pre-line' // This preserves line breaks
                            }}
                          >
                            {result.explanation}
                          </Typography>
                        </Paper>
                      </Box>
                    </>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* Empty State / Instructions */}
        {!result && !isPending && (
          <Grid size={12}>
            <Paper 
              elevation={4} 
              sx={{ 
                borderRadius: 3, 
                p: 4, 
                textAlign: 'center',
                bgcolor: 'grey.50'
              }}
            >
              <PsychologyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                Ready to analyze your job match
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Paste a job description above and click "Analyze Match" to get started
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};