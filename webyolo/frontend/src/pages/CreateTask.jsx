// CreateTaskPage.js
import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Divider,
    Card,
    CardActionArea,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import Sidebar from '../components/layout/Sidebar';
import DatasetSelectionModal from '../components/createtask/DatasetSelectionModal';
import ConfigModal from '../components/createtask/ConfigModel';
import { blueButtonStyle } from "../styles/authStyles";
import { CreteTask } from '../services/taskService';

// Параметры по умолчанию для тренировки и аугментации
const defaultTrainingParams = {
    epochs: 2,
    patience: 10,
    optimizer: 'AdamW',
    cos_lr: true,
    lr0: 0.01,
    lrf: 0.001,
    momentum: 0.98,
    weight_decay: 0.005,
    warmup_epochs: 1,
    warmup_momentum: 0.6,
    warmup_bias_lr: 0.1,
    freeze: 9,
    dropout: 0.09,
};

const defaultAugmentParams = {
    hsv_h: 0.01,
    hsv_s: 0.5,
    hsv_v: 0.1,
    degrees: 30,
    translate: 0.1,
    scale: 0.8,
    shear: 0.2,
    flipud: 0.5,
    fliplr: 0.5,
    mosaic: 0.1,
    mixup: 0.01,
    copy_paste: 0,
    erasing: 0.2,
};

// Компонент для отображения иконки из слоев
const LayerIcon = ({ layers }) => {
    const squareSize = 30;
    const offset = 4; // сдвиг для наложения
    const squares = [];
    for (let i = 0; i < layers; i++) {
        squares.push(
            <Box
                key={i}
                sx={{
                    position: 'absolute',
                    top: i * offset,
                    left: i * offset,
                    width: squareSize,
                    height: squareSize,
                    border: '2px solid',
                    borderColor: 'currentColor',
                    borderRadius: 1,
                    backgroundColor: 'transparent',
                }}
            />
        );
    }
    return (
        <Box
            sx={{
                position: 'relative',
                width: squareSize + offset * (layers - 1),
                height: squareSize + offset * (layers - 1),
            }}
        >
            {squares}
        </Box>
    );
};

