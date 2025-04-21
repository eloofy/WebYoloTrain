import { useCallback } from 'react';
import { validateYoloZipFile, extractImagePreviews } from '../utils/validateYoloStructure';
import { saveDatasets } from '../services/datasetServices';
import {getCookie} from "../utils/GetCookie";

const useUploadHandlers = ({
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
                           }) => {
    // Сброс состояния
    const resetState = useCallback(() => {
        setActiveStep(0);
        setFiles([]);
        setDatasetName('');
        setErrors([]);
        setPreviewImages([]);
        setUploadProgress(0);
        setCurrentIndex(0);
        setServerCounts(null);
        setIsUploading(false);
        setIsDragging(false);
    }, [
        setActiveStep,
        setFiles,
        setDatasetName,
        setErrors,
        setPreviewImages,
        setUploadProgress,
        setCurrentIndex,
        setServerCounts,
        setIsUploading,
        setIsDragging,
    ]);

    // Обработчик закрытия модального окна
    const handleClose = useCallback(() => {
        resetState();
        onClose();
    }, [resetState, onClose]);

    // Обработчик выбора файлов (в том числе для drag&drop)
    const handleFilesChange = useCallback(
        async (e) => {
            const selectedFiles = Array.from(e.target.files);
            setFiles(selectedFiles);

            // Извлекаем папки для валидации структуры
            const folders = new Set(
                selectedFiles.map((f) => f.webkitRelativePath.split('/')[1])
            );

            const validationErrors = validateYoloZipFile(selectedFiles, folders);
            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            try {
                const previews = await extractImagePreviews(selectedFiles);
                setPreviewImages(previews.slice(0, 3));
            } catch (previewError) {
                console.error('Preview extraction error:', previewError);
                setErrors(['Error extracting preview images.']);
                return;
            }

            // Если название датасета не задано, берем его из имени папки первого файла
            if (selectedFiles.length > 0 && !datasetName) {
                const folderPath = selectedFiles[0].webkitRelativePath;
                const folderName = folderPath.split('/')[0];
                setDatasetName(folderName);
            }

            setErrors([]);
            setActiveStep(1);
        },
        [datasetName, setFiles, setErrors, setPreviewImages, setDatasetName, setActiveStep]
    );

    // Обработчик загрузки файлов на сервер
    const handleUpload = useCallback(
        async (e) => {
            e.preventDefault();

            if (!datasetName.trim()) {
                setErrors(['Please enter a dataset name.']);
                return;
            }
            if (!files.length) {
                setErrors(['No files selected.']);
                return;
            }

            setErrors([]);
            setIsUploading(true);

            const formData = new FormData();
            formData.append('name', datasetName.trim());
            formData.append('description', Description);

            // Исключаем первый файл, если нужно (корректируйте по необходимости)
            const filesToUpload = files.slice(1);
            setFiles(filesToUpload);
            filesToUpload.forEach((file) => {
                formData.append('files', file);
                formData.append('paths', file.webkitRelativePath || '');
            });

            setActiveStep(2);
            setUploadProgress(0);

            const token = getCookie('access');
            const xhr = new XMLHttpRequest();
            xhr.open('POST', saveDatasets);
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    const percentComplete = Math.round((event.loaded / event.total) * 100);
                    setUploadProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                setIsUploading(false);
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        setServerCounts({
                            received: data.received || filesToUpload.length,
                            uploaded: data.uploaded || filesToUpload.length,
                        });
                        fetchMyDatasets();
                        setActiveStep(3);
                    } catch (parseError) {
                        console.error('Server response parsing error:', parseError);
                        setErrors(['Error processing server response.']);
                        setActiveStep(1);
                    }
                } else {
                    console.error('Upload error:', xhr.status, xhr.responseText);
                    setErrors([`Upload error: ${xhr.status}. ${xhr.responseText}`]);
                    setActiveStep(1);
                }
            };

            xhr.onerror = () => {
                setIsUploading(false);
                setErrors(['Error uploading files.']);
                setActiveStep(1);
            };

            xhr.send(formData);
        },
        [
            datasetName,
            files,
            setErrors,
            setIsUploading,
            setFiles,
            setActiveStep,
            setUploadProgress,
            setServerCounts,
            fetchMyDatasets,
        ]
    );

    // Обработчики drag & drop
    const handleDragEnter = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(true);
        },
        [setIsDragging]
    );

    const handleDragLeave = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
        },
        [setIsDragging]
    );

    const handleDragOver = useCallback((e) => {
        e.preventDefault();
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            setIsDragging(false);
            const droppedFiles = Array.from(e.dataTransfer.files);
            const dataTransfer = new DataTransfer();
            droppedFiles.forEach((file) => dataTransfer.items.add(file));
            const event = { target: { files: dataTransfer.files } };
            handleFilesChange(event);
        },
        [setIsDragging, handleFilesChange]
    );

    return {
        resetState,
        handleClose,
        handleFilesChange,
        handleUpload,
        handleDragEnter,
        handleDragLeave,
        handleDragOver,
        handleDrop,
    };
};

export default useUploadHandlers;