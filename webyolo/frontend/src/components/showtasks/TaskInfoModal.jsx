// TaskInfoModal.js
import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import { blueButtonStyle } from "../../styles/authStyles";

const TaskInfoModal = ({ open, onClose, task, onDelete, onStop}) => {
    if (!task) return null;
    console.log(task)

    // Функция для рендеринга конфигурационных параметров в виде списка «ключ: значение»
    const renderConfigSection = (sectionTitle, configSection) => {
        if (!configSection) return null;
        return (
            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#94a3b8', mb: 1 }}>
                    {sectionTitle}
                </Typography>
                {Object.entries(configSection).map(([key, value]) => (
                    <Typography key={key} variant="body2" sx={{ mb: 0.5 }}>
                        <strong>{key}:</strong> {String(value)}
                    </Typography>
                ))}
            </Box>
        );
    };

    // Извлекаем конфигурационные секции (если они есть)
    const modelConfig = task.config?.model_config || null;
    const augmentConfig = task.config?.augment_config || null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 2,
                },
            }}
        >
            <DialogTitle
                sx={{
                    backgroundColor: '#141824',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                Task Details
            </DialogTitle>
            <DialogContent sx={{ backgroundColor: '#1e293b', color: 'white', py: 3 }}>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2rem', color: '#60a5fa' }}>
                        {task.name_task}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Created: <span style={{ color: 'white' }}>{new Date(task.created_at).toLocaleDateString()}</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                        Status: <span style={{ color: 'white' }}>{task.status}</span>
                    </Typography>
                </Box>
                {task.description && (
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#94a3b8', mb: 1 }}>
                            Description
                        </Typography>
                        <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                            {task.description}
                        </Typography>
                    </Box>
                )}
                {task.config && (
                    <Box sx={{ mb: 3 }}>
                        {renderConfigSection("Model Configuration", modelConfig)}
                        {renderConfigSection("Augmentation Configuration", augmentConfig)}
                    </Box>
                )}
                {task.experiment_url && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 500, color: '#94a3b8', mb: 1 }}>
                            Experiment
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#60a5fa' }}>
                            <a href={task.experiment_url} target="_blank" rel="noopener noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>
                                View Experiment
                            </a>
                        </Typography>
                    </Box>
                )}
            </DialogContent>
            <DialogActions
                sx={{
                    backgroundColor: '#1e293b',
                    justifyContent: 'space-between',
                    py: 2,
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                }}
            >
                <Button
                    onClick={() => onDelete(task.id)}
                    variant="contained"
                    sx={{
                        ...blueButtonStyle,
                        backgroundColor: '#da4545',
                        '&:hover': {
                            backgroundColor: '#f6031f',
                            boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
                        },
                        textTransform: 'none',
                    }}
                >
                    Delete
                </Button>

                {task.status !== 'stopped' && (
                    <Button
                        onClick={() => onStop(task.id)}
                        variant="contained"
                        sx={{
                            ...blueButtonStyle,
                            backgroundColor: '#FFA500',
                            '&:hover': {
                                backgroundColor: '#FF8C00',
                                boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
                            },
                            textTransform: 'none',
                        }}
                    >
                        Stop
                    </Button>
                )}

                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        ...blueButtonStyle,
                        textTransform: 'none',
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TaskInfoModal;