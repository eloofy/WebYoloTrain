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
    Dialog,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import AddIcon from '@mui/icons-material/Add';
import useDatasets from '../../hooks/getDatasets';
import UploadDatasetModal from '../../components/datasets/UploadDatasetModal';
// import DatasetInfoModal from '../components/datasets/MyDatasetPreview';

const DatasetSelectionModal = ({ open, onClose, onSelect }) => {
    const [search, setSearch] = useState('');
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [selectedDataset, setSelectedDataset] = useState(null);

    const { myDatasets, publicDatasets, fetchMyDatasets, fetchPublicDatasets } = useDatasets();

    useEffect(() => {
        if (open) {
            fetchMyDatasets();
            fetchPublicDatasets();
        }
    }, [open, fetchMyDatasets, fetchPublicDatasets]);

    const filteredPublic = publicDatasets.filter(ds =>
        ds.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ backgroundColor: '#141824' , color: 'white' }}>
                Choose Dataset
            </DialogTitle>
            <DialogContent dividers sx={{ backgroundColor: '#1e293b', color: 'white' }}>
                {/* My Datasets Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
                        My Datasets
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 4 }}>
                    {myDatasets.map(dataset => (
                        <Grid item xs={12} md={6} lg={4} key={dataset.id}>
                            <Paper
                                onClick={() => {
                                    onSelect(dataset);
                                    onClose();
                                }}
                                sx={{
                                    p: 2,
                                    bgcolor: '#141824',
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'white' }}>
                                    {dataset.name}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    Created: {new Date(dataset.create_at).toLocaleDateString()}
                                </Typography>
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
            </DialogContent>
        </Dialog>
    );
};

export default DatasetSelectionModal;