const CreateTaskPage = () => {
    // Состояния для данных задачи
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');

    // Конфигурации (устанавливаются через модальное окно)
    const [trainingParams, setTrainingParams] = useState(defaultTrainingParams);
    const [augmentationParams, setAugmentParams] = useState(defaultAugmentParams);

    // Выбранная модель
    const [selectedModel, setSelectedModel] = useState('');

    // Выбранный датасет (объект)
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [openDatasetModal, setOpenDatasetModal] = useState(false);

    // Состояния модальных окон
    const [openConfigModal, setOpenConfigModal] = useState(false);
    const [openSuccessModal, setOpenSuccessModal] = useState(false);

    // Сообщения конфигурации и ошибок
    const [configMessage, setConfigMessage] = useState('');
    const [configSet, setConfigSet] = useState(false);
    const [errorTaskDetails, setErrorTaskDetails] = useState(false);
    const [errorSelectedModel, setErrorSelectedModel] = useState(false);
    const [errorSelectedDataset, setErrorSelectedDataset] = useState(false);
    const [errorConfig, setErrorConfig] = useState(false);

    // Функция отправки запроса на бэкэнд
    const handleCreateTask = async () => {
        let valid = true;

        // Проверка Task Details
        if (!taskTitle || !taskDescription) {
            setErrorTaskDetails(true);
            valid = false;
        } else {
            setErrorTaskDetails(false);
        }

        // Проверка Configure Parameters
        if (!configSet) {
            setErrorConfig(true);
            valid = false;
        } else {
            setErrorConfig(false);
        }

        // Проверка выбранной модели
        if (!selectedModel) {
            setErrorSelectedModel(true);
            valid = false;
        } else {
            setErrorSelectedModel(false);
        }

        // Проверка выбранного датасета
        if (!selectedDataset) {
            setErrorSelectedDataset(true);
            valid = false;
        } else {
            setErrorSelectedDataset(false);
        }

        if (!valid) return; // Если хотя бы одно обязательное поле не заполнено, запрос не отправляем

        const payload = {
            model_type: selectedModel,
            task_title: taskTitle,
            description: taskDescription,
            dataset_id: selectedDataset,
            config: {
                model_config: trainingParams,
                augment_config: augmentationParams,
            },
        };

        try {
            const response = await CreteTask(payload)

            if (response.status === 200) {
                // Если задача успешно создана, показываем модальное окно с успехом
                setOpenSuccessModal(true);
                // Здесь можно сбросить поля или сделать перенаправление
            } else {
                // Если ответ не ок – можно обработать ошибку, вывести сообщение пользователю
                console.error('Submission failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        }

        console.log("Creating Training Task with payload:", payload);
    };

    const handleModelSelect = (model) => {
        setSelectedModel(model);
        setErrorSelectedModel(false);
    };

    // Callback для сохранения конфигурации из модального окна
    const handleSaveConfig = ({ trainingParams, augmentParams }) => {
        setTrainingParams(trainingParams);
        setAugmentParams(augmentParams);
        setConfigMessage('Configuration is set!');
        setConfigSet(true);
        setErrorConfig(false);
        setTimeout(() => setConfigMessage(''), 3000);
    };

    // Данные для карточек моделей: 5 вариантов
    const modelOptions = [
        { value: 'yolov8n.pt', label: 'YOLOv8n (Nano)', params: '~3.2 млн', layers: 1 },
        { value: 'yolov8s.pt', label: 'YOLOv8s (Small)', params: '~11.2 млн', layers: 2 },
        { value: 'yolov8m.pt', label: 'YOLOv8m (Medium)', params: '~26.0 млн', layers: 3 },
        { value: 'yolov8l.pt', label: 'YOLOv8l (Large)', params: '~43.0 млн', layers: 4 },
        { value: 'yolov8x.pt', label: 'YOLOv8x (Extra Large)', params: '~68.0 млн', layers: 5 },
    ];

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    minHeight: '100vh',
                    backgroundColor: '#141824',
                    ml: 13,
                }}
            >
                <Sidebar active="create-task" />
                <Box
                    sx={{
                        flex: 1,
                        ml: '72px',
                        px: { xs: 3, md: 6 },
                        py: 5,
                    }}
                >
                    <Paper
                        sx={{
                            p: { xs: 1, md: 2 },
                            bgcolor: 'rgba(255,255,255,0.1)',
                            borderRadius: 3,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            backdropFilter: 'blur(8px)',
                            transition: 'all 0.3s ease',
                            border: '1px solid rgba(255,255,255,0.1)',
                        }}
                    >
                        <Typography
                            variant="h4"
                            sx={{
                                mb: 1,
                                fontWeight: 'bold',
                                textAlign: 'center',
                                color: '#e2e8f0',
                            }}
                        >
                            Create Task
                        </Typography>

                        {/* Task Details */}
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 1,
                                color: errorTaskDetails ? '#f34a3b !important' : '#94a3b8',
                                fontWeight: 500,
                                textAlign: 'center',
                            }}
                        >
                            Task Details
                        </Typography>
                        <TextField
                            label="Task Title"
                            value={taskTitle}
                            onChange={(e) => {
                                setTaskTitle(e.target.value);
                                if (e.target.value) setErrorTaskDetails(false);
                            }}
                            fullWidth
                            variant="outlined"
                            sx={{
                                mb: 1,
                                '& .MuiInputBase-input': { color: 'white', fontSize: '1rem' },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#0f172a',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#3b82f6' },
                                },
                            }}
                        />
                        <TextField
                            label="Task Description"
                            value={taskDescription}
                            onChange={(e) => {
                                setTaskDescription(e.target.value);
                                if (e.target.value) setErrorTaskDetails(false);
                            }}
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            sx={{
                                mb: 1,
                                '& .MuiInputBase-input': { color: 'white', fontSize: '0.95rem' },
                                '& .MuiInputLabel-root': { color: '#94a3b8' },
                                '& .MuiOutlinedInput-root': {
                                    backgroundColor: '#0f172a',
                                    borderRadius: 2,
                                    '& fieldset': { borderColor: '#334155' },
                                    '&:hover fieldset': { borderColor: '#3b82f6' },
                                },
                            }}
                        />

                        <Divider sx={{ my: 3, borderColor: '#334155' }} />

                        {/* Configure Parameters */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    color: errorConfig ? '#f34a3b !important' : '#94a3b8',
                                    fontWeight: 500,
                                    textAlign: 'center',
                                }}
                            >
                                Configure Parameters
                            </Typography>
                            {configSet ? (
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenConfigModal(true)}
                                    sx={{
                                        ...blueButtonStyle,
                                        backgroundColor: 'transparent',
                                        border: '1px solid #0041e8',
                                        color: 'white',
                                        textTransform: 'none',
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' },
                                    }}
                                >
                                    Change config
                                </Button>
                            ) : (
                                <Button
                                    sx={{ ...blueButtonStyle, border: 'none' }}
                                    variant="outlined"
                                    onClick={() => setOpenConfigModal(true)}
                                >
                                    Parameters
                                </Button>
                            )}
                        </Box>

                        <Divider sx={{ my: 1, borderColor: '#334155' }} />

                        {/* Select Model */}
                        <Typography
                            variant="h6"
                            sx={{
                                mb: 1,
                                color: errorSelectedModel ? '#f34a3b !important' : '#94a3b8',
                                fontWeight: 500,
                                textAlign: 'center',
                            }}
                        >
                            Select Model
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-around',
                                mb: 1,
                                gap: 0,
                            }}
                        >
                            {modelOptions.map((model) => (
                                <Card
                                    key={model.value}
                                    sx={{
                                        backgroundColor:
                                            selectedModel === model.value
                                                ? '#0041e8'
                                                : 'rgba(255,255,255,0.1)',
                                        color: selectedModel === model.value ? 'white' : '#9ca3af',
                                        filter:
                                            selectedModel && selectedModel !== model.value
                                                ? 'brightness(60%)'
                                                : 'none',
                                        width: 130,
                                        textAlign: 'center',
                                        borderRadius: 2,
                                        transition: 'filter 0.3s ease, background-color 0.3s ease',
                                        p: 0,
                                    }}
                                >
                                    <CardActionArea
                                        onClick={() => handleModelSelect(model.value)}
                                        sx={{
                                            p: 2,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <LayerIcon layers={model.layers} />
                                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                                            {model.label}
                                        </Typography>
                                        <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.8 }}>
                                            {model.params}
                                        </Typography>
                                    </CardActionArea>
                                </Card>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3, borderColor: '#334155' }} />

                        {/* Select Dataset */}
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 1,
                                    color: errorSelectedDataset ? '#f34a3b !important' : '#94a3b8',
                                    fontWeight: 500,
                                }}
                            >
                                Select Dataset
                            </Typography>
                            {selectedDataset ? (
                                <Paper
                                    onClick={() => {
                                        setOpenDatasetModal(true);
                                        setErrorSelectedDataset(false);
                                    }}
                                    sx={{
                                        p: 2,
                                        bgcolor: '#1e293b',
                                        cursor: 'pointer',
                                        display: 'inline-block',
                                        position: 'relative',
                                        transition: 'transform 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            boxShadow: 8,
                                            bgcolor: '#334155',
                                        },
                                    }}
                                >
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                                        {selectedDataset.name}
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        Created: {new Date(selectedDataset.create_at).toLocaleDateString()}
                                    </Typography>
                                    {selectedDataset.is_public && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: 8,
                                                right: 8,
                                                backgroundColor: '#60a5fa',
                                                color: 'white',
                                                borderRadius: '4px',
                                                px: 1,
                                                py: 0.5,
                                                fontSize: '12px',
                                            }}
                                        >
                                            Public
                                        </Box>
                                    )}
                                </Paper>
                            ) : (
                                <Button
                                    variant="outlined"
                                    onClick={() => setOpenDatasetModal(true)}
                                    sx={{
                                        ...blueButtonStyle,
                                        border: 'none',
                                    }}
                                >
                                    Dataset
                                </Button>
                            )}
                        </Box>

                        {/* Create Task Button */}
                        <Box sx={{ textAlign: 'right' }}>
                            <Button
                                variant="contained"
                                onClick={handleCreateTask}
                                sx={blueButtonStyle}
                            >
                                Create
                            </Button>
                        </Box>

                        {/* Success Modal */}
                        <Dialog
                            open={openSuccessModal}
                            onClose={() => setOpenSuccessModal(false)}
                            fullWidth
                            maxWidth="sm"
                            PaperProps={{
                                sx: {
                                    backgroundColor: '#1e293b', // непрозрачный тёмный фон
                                    border: '1px solid #334155', // тёмно-серый бордер
                                },
                            }}
                        >
                            <DialogTitle sx={{ color: '#e2e8f0', textAlign: 'center' }}>
                                Success
                            </DialogTitle>
                            <DialogContent sx={{ color: 'limegreen', textAlign: 'center', py: 3 }}>
                                Task was successfully submitted!
                            </DialogContent>
                        </Dialog>
                    </Paper>
                </Box>
            </Box>

            {/* Модальное окно выбора датасета */}
            <DatasetSelectionModal
                open={openDatasetModal}
                onClose={() => setOpenDatasetModal(false)}
                onSelect={(dataset) => {
                    setSelectedDataset(dataset);
                    setErrorSelectedDataset(false);
                    setOpenDatasetModal(false);
                }}
            />

            {/* Модальное окно конфигурации */}
            <ConfigModal
                open={openConfigModal}
                onClose={() => setOpenConfigModal(false)}
                onSave={handleSaveConfig}
                initialTraining={defaultTrainingParams}
                initialAugment={defaultAugmentParams}
            />
        </>
    );
};

export default CreateTaskPage;