import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Chip,
  CircularProgress,
} from '@mui/material';
import {
  Send as SendIcon,
  Psychology as PsychologyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface JobDescriptionInputProps {
  jobDescription: string;
  setJobDescription: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  statusMessage: string;
}

const MAX_CHARACTERS = 2500;

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  setJobDescription,
  onSubmit,
  isPending,
  statusMessage,
}) => {
  const isOverLimit = jobDescription.length > MAX_CHARACTERS;

  return (
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

        <Box component="form" onSubmit={onSubmit}>
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
            {isPending ? 'Analyzing' : 'Analyze Match'}
          </Button>
          
          {isPending && (
            <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
              {statusMessage}
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};