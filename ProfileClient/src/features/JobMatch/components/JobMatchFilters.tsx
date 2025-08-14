import React, { useState } from 'react';
import {
  Box,
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Button,
  Grid,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

interface JobMatchFiltersProps {
  filters: JobMatchFilter;
  onFiltersChange: (filters: JobMatchFilter) => void;
  onClearFilters: () => void;
}

const statusOptions = [
  { value: '', label: 'All' },
  { value: 'New', label: 'New' },
  { value: 'Viewed', label: 'Viewed' },
  { value: 'Applied', label: 'Applied' },
  { value: 'Rejected', label: 'Rejected' },
];

export const JobMatchFilters: React.FC<JobMatchFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const [expanded, setExpanded] = useState(false);

  const handleFilterChange = (key: keyof JobMatchFilter, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1, // Reset to first page when filters change
    });
  };

  const hasActiveFilters = !!(
    filters.searchTerm ||
    filters.minMatchPercentage ||
    filters.status ||
    filters.company ||
    filters.fromDate ||
    filters.toDate
  );

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.searchTerm) count++;
    if (filters.minMatchPercentage) count++;
    if (filters.status) count++;
    if (filters.company) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    return count;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <FilterListIcon color="action" />
          <Typography variant="h6">Filters</Typography>
          {hasActiveFilters && (
            <Chip
              label={`${getActiveFilterCount()} active`}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
        <Box>
          <Button
            variant="text"
            onClick={() => setExpanded(!expanded)}
            sx={{ mr: 1 }}
          >
            {expanded ? 'Collapse' : 'Expand'}
          </Button>
          {hasActiveFilters && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<ClearIcon />}
              onClick={onClearFilters}
            >
              Clear All
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            fullWidth
            placeholder="Search job titles, companies, or descriptions..."
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
            }}
          />
        </Grid>

        {expanded && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Company"
                placeholder="Filter by company name"
                value={filters.company || ''}
                onChange={(e) => handleFilterChange('company', e.target.value)}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status || ''}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid size={12}>
              <Typography gutterBottom>
                Minimum Match Percentage: {filters.minMatchPercentage || 0}%
              </Typography>
              <Slider
                value={filters.minMatchPercentage || 0}
                onChange={(_, value) => handleFilterChange('minMatchPercentage', value)}
                aria-labelledby="match-percentage-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="From Date"
                type="date"
                value={filters.fromDate || ''}
                onChange={(e) => handleFilterChange('fromDate', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="To Date"
                type="date"
                value={filters.toDate || ''}
                onChange={(e) => handleFilterChange('toDate', e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Paper>
  );
};