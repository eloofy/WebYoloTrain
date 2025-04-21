// TasksPage.js
import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Paper,
    IconButton,
    Tooltip,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import Sidebar from '../components/layout/Sidebar';
import { GetTasks, StopTask, DeleteTask} from '../services/taskService';
import TaskInfoModal from '../components/showtasks/TaskInfoModal';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [search, setSearch] = useState('');

    const fetchTasks = async () => {
        try {
            const response = await GetTasks();
            if (response.status === 200) {
                setTasks(response.data);
            } else {
                console.error("Failed to fetch tasks");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const filteredTasks = tasks.filter(task =>
        task.name_task.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                backgroundColor: '#141824',
                color: 'white',
                ml: 13,
            }}
        >
            <Sidebar active="tasks" />

            <Box
                sx={{
                    flex: 1,
                    ml: '72px',
                    px: { xs: 2, md: 6 },
                    py: 5,
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        mb: 4,
                        textAlign: 'left',
                        color: '#e2e8f0',
                    }}
                >
                    Tasks
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 3,
                    }}
                >
                    <TextField
                        placeholder="Search tasks..."
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            sx: {
                                backgroundColor: '#1e293b',
                                borderRadius: 2,
                                color: 'white',
                            },
                        }}
                    />
                    <Tooltip title="Refresh tasks">
                        <IconButton onClick={fetchTasks} sx={{ color: '#60a5fa', ml: 2 }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <Paper
                    sx={{
                        backgroundColor: '#1e293b',
                        borderRadius: 2,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                        overflow: 'hidden',
                    }}
                >
                    <Table>
                        <TableHead sx={{ backgroundColor: '#141824' }}>
                            <TableRow>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Title</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="right">Created</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Experiment</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredTasks.length > 0 ? (
                                filteredTasks.map((task) => (
                                    <TableRow
                                        key={task.id}
                                        hover
                                        onClick={() => setSelectedTask(task)}
                                        sx={{
                                            cursor: 'pointer',
                                            transition: 'background-color 0.25s ease',
                                            '&:hover': { backgroundColor: '#334155' },
                                        }}
                                    >
                                        <TableCell sx={{ color: 'white' }}>{task.name_task}</TableCell>
                                        <TableCell sx={{ textAlign: 'center' }}>
                                            <Box
                                                sx={{
                                                    display: 'inline-block',
                                                    px: 2,
                                                    py: 0.5,
                                                    borderRadius: 2,
                                                    fontWeight: 'bold',
                                                    backgroundColor:
                                                        task.status === 'success' ? '#16a34a' :
                                                            task.status === 'running' ? '#3b82f6' :
                                                                task.status === 'pending' ? '#f59e0b' :
                                                                    task.status === 'failed' ? '#ef4444' :
                                                                        '#64748b',
                                                    color: 'white',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {task.status || 'unknown'}
                                            </Box>
                                        </TableCell>
                                        <TableCell sx={{ color: 'gray' }} align="right">
                                            {new Date(task.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="center">
                                            {task.experiment_url ? (
                                                <a
                                                    href={task.experiment_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#3b82f6', textDecoration: 'underline' }}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Link
                                                </a>
                                            ) : (
                                                <span style={{ color: 'gray' }}>—</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        sx={{ color: 'gray', textAlign: 'center', py: 2 }}
                                    >
                                        No tasks found for "{search}"
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>

                <Divider sx={{ my: 4, borderColor: '#334155' }} />
            </Box>

            <TaskInfoModal
                open={Boolean(selectedTask)}
                onClose={() => setSelectedTask(null)}
                onDelete={async (taskId) => {
                    try {
                        await DeleteTask(taskId);
                        setSelectedTask(null);
                        await fetchTasks();
                    } catch (error) {
                        console.error('Ошибка при удалении задачи:', error);
                    }
                }}
                onStop={(taskId) => {
                    StopTask(taskId);
                    setSelectedTask(null);
                    fetchTasks();
                }}
                task={selectedTask}
            />
        </Box>
    );
};

export default TasksPage;