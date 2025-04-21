import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Grid,
    Paper,
    Divider,
    IconButton,
    Tooltip,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import Sidebar from '../components/layout/Sidebar';
import useDatasets from '../hooks/getDatasets';
import UploadDatasetModal from '../components/datasets/UploadDatasetModal';
import DatasetInfoModal from '../components/datasets/MyDatasetPreview';

const DatasetsPage = () => {
    const [search, setSearch] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);

    const {
        myDatasets,
        publicDatasets,
        fetchMyDatasets,
        fetchPublicDatasets
    } = useDatasets();

    useEffect(() => {
        fetchMyDatasets();
        fetchPublicDatasets();
    }, []);

    const filteredPublic = publicDatasets.filter(ds =>
        ds.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ display: 'flex', backgroundColor: '#141824', color: 'white', minHeight: '100vh', ml: 13 }}>
            <Sidebar active={'datasets'}/>

            <Box sx={{ flex: 1, ml: '72px', px: 6, py: 5 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
                    Datasets
                </Typography>

                {/* My Datasets Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
                        My Datasets
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Add new dataset">
                            <IconButton sx={{ color: '#60a5fa' }} onClick={() => setOpenModal(true)}>
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Refresh my datasets">
                            <IconButton onClick={fetchMyDatasets} sx={{ color: '#60a5fa' }}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>

                <Grid container spacing={2} sx={{ mb: 5 }}>
                    {myDatasets.map(dataset => (
                        <Grid item xs={12} md={6} lg={4} key={dataset.id}>
                            <Paper
                                onClick={() => setSelectedDataset(dataset)}
                                sx={{
                                    p: 2,
                                    bgcolor: '#1e293b',
                                    cursor: 'pointer',
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
                                    {dataset.name}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Created: {new Date(dataset.create_at).toLocaleDateString()}
                                </Typography>
                                {/* Add Public Label */}
                                {dataset.is_public && (
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
                        </Grid>
                    ))}
                </Grid>

                <Divider sx={{ my: 4, backgroundColor: '#334155' }} />

                {/* Public Datasets */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
                        Public Datasets
                    </Typography>
                    <Tooltip title="Refresh public datasets">
                        <IconButton onClick={fetchPublicDatasets} sx={{ color: '#60a5fa' }}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                <TextField
                    placeholder="Search public datasets..."
                    variant="outlined"
                    fullWidth
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    InputProps={{
                        sx: {
                            backgroundColor: '#1e293b',
                            borderRadius: 2,
                            color: 'white',
                            mb: 3,
                        },
                    }}
                />

                <Grid container spacing={2}>
                    {filteredPublic.map(ds => (
                        <Grid item xs={12} md={6} lg={4} key={ds.id}>
                            <Paper
                                onClick={() => setSelectedDataset(ds)} // здесь было setSelectedDataset(dataset)
                                sx={{
                                    p: 2,
                                    bgcolor: '#1e293b',
                                    cursor: 'pointer',
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
                                    {ds.name}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Created: {new Date(ds.create_at).toLocaleDateString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                    {filteredPublic.length === 0 && (
                        <Typography variant="body2" sx={{ color: 'gray', mt: 2 }}>
                            No results found for "{search}"
                        </Typography>
                    )}
                </Grid>
                <DatasetInfoModal
                    open={Boolean(selectedDataset)}
                    onClose={ () => {
                        setSelectedDataset(null);
                        fetchMyDatasets();
                        fetchPublicDatasets();
                    }}
                    dataset={selectedDataset}
                />
            </Box>

            <UploadDatasetModal
                open={openModal}
                onClose={() => {
                    setOpenModal(false);
                }}
                fetchMyDatasets={fetchMyDatasets}
            />
        </Box>
    );
};

export default DatasetsPage;