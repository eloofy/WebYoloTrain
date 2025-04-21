import React from 'react';
import { Stepper, Step, StepLabel } from '@mui/material';
import { colors } from '../../constants/uploadDatasetColors';

const StepNavigation = ({ activeStep, steps }) => {
    return (
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 3 }}>
            {steps.map((label, index) => (
                <Step key={label}>
                    <StepLabel
                        sx={{
                            '& .MuiStepLabel-label': {
                                color: index === activeStep ? '#FFFFFF !important' : '#94a3b8 !important', // яркий белый для активного, светло-серый для остальных
                                fontWeight: index === activeStep ? 'bold' : 'normal',
                                transition: 'color 0.3s, font-weight 0.3s', // плавный переход цвета и жирности
                            },
                        }}
                    >
                        {label}
                    </StepLabel>
                </Step>
            ))}
        </Stepper>
    );
};

export default StepNavigation;