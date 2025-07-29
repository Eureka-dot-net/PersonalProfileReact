// src/components/ProjectPage.tsx
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
    ImageList,
    ImageListItem,
    Modal,
    Backdrop,
} from '@mui/material';
import {
    Code as CodeIcon,
    Launch as LaunchIcon,
    GitHub as GitHubIcon,
    Work as WorkIcon,
    Image as ImageIcon,
    Build as BuildIcon,
    Close as CloseIcon,
} from '@mui/icons-material';
import { useProjects } from '../lib/hooks/useProject';

export const ProjectPage: React.FC = () => {
    const { projects, isLoading, isError } = useProjects();
    const theme = useTheme();
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', py: 8, mt: 12 }}>
                <CircularProgress size={60} />
            </Container>
        );
    }

    if (isError || !projects) {
        return (
            <Container maxWidth="lg" sx={{ py: 8, mt: 12 }}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        bgcolor: 'error.light',
                        color: 'error.contrastText'
                    }}
                >
                    <Typography variant="h6">Error loading Project information</Typography>
                </Paper>
            </Container>
        );
    }

    return (
        <>
            <Grid container spacing={4}>
                {/* Project Cards */}
                {projects.map((project) => (
                    <Grid size={12} key={project.id}>
                        <Paper
                            elevation={6}
                            sx={{
                                borderRadius: 4,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    elevation: 8,
                                    transform: 'translateY(-4px)',
                                }
                            }}
                        >
                            {/* Card Header */}
                            <Box
                                sx={{
                                    background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
                                    p: { xs: 3, md: 4 },
                                    borderBottom: `1px solid ${theme.palette.divider}`,
                                }}
                            >
                                <Grid container spacing={2} alignItems="center">
                                    <Grid size={{ xs: 12, md: 8 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            {/* Hide the icon on small screens */}
                                            <Box
                                                sx={{
                                                    width: { xs: 0, md: 48 },
                                                    height: { xs: 0, md: 48 },
                                                    borderRadius: 2,
                                                    bgcolor: 'primary.main',
                                                    display: { xs: 'none', md: 'flex' },
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                }}
                                            >
                                                <CodeIcon />
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="h5"
                                                    component="h2"
                                                    sx={{ fontWeight: 700, color: 'text.primary' }}
                                                >
                                                    {project.name}
                                                </Typography>
                                                <Typography
                                                    variant="body1"
                                                    sx={{ color: 'text.secondary', mt: 0.5 }}
                                                >
                                                    {project.description}
                                                </Typography>
                                            </Box>
                                        </Box>

                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'flex-start', md: 'flex-end' } }}>
                                            <Chip
                                                icon={project.isInProgress ? <BuildIcon sx={{ fontSize: '1rem' }} /> : <WorkIcon sx={{ fontSize: '1rem' }} />}
                                                label={project.isInProgress ? 'In Progress' : 'Completed'}
                                                variant={project.isInProgress ? 'filled' : 'outlined'}
                                                size="small"
                                                color={project.isInProgress ? 'warning' : 'success'}
                                                sx={{ borderRadius: 2 }}
                                            />
                                            {project.images.length > 0 && (
                                                <Chip
                                                    icon={<ImageIcon sx={{ fontSize: '1rem' }} />}
                                                    label={`${project.images.length} Image${project.images.length > 1 ? 's' : ''}`}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ borderRadius: 2 }}
                                                />
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Card Body */}
                            <Box sx={{ p: { xs: 3, md: 4 } }}>
                                {/* Action Buttons */}
                                <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
                                    {project.url && (
                                        <Button
                                            variant="contained"
                                            startIcon={<LaunchIcon />}
                                            href={project.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            View Live
                                        </Button>
                                    )}
                                    {project.gitHubRepo && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<GitHubIcon />}
                                            href={project.gitHubRepo}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            sx={{ borderRadius: 2 }}
                                        >
                                            View Code
                                        </Button>
                                    )}
                                </Box>

                                {/* Project Images */}
                                {project.images.length > 0 && (
                                    <Box sx={{ mb: 3 }}>
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
                                            <ImageIcon />
                                            Project Screenshots
                                        </Typography>

                                        <ImageList
                                            sx={{
                                                width: '100%',
                                                height: 'auto',
                                                gridTemplateColumns: {
                                                    xs: 'repeat(1, 1fr) !important',
                                                    sm: 'repeat(2, 1fr) !important',
                                                    md: 'repeat(3, 1fr) !important'
                                                },
                                                gap: '16px !important',
                                            }}
                                            variant="quilted"
                                            cols={3}
                                            rowHeight={120}
                                        >
                                            {project.images.map((image, index) => (
                                                <ImageListItem key={index}>
                                                    <Box
                                                        sx={{
                                                            width: '100%',
                                                            height: { xs: '150px', sm: '180px', md: '200px' },
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            overflow: 'hidden',
                                                            borderRadius: 2,
                                                            border: `1px solid ${theme.palette.divider}`,
                                                            bgcolor: 'grey.50',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.3s ease',
                                                            position: 'relative',
                                                            '&:hover': {
                                                                transform: 'scale(1.02)',
                                                                boxShadow: theme.shadows[4],
                                                                '& .hover-overlay': {
                                                                    opacity: 1,
                                                                }
                                                            }
                                                        }}
                                                        onClick={() => handleImageClick(image)}
                                                    >
                                                        <Box
                                                            component="img"
                                                            src={image}
                                                            alt={`${project.name} screenshot ${index + 1}`}
                                                            loading="lazy"
                                                            sx={{
                                                                maxWidth: '100%',
                                                                maxHeight: '100%',
                                                                width: 'auto',
                                                                height: 'auto',
                                                                objectFit: 'contain', // This resizes instead of cropping
                                                                display: 'block',
                                                            }}
                                                        />
                                                        {/* Hover overlay */}
                                                        <Box
                                                            className="hover-overlay"
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                right: 0,
                                                                bottom: 0,
                                                                bgcolor: 'rgba(0, 0, 0, 0.7)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                opacity: 0,
                                                                transition: 'opacity 0.3s ease',
                                                                color: 'white',
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                                Click to view full size
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Box>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}

                {/* Empty State */}
                {projects.length === 0 && (
                    <Grid size={12}>
                        <Paper elevation={4} sx={{ borderRadius: 3, p: 6, textAlign: 'center' }}>
                            <CodeIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No project data available
                            </Typography>
                        </Paper>
                    </Grid>
                )}
            </Grid>

            {/* Full Size Image Modal */}
            <Modal
                open={!!selectedImage}
                onClose={handleCloseModal}
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
                        onClick={handleCloseModal}
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

                    {selectedImage && (
                        <Box
                            component="img"
                            src={selectedImage}
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
        </>
    );
};