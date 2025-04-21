// src/components/UploadProgress.jsx
import React from 'react';
import { Box, Typography, LinearProgress } from '@mui/material';
import { colors } from '../../constants/uploadDatasetColors';

const UploadProgress = ({ uploadProgress, files }) => {
    const imagesCount = files.filter((f) => f.type.startsWith('image/')).length;
    return (
        <Box sx={{ textAlign: 'center', p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                Uploading Dataset...
            </Typography>
            <Typography variant="body2" sx={{ color: colors.textSecondary, mb: 2 }}>
                Uploading {imagesCount} image files...
            </Typography>
            <LinearProgress
                variant="determinate"
                value={uploadProgress}
                sx={{
                    height: 10,
                    borderRadius: 5,
                    mb: 2,
                }}
            />
            <Typography variant="caption" sx={{ color: colors.textPrimary }}>
                {uploadProgress}% completed
            </Typography>
        </Box>
    );
};

export default UploadProgress;