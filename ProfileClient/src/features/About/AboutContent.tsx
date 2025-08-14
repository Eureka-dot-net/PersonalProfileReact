import React from 'react';
import { Grid } from '@mui/material';
import { BioSection } from './BioSection';
import { ContactSection } from './ContactSection';

interface AboutContentProps {
  about: AboutMe;
}

export const AboutContent: React.FC<AboutContentProps> = ({ about }) => {
  return (
    <Grid container spacing={4}>
      {/* Bio Section */}
      <Grid size={12}>
        <BioSection bio={about.bio} />
      </Grid>

      {/* Contact & Social Links */}
      <Grid size={12}>
        <ContactSection 
          email={about.email}
          gitHub={about.gitHub}
          linkedIn={about.linkedIn}
        />
      </Grid>
    </Grid>
  );
};