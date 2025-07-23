// src/components/AboutPage.tsx
import React, { useState } from 'react';
import { useAbout } from '../lib/hooks/useAbout';
import { Button, CircularProgress, TextField, Typography } from '@mui/material';
import Grid2 from '@mui/material/Grid';

export const AboutPage: React.FC = () => {
  const { about, isLoading, isError, updateAbout } = useAbout();
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState(about);

  // sync form when about loads
  React.useEffect(() => {
    if (about) setFormState(about);
  }, [about]);

  if (isLoading) return <CircularProgress />;
  if (isError || !about) return <Typography color="error">Error loading About Me</Typography>;

  const handleChange = (
    field: keyof Omit<typeof about, 'id' | 'fullName' | 'bio' | 'location'>,
    value: string
  ) => {
    setFormState(s => ({ ...s!, [field]: value }));
  };

  const handleLocalizedChange = (
    section: 'fullName' | 'bio' | 'location',
    lang: 'en' | 'he',
    value: string
  ) => {
    setFormState(s => ({
      ...s!,
      [section]: { ...s![section], [lang]: value },
    }));
  };

  const handleSave = () => {
    updateAbout.mutate(formState!);
    setEditMode(false);
  };

  return (
    <Grid2 container spacing={2} padding={4}>
  <Grid2 size={12}>
    <Typography variant="h4">About Me</Typography>
  </Grid2>

  <Grid2 size={12} >
    <Typography variant="h6">Full Name (EN)</Typography>
    {editMode ? (
      <TextField
        fullWidth
        value={formState!.fullName.en}
        onChange={e => handleLocalizedChange('fullName', 'en', e.target.value)}
      />
    ) : (
      <Typography>{about.fullName.en}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="h6">Full Name (HE)</Typography>
    {editMode ? (
      <TextField
        fullWidth
        value={formState!.fullName.he}
        onChange={e => handleLocalizedChange('fullName', 'he', e.target.value)}
      />
    ) : (
      <Typography>{about.fullName.he}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="h6">Bio (EN)</Typography>
    {editMode ? (
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={formState!.bio.en}
        onChange={e => handleLocalizedChange('bio', 'en', e.target.value)}
      />
    ) : (
      <Typography paragraph>{about.bio.en}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="h6">Bio (HE)</Typography>
    {editMode ? (
      <TextField
        fullWidth
        multiline
        minRows={3}
        value={formState!.bio.he}
        onChange={e => handleLocalizedChange('bio', 'he', e.target.value)}
      />
    ) : (
      <Typography paragraph>{about.bio.he}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="subtitle1">Email</Typography>
    {editMode ? (
      <TextField
        fullWidth
        value={formState!.email}
        onChange={e => handleChange('email', e.target.value)}
      />
    ) : (
      <Typography>{about.email}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="subtitle1">GitHub</Typography>
    {editMode ? (
      <TextField
        fullWidth
        value={formState!.gitHub}
        onChange={e => handleChange('gitHub', e.target.value)}
      />
    ) : (
      <Typography>{about.gitHub}</Typography>
    )}
  </Grid2>

  <Grid2 size={12}>
    <Typography variant="subtitle1">LinkedIn</Typography>
    {editMode ? (
      <TextField
        fullWidth
        value={formState!.linkedIn}
        onChange={e => handleChange('linkedIn', e.target.value)}
      />
    ) : (
      <Typography>{about.linkedIn}</Typography>
    )}
  </Grid2>

  <Grid2 size={12} display="flex" justifyContent="flex-end" gap={1}>
    {editMode ? (
      <>
        <Button variant="contained" onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save'}
        </Button>
        <Button variant="outlined" onClick={() => setEditMode(false)}>
          Cancel
        </Button>
      </>
    ) : (
      <Button variant="contained" onClick={() => setEditMode(true)}>
        Edit
      </Button>
    )}
  </Grid2>
</Grid2>

  );
};
