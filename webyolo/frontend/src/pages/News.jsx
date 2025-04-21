import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import Sidebar from '../components/layout/Sidebar';

const NewsPage = () => {
    // Заглушка – статический массив новостных элементов
    const [newsItems, setNewsItems] = useState([]);

    useEffect(() => {
        // Имитируем получение данных, можно заменить на вызов API
        setNewsItems([
            {
                id: 1,
                title: 'New model',
                description: 'SOTA model',
            },
            {
                id: 2,
                title: 'New model',
                description: 'SOTA model',
            },
            {
                id: 3,
                title: 'New model',
                description: 'SOTA model',
            },
        ]);
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0f172a', color: 'white' }}>
    {/* Sidebar с выделением активного пункта "news" */}
    <Sidebar active="news" />

        {/* Основная область страницы */}
        <Box sx={{ flex: 1, ml: '72px', px: 6, py: 5 }}>
    <Typography variant="h4" sx={{ mb: 4, color: '#e2e8f0', fontWeight: 'bold' }}>
    News
    </Typography>
    <Grid container spacing={2}>
        {newsItems.map((item) => (
                <Grid item xs={12} key={item.id}>
            <Paper
                sx={{
        p: 2,
            backgroundColor: '#0f172a',
            borderRadius: 1,
            boxShadow: 1,
            border: '1px solid #334155',
    }}
>
    <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
    {item.title}
    </Typography>
    <Typography variant="body2" sx={{ color: '#94a3b8' }}>
    {item.description}
    </Typography>
    </Paper>
    </Grid>
))}
    </Grid>
    </Box>
    </Box>
);
};

export default NewsPage;