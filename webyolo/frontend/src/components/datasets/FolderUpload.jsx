// src/components/FolderUpload.jsx
import React from 'react';
import { Typography, Paper, Alert, AlertTitle } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import { colors } from '../../constants/uploadDatasetColors';

const FolderUpload = ({ isDragging, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFilesChange, errors }) => {
    return (
        <>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Upload Folder
            </Typography>
            <Paper
                elevation={isDragging ? 10 : 3}
                component="label"
                htmlFor="upload-dataset-input"
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 180,
                    border: '2px dashed',
                    borderColor: isDragging ? colors.primary : colors.border,
                    borderRadius: 2,
                    backgroundColor: isDragging ? colors.dropzoneHoverBg : colors.dropzoneBg,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    mb: 2,
                    p: 2,
                }}
            >
                <ArrowUpwardIcon sx={{ fontSize: 40, color: colors.primary, mb: 1 }} />
                <Typography variant="body1" sx={{ color: colors.textPrimary, textAlign: 'center' }}>
                    Drag and drop your YOLOv8 dataset folder here or click to select
                </Typography>
                <Typography variant="caption" sx={{ color: colors.textSecondary }}>
                    Folder must contain train / valid / test directories
                </Typography>
                <input
                    id="upload-dataset-input"
                    type="file"
                    {...{ webkitdirectory: 'true', directory: 'true' }}
                    multiple
                    onChange={handleFilesChange}
                    style={{ display: 'none' }}
                />
            </Paper>
            {errors.length > 0 && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    <AlertTitle>Errors</AlertTitle>
                    {errors.map((err, idx) => (
                        <div key={idx}>• {err}</div>
                    ))}
                </Alert>
            )}
        </>
    );
};

export default FolderUpload;