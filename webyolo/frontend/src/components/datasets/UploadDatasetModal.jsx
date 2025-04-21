// src/components/UploadDatasetModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Box } from '@mui/material';
import StepNavigation from './StepNavigation';
import FolderUpload from './FolderUpload';
import PreviewConfirm from './PreviewConfirm';
import UploadProgress from './UploadProgress';
import UploadSuccess from './UploadSuccess';
import { modalStyle } from '../../styles/modalStyles';
import { uploadSteps as steps } from '../../constants/uploadDatasetSteps';
import useUploadHandlers from '../../hooks/uploadDatasets';
import { colors } from '../../constants/uploadDatasetColors';

const UploadDatasetModal = ({ open, onClose, fetchMyDatasets }) => {
    // Состояния компонента
    const [activeStep, setActiveStep] = useState(0);
    const [files, setFiles] = useState([]);
    const [datasetName, setDatasetName] = useState('');
    const [errors, setErrors] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [serverCounts, setServerCounts] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [Description, setDescription] = useState('');

    // Используем хук для обработчиков
    const {
        resetState,
        handleClose,
        handleFilesChange,
        handleUpload,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    } = useUploadHandlers({
        onClose,
        fetchMyDatasets,
        Description,
        datasetName,
        setDatasetName,
        files,
        setFiles,
        setErrors,
        setPreviewImages,
        setActiveStep,
        setUploadProgress,
        setServerCounts,
        setIsUploading,
        setIsDragging,
        setCurrentIndex,
    });

    // Сброс состояния при закрытии модального окна
    useEffect(() => {
        if (!open) {
            resetState();
        }
    }, [open, resetState]);

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle} >
                {/* Шаговая навигация */}
                <StepNavigation activeStep={activeStep} steps={steps} />

                {activeStep === 0 && (
                    <FolderUpload
                        isDragging={isDragging}
                        handleDragEnter={handleDragEnter}
                        handleDragLeave={handleDragLeave}
                        handleDragOver={handleDragOver}
                        handleDrop={handleDrop}
                        handleFilesChange={handleFilesChange}
                        errors={errors}
                    />
                )}

                {activeStep === 1 && (
                    <PreviewConfirm
                        datasetName={datasetName}
                        setDatasetName={setDatasetName}
                        datasetDescription={Description}
                        setDatasetDescription={setDescription}
                        previewImages={previewImages}
                        currentIndex={currentIndex}
                        setCurrentIndex={setCurrentIndex}
                        errors={errors}
                        handleUpload={handleUpload}
                        goBack={() => setActiveStep(0)}
                    />
                )}

                {activeStep === 2 && (
                    <UploadProgress uploadProgress={uploadProgress} files={files} />
                )}

                {activeStep === 3 && (
                    <UploadSuccess
                        serverCounts={serverCounts}
                        handleClose={handleClose}
                        files={files}
                    />
                )}
            </Box>
        </Modal>
    );
};

export default UploadDatasetModal;