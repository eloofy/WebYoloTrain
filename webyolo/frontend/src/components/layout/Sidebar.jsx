import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Box, Typography, IconButton, Divider } from '@mui/material';
import {
    AddCircleOutline,
    ListAlt,
    AccountTree,
    PrecisionManufacturing,
    HelpOutline,
    Notifications,
    AccountCircle
} from '@mui/icons-material';

import Emblem from '../../assets/Inverse.svg';

const EmblemHeader = () => (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Box sx={{ width: 80, height: 80, margin: '0 auto', overflow: 'hidden', mb: 1 }}>
            <img src={Emblem} alt="Emblem" style={{ width: '100%', height: '100%' }} />
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
            WebCV
        </Typography>
    </Box>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const activeKey = location.pathname.split('/')[1]; // tasks, datasets, createtasks и т.п.

    const navItems = [
        { title: 'Create Task', icon: <AddCircleOutline />, key: 'createtasks' },
        { title: 'Tasks', icon: <ListAlt />, key: 'tasks' },
        { title: 'Datasets', icon: <AccountTree />, key: 'datasets' },
        { title: 'Use Models', icon: <PrecisionManufacturing />, key: 'use-models' },
    ];

    const bottomItems = [
        { title: 'Help', icon: <HelpOutline />, key: 'help' },
        { title: 'Notifications', icon: <Notifications />, key: 'notifications' },
        { title: 'My Profile', icon: <AccountCircle />, key: 'me' }, // ← здесь
    ];

    const renderItem = ({ title, icon, key }) => {
        const isActive = activeKey === key;
        return (
            <Box
                key={key}
                onClick={() => navigate(`/${key}`)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    py: 1,
                    px: 2,
                    borderRadius: 2,
                    backgroundColor: isActive ? '#3F2A75' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                        backgroundColor: isActive
                            ? '#3F2A75'
                            : 'rgba(255,255,255,0.05)',
                    },
                    mb: 1,
                }}
            >
                <IconButton size="small" sx={{ color: isActive ? 'white' : '#9ca3af' }}>
                    {icon}
                </IconButton>
                <Typography
                    variant="body2"
                    sx={{
                        color: isActive ? 'white' : '#9ca3af',
                        fontWeight: isActive ? 'bold' : 'normal',
                    }}
                >
                    {title}
                </Typography>
            </Box>
        );
    };

    return (
        <Box
            sx={{
                width: 155,
                height: '96vh',
                background: 'linear-gradient(to bottom, #1d2160, #141824)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                py: 3,
                px: 2,
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: 1000,
            }}
        >
            <EmblemHeader />
            <Box sx={{ flexGrow: 1, mt: 1 }}>
                {navItems.map(renderItem)}
            </Box>
            <Divider sx={{ my: 1, borderColor: 'rgba(255,255,255,0.1)' }} />
            <Box sx={{ mt: 'auto' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {bottomItems.map(renderItem)}
                </Box>
            </Box>
        </Box>
    );
};

export default Sidebar;