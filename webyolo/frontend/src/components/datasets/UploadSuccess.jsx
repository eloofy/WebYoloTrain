// src/components/UploadSuccess.jsx
import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { colors } from '../../constants/uploadDatasetColors';
import { blueButtonStyle } from '../../styles/authStyles';

const UploadSuccess = ({ serverCounts, handleClose, files }) => {
    const received = serverCounts ? serverCounts.received : files.length;
    const uploaded = serverCounts ? serverCounts.uploaded : files.length;

    return (
        <Box
            sx={{
                textAlign: 'center',
                p: 3,
                borderRadius: 2,
                backgroundColor: colors.surface,
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                mt: 2,
            }}
        >
            <CheckCircleIcon sx={{ fontSize: 60, color: colors.primary, mb: 1 }} />
            <Typography variant="h5" sx={{ mb: 4, fontWeight: 'bold' }}>
                Dataset Uploaded Successfully!
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
                Files received: {received} <br />
                Files uploaded: {uploaded}
            </Typography>
            <Button fullWidth onClick={handleClose} sx={blueButtonStyle}>
                Done
            </Button>
        </Box>
    );
};

export default UploadSuccess;