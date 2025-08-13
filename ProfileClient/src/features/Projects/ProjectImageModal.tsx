import React from 'react';
import {
  Modal,
  Box,
  Button,
  Backdrop,
  useTheme,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ProjectImageModalProps {
  imageUrl: string | null;
  onClose: () => void;
}

export const ProjectImageModal: React.FC<ProjectImageModalProps> = ({ imageUrl, onClose }) => {
  const theme = useTheme();

  return (
    <Modal
      open={!!imageUrl}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: { bgcolor: 'rgba(0, 0, 0, 0.9)' }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: '90vw',
          maxHeight: '90vh',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Close button */}
        <Button
          onClick={onClose}
          sx={{
            position: 'absolute',
            top: -50,
            right: -10,
            color: 'white',
            bgcolor: 'rgba(255, 255, 255, 0.1)',
            minWidth: 'auto',
            width: 40,
            height: 40,
            borderRadius: '50%',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.2)',
            }
          }}
        >
          <CloseIcon />
        </Button>

        {imageUrl && (
          <Box
            component="img"
            src={imageUrl}
            alt="Full size screenshot"
            sx={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: theme.shadows[10],
            }}
          />
        )}
      </Box>
    </Modal>
  );
};
