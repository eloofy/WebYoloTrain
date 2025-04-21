// ConfigModal.js
import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Tabs,
    Tab,
    Box,
    Grid,
    TextField,
    Typography
} from '@mui/material';
import {blueButtonStyle} from "../../styles/authStyles";

const ConfigModal = ({ open, onClose, onSave, initialTraining, initialAugment }) => {
    const [tabValue, setTabValue] = useState(0);
    const [trainingParams, setTrainingParams] = useState(initialTraining);
    const [augmentParams, setAugmentParams] = useState(initialAugment);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleChange = (group, field, value) => {
        if (group === 'training') {
            setTrainingParams({ ...trainingParams, [field]: value });
        } else {
            setAugmentParams({ ...augmentParams, [field]: value });
        }
    };

    const renderFields = (params, group) => (
        <Grid container spacing={2}>
            {Object.keys(params).map((key) => (
                <Grid item xs={12} sm={6} key={key}>
                    <TextField
                        label={key}
                        value={params[key]}
                        onChange={(e) => handleChange(group, key, e.target.value)}
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ style: { color: '#94a3b8' } }}
                        inputProps={{ style: { color: 'white' } }}
                        sx={{
                            backgroundColor: '#0f172a',
                            borderRadius: 1,
                            color: 'white',
                        }}
                    />
                </Grid>
            ))}
        </Grid>
    );

    const handleSaveConfig = () => {
        onSave({ trainingParams, augmentParams });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ color: 'white', backgroundColor: '#141824' }}>
                Configure Parameters
            </DialogTitle>
            <DialogContent dividers sx={{ backgroundColor: '#1e293b' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                    <Tab label="Training" sx={{ color: '#7a85a6', fontWeight: 'bold' }}/>
                    <Tab label="Augmentation" sx={{ color: '#7a85a6', fontWeight: 'bold' }}/>
                </Tabs>
                <Box sx={{ mt: 2 }}>
                    {tabValue === 0 && (
                        <Box>
                            {renderFields(trainingParams, 'training')}
                        </Box>
                    )}
                    {tabValue === 1 && (
                        <Box>
                            {renderFields(augmentParams, 'augment')}
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, justifyContent: 'center', backgroundColor: '#1e293b' }}>
                <Button onClick={handleSaveConfig} variant="contained" sx={{ ...blueButtonStyle, }}>
                    Save Configuration
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfigModal;