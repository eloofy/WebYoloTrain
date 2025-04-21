import React from 'react';
import { Box, Typography, IconButton, TextField, Alert, AlertTitle, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ImagePreviewWithBoxes from './ImagePreviewWithBoxes';
import { colors } from '../../constants/uploadDatasetColors';
import { blueButtonStyle } from '../../styles/authStyles';

const PreviewConfirm = ({
                            datasetName,
                            setDatasetName,
                            datasetDescription,
                            setDatasetDescription,
                            previewImages,
                            currentIndex,
                            setCurrentIndex,
                            errors,
                            handleUpload,
                            goBack
                        }) => {
    return (
        <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <IconButton onClick={goBack} sx={{ color: colors.textPrimary, mr: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6">Preview & Confirm</Typography>
            </Box>

            {/* Dataset Name */}
            <TextField
                label="Dataset Name"
                variant="outlined"
                fullWidth
                value={datasetName}
                onChange={(e) => setDatasetName(e.target.value)}
                InputLabelProps={{
                    sx: {
                        color: colors.textPrimary,
                        '&.Mui-focused': { color: colors.primary },
                    },
                }}
                sx={{
                    mb: 2,
                    backgroundColor: colors.border,
                    borderRadius: 1,
                    input: { color: colors.textPrimary },
                }}
            />

            {/* Dataset Description */}
            <TextField
                label="Dataset Description"
                variant="outlined"
                fullWidth
                multiline
                minRows={3}
                value={datasetDescription}
                onChange={(e) => setDatasetDescription(e.target.value)}
                InputLabelProps={{
                    sx: {
                        color: colors.textPrimary,
                        '&.Mui-focused': { color: colors.primary },
                    },
                }}
                sx={{
                    mb: 2,
                    backgroundColor: colors.border,
                    borderRadius: 1,
                    textarea: { color: colors.textPrimary },
                }}
            />

            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    mb: 2,
                }}
            >
                {previewImages.length > 0 && (
                    <ImagePreviewWithBoxes imageData={previewImages[currentIndex]} />
                )}
                {previewImages.length > 1 && (
                    <>
                        <IconButton
                            onClick={() =>
                                setCurrentIndex((prev) => (prev - 1 + previewImages.length) % previewImages.length)
                            }
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: -16,
                                transform: 'translateY(-50%)',
                                color: colors.textPrimary,
                            }}
                        >
                            <ArrowBackIosNewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                            onClick={() =>
                                setCurrentIndex((prev) => (prev + 1) % previewImages.length)
                            }
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                right: -16,
                                transform: 'translateY(-50%)',
                                color: colors.textPrimary,
                            }}
                        >
                            <ArrowForwardIosIcon fontSize="small" />
                        </IconButton>
                    </>
                )}
            </Box>

            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Errors</AlertTitle>
                    {errors.map((err, idx) => (
                        <div key={idx}>• {err}</div>
                    ))}
                </Alert>
            )}

            <Button fullWidth onClick={handleUpload} sx={{ ...blueButtonStyle, mt: 1 }}>
                Upload Dataset
            </Button>
        </>
    );
};

export default PreviewConfirm;