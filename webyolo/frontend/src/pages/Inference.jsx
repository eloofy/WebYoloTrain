import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Divider,
    Input,
    Button,
    CircularProgress,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Sidebar from '../components/layout/Sidebar';
import { GetTasks } from '../services/taskService';
import { blueButtonStyle } from "../styles/authStyles";
import {
    DownloadInferenceResult,
    InferenceTask,
    GetInferenceHistory,
    DeleteInferenceTask
} from "../services/inferenceService";
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';

const UseModelPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [files, setFiles] = useState([]);
    const [downloadUrl, setDownloadUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [predictionName, setPredictionName] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [history, setHistory] = useState([]);
    const [historyLoading, setHistoryLoading] = useState(false);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await GetTasks();
                if (response.status === 200) {
                    setTasks(response.data.filter(task => task.status === 'success'));
                }
            } catch (error) {
                console.error('Ошибка получения задач:', error);
            }
        };
        fetchTasks();
    }, []);

    const fetchHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await GetInferenceHistory();
            setHistory(res.data);
        } catch (e) {
            console.error('Ошибка загрузки истории инференсов', e);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleInference = async () => {
        if (!selectedTask || files.length === 0) return;
        setLoading(true);
        const formData = new FormData();
        formData.append('experiment_url', selectedTask.experiment_url);
        formData.append('prediction_name', predictionName);
        files.forEach(file => formData.append('images[]', file));

        try {
            const response = await InferenceTask(formData);
            setDownloadUrl(response.data.download_url);
            await fetchHistory();
        } catch (err) {
            console.error('Ошибка при инференсе:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadClick = async () => {
        try {
            setIsDownloading(true);
            const filename = downloadUrl.split('/').pop();
            await DownloadInferenceResult(filename);
        } catch (error) {
            console.error('Ошибка при скачивании:', error);
            alert('Не удалось скачать файл.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await DeleteInferenceTask(id);
            setHistory((prev) => prev.filter((item) => item.id !== id));
        } catch (error) {
            console.error('Ошибка при удалении:', error);
            alert('Не удалось удалить результат');
        }
    };

    const buttonReady = selectedTask && files.length > 0;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#141824', color: 'white', ml: 13 }}>
            <Sidebar active="use-models" />

            <Box sx={{ flex: 1, ml: '72px', px: { xs: 2, md: 6 }, py: 5 }}>
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ flex: 1, pr: 3 }}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, color: '#e2e8f0' }}>
                            Use Trained Models
                        </Typography>

                        <Paper sx={{ backgroundColor: '#1e293b', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.2)', overflow: 'hidden', mb: 4 }}>
                            <Table>
                                <TableHead sx={{ backgroundColor: '#141824' }}>
                                    <TableRow>
                                        <TableCell sx={{ width: '6px', padding: 0 }} />
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title model</TableCell>
                                        <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Experiment</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map(task => {
                                        const isSelected = selectedTask?.id === task.id;

                                        return (
                                            <TableRow
                                                key={task.id}
                                                hover
                                                onClick={() => setSelectedTask(task)}
                                                sx={{
                                                    cursor: 'pointer',
                                                    backgroundColor: isSelected ? '#1e293b' : 'transparent',
                                                    transition: 'background-color 0.3s ease',
                                                    '&:hover': { backgroundColor: '#334155' },
                                                }}
                                            >
                                                <TableCell sx={{ width: '6px', padding: 0, backgroundColor: isSelected ? '#3b82f6' : 'transparent' }} />
                                                <TableCell sx={{ color: isSelected ? '#3b82f6' : 'white', fontWeight: 500, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                                                    {task.name_task}
                                                </TableCell>
                                                <TableCell align="center">
                                                    {task.experiment_url ? (
                                                        <a href={task.experiment_url} target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline', fontWeight: 500 }} onClick={(e) => e.stopPropagation()}>
                                                            Link
                                                        </a>
                                                    ) : (
                                                        <span style={{ color: 'gray' }}>—</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Paper>

                        <Divider sx={{ my: 4, borderColor: '#334155' }} />

                        <Paper sx={{ backgroundColor: '#1e293b', borderRadius: 2, px: 3, py: 3, mb: 4 }}>
                            <Typography color="white" variant="h6" fontWeight="bold" mb={2}>Upload Images</Typography>

                            <Typography color="white" variant="subtitle1" fontWeight={500} mt={2}>
                                Prediction Name
                            </Typography>
                            <Input
                                value={predictionName}
                                onChange={(e) => setPredictionName(e.target.value)}
                                placeholder="Enter prediction name"
                                fullWidth
                                disableUnderline
                                sx={{
                                    mt: 1,
                                    px: 1.5,
                                    py: 1,
                                    borderRadius: 1,
                                    backgroundColor: '#0f172a',
                                    color: 'white',
                                    fontSize: '0.95rem',
                                    border: '1px solid #334155',
                                    '&:focus-within': {
                                        borderColor: '#3b82f6',
                                    },
                                }}
                            />

                            <label htmlFor="image-upload">
                                <Input
                                    type="file"
                                    id="image-upload"
                                    inputProps={{ multiple: true }}
                                    onChange={handleFileChange}
                                    sx={{ display: 'none' }}
                                />
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadFileIcon />}
                                    sx={files.length > 0 ? {
                                        backgroundColor: 'transparent',
                                        border: '1px solid #0041e8',
                                        color: 'white',
                                        mt: 2
                                    } : {
                                        ...blueButtonStyle,
                                        border: "none",
                                        mt: 2
                                    }}
                                >
                                    {files.length > 0 ? 'Change files' : 'Select Files'}
                                </Button>
                            </label>

                            {files.length > 0 && (
                                <Typography variant="body2" sx={{ mt: 1, color: '#94a3b8' }}>
                                    {files.length} file(s) selected
                                </Typography>
                            )}
                        </Paper>

                        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            {buttonReady ? (
                                <Button variant="outlined" onClick={handleInference} sx={{ ...blueButtonStyle, border: "none" }}>
                                    {loading ? <CircularProgress size={22} /> : 'Run Inference'}
                                </Button>
                            ) : (
                                <Button variant="outlined" sx={{ backgroundColor: 'transparent', border: '1px solid #0041e8', color: 'white', cursor: 'not-allowed' }}>
                                    Run Inference
                                </Button>
                            )}
                        </Box>
                    </Box>

                    {/* Правая часть — история */}
                    {history.length > 0 && (
                        <Paper
                            sx={{
                                width: 400,
                                backgroundColor: '#1e293b',
                                borderRadius: 2,
                                px: 3,
                                py: 2,
                                overflowY: 'auto',
                                maxHeight: 'calc(100vh - 100px)',
                                position: 'sticky',
                                top: 80,
                            }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                                <Typography variant="h6" fontWeight="bold" color="white">
                                    Inference History
                                </Typography>
                                <Button
                                    onClick={fetchHistory}
                                    disabled={historyLoading}
                                    sx={{ minWidth: 'auto', padding: '6px', border: 'none', color: '#3b82f6', backgroundColor: 'transparent', '&:hover': { backgroundColor: 'rgba(59, 130, 246, 0.1)' } }}
                                >
                                    <RefreshIcon fontSize="small" />
                                </Button>
                            </Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: '#94a3b8' }}>Prediction name</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Model Name</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Date</TableCell>
                                        <TableCell sx={{ color: '#94a3b8' }}>Predicts</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                                                {item.prediction_name || '—'}
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                                                {item.model_name || '—'}
                                            </TableCell>
                                            <TableCell sx={{ color: '#e2e8f0', fontSize: '0.8rem' }}>
                                                {new Date(item.created_at).toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    {item.zip_filename ? (
                                                        <Button size="small" variant="outlined" onClick={() => DownloadInferenceResult(item.zip_filename)} sx={{ borderColor: '#3b82f6', color: '#3b82f6', fontSize: '0.7rem', mr: 1 }}>
                                                            ZIP
                                                        </Button>
                                                    ) : (
                                                        <Typography variant="body2" color="gray">—</Typography>
                                                    )}
                                                    <Button size="small" onClick={() => handleDelete(item.id)} sx={{ minWidth: 'auto', padding: '4px', color: '#ef4444', '&:hover': { backgroundColor: 'rgba(239, 68, 68, 0.1)' } }}>
                                                        <DeleteIcon fontSize="small" />
                                                    </Button>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default UseModelPage;