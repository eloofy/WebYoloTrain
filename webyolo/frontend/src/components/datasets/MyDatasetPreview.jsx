import React, { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent,
    IconButton, Typography, Box, CircularProgress,
    Divider, TextField, Button, Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PublicIcon from '@mui/icons-material/Public';
import ImagePreviewWithBoxes from '../../components/datasets/ImagePreviewWithBoxes';

const DatasetInfoModal = ({ open, onClose, dataset }) => {
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [counts, setCounts] = useState({ train: 0, valid: 0, test: 0 });
    const [name, setName] = useState(dataset?.name || '');
    const [description, setDescription] = useState(dataset?.description || '');
    const [isPublic, setIsPublic] = useState(dataset?.is_public || false);
    const [publishing, setPublishing] = useState(false);

    useEffect(() => {
        if (open && dataset?.id) {
            setLoading(true);
            setName(dataset.name);
            setDescription(dataset.description);
            setIsPublic(dataset.is_public);

            fetch(`https://127.0.0.1:8000/api/datasets/${dataset.id}/images/`)
                .then(res => res.json())
                .then(async (data) => {
                    if (data.items) {
                        const loaded = await Promise.all(
                            data.items.map(async (item) => {
                                const [imgRes, labelRes] = await Promise.all([
                                    fetch(item.image_url),
                                    fetch(item.label_url),
                                ]);
                                const imgBlob = await imgRes.blob();
                                const labelBlob = await labelRes.blob();

                                return {
                                    img: new File([imgBlob], 'image.jpg', { type: imgBlob.type }),
                                    label: new File([labelBlob], 'label.txt', { type: labelBlob.type }),
                                    previewUrl: URL.createObjectURL(imgBlob),
                                };
                            })
                        );
                        setImages(loaded);
                        setIndex(0);
                    }

                    if (data.counts) {
                        setCounts(data.counts);
                    }

                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error loading preview images:', err);
                    setLoading(false);
                });
        }
    }, [open, dataset]);

    const handleAutoSave = async () => {
        if (dataset && (name !== dataset.name || description !== dataset.description)) {
            try {
                await fetch(`https://127.0.0.1:8000/api/datasets/${dataset.id}/images/`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, description }),
                });
            } catch (err) {
                console.error('Auto-save error:', err);
            }
        }
    };

    const handleClose = async () => {
        await handleAutoSave();
        onClose();
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${dataset.name}"?`);
        if (!confirmDelete) return;

        try {
            const res = await fetch(`https://127.0.0.1:8000/api/datasets/${dataset.id}/images/`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Dataset deleted successfully.');
                onClose();
            } else {
                alert('Failed to delete dataset.');
            }
        } catch (err) {
            console.error('Error deleting dataset:', err);
            alert('An error occurred while deleting the dataset.');
        }
    };

    const makePublic = async () => {
        setPublishing(true);
        try {
            const res = await fetch(`https://127.0.0.1:8000/api/datasets/${dataset.id}/images/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_public: true }),
            });

            if (res.ok) {
                setIsPublic(true);
            } else {
                alert('Failed to make dataset public.');
            }
        } catch (err) {
            console.error('Make public error:', err);
        } finally {
            setPublishing(false);
        }
    };

    if (!dataset) return null;

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#0f172a',
                    color: 'white',
                    borderRadius: 4,
                    p: 3,
                },
            }}
        >
            <DialogTitle sx={{ p: 0, mb: 2, position: 'relative' }}>
                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 0.5 }}>
                    Dataset name
                </Typography>
                <TextField
                    fullWidth
                    variant="standard"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    inputProps={{ style: { fontWeight: 700, color: '#60a5fa', fontSize: '1.5rem' } }}
                    sx={{
                        '& .MuiInput-underline:before': { borderBottomColor: '#334155' },
                        '& .MuiInput-underline:hover:before': { borderBottomColor: '#60a5fa' },
                        '& .MuiInput-underline:after': { borderBottomColor: '#60a5fa' },
                    }}
                />
                <IconButton
                    onClick={handleClose}
                    sx={{ position: 'absolute', right: 0, top: 0, color: '#64748b' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1 }}>
                        Created: {dataset.create_at ? new Date(dataset.create_at).toLocaleString() : 'Unknown'}
                    </Typography>

                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 3, mb: 0.5 }}>
                        Description
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        minRows={2}
                        variant="standard"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="No description provided."
                        InputProps={{ style: { color: 'white' } }}
                        sx={{
                            '& .MuiInput-underline:before': { borderBottomColor: '#334155' },
                            '& .MuiInput-underline:hover:before': { borderBottomColor: '#60a5fa' },
                            '& .MuiInput-underline:after': { borderBottomColor: '#60a5fa' },
                        }}
                    />

                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            gap: 2,
                            mt: 3,
                            mb: 3,
                        }}
                    >
                        {[{
                            label: 'Train samples', value: counts.train, icon: '🏋️', color: '#38bdf8'
                        }, {
                            label: 'Validation set', value: counts.valid, icon: '🧪', color: '#a78bfa'
                        }, {
                            label: 'Test set', value: counts.test, icon: '🚀', color: '#f472b6'
                        }].map((item, i) => (
                            <Box key={i} sx={{
                                flex: 1,
                                borderRadius: 2,
                                p: 2,
                                backgroundColor: '#1e293b',
                                border: '1px solid #334155',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                            }}>
                                <Box sx={{ fontSize: 20, color: item.color }}>{item.icon}</Box>
                                <Box>
                                    <Typography variant="body2" sx={{ color: '#94a3b8' }}>{item.label}</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>{item.value}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Divider sx={{ backgroundColor: '#334155', my: 2 }} />
                </Box>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 6 }}>
                        <CircularProgress color="info" />
                    </Box>
                ) : images.length > 0 ? (
                    <>
                        <ImagePreviewWithBoxes imageData={images[index]} />

                        <Typography variant="body2" sx={{ color: '#94a3b8', mt: 2, mb: 1 }}>
                            Click image to preview:
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 3 }}>
                            {images.map((img, i) => (
                                <Box
                                    key={i}
                                    component="img"
                                    src={img.previewUrl}
                                    onClick={() => setIndex(i)}
                                    sx={{
                                        width: 96,
                                        height: 64,
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        flexShrink: 0,
                                        cursor: 'pointer',
                                        border: i === index ? '2px solid #60a5fa' : '1px solid #334155',
                                        transition: 'transform 0.2s, border 0.2s',
                                        '&:hover': { transform: 'scale(1.06)' },
                                    }}
                                />
                            ))}
                        </Box>
                    </>
                ) : (
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                        No preview images available.
                    </Typography>
                )}

                {/* Public & Delete Buttons */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    {/* Make Public button (если ещё не публичный) */}
                    {!dataset.is_public && (
                        <Box
                            component="button"
                            onClick={async () => {
                                try {
                                    const res = await fetch(`https://127.0.0.1:8000/api/datasets/${dataset.id}/images/`, {
                                        method: 'PATCH',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ is_public: true }),
                                    });
                                    const data = await res.json();
                                    if (res.ok) {
                                        alert(data.message);
                                    } else {
                                        alert('Failed to update dataset visibility.');
                                    }
                                } catch (err) {
                                    console.error('Error making dataset public:', err);
                                    alert('An error occurred.');
                                }
                            }}
                            style={{
                                backgroundColor: '#3b82f6', // синий
                                color: 'white',
                                padding: '6px 12px',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
                            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3b82f6')}
                        >
                            🌐 Make Public
                        </Box>
                    )}

                    {/* Delete button */}
                    <Box
                        component="button"
                        onClick={handleDelete}
                        style={{
                            backgroundColor: '#ef4444',
                            color: 'white',
                            padding: '6px 12px',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: '500',
                            cursor: 'pointer',
                            transition: 'background 0.3s',
                        }}
                        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
                        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#ef4444')}
                    >
                        🗑️ Delete Dataset
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default DatasetInfoModal;
