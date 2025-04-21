import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { blueButtonStyle, transparentButtonStyle } from '../../styles/authStyles';

const LoginStep = ({ email, password, setPassword, onSubmit, onBack }) => {
    const [showPasswordError, setShowPasswordError] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(password)
        if (!password) {
            setShowPasswordError(false);
            return;
        }
        setShowPasswordError(false);
        onSubmit(e);
    };

    return (
        <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                sx={{ mb: 3 }}
            />

            <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                error={showPasswordError && !password}
                sx={{ mb: 3 }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onBack} size="large" sx={{ ...transparentButtonStyle, width: '48%' }}>
                    Back
                </Button>
                <Button type="submit" size="large" sx={{ ...blueButtonStyle, width: '48%' }}>
                    Continue
                </Button>
            </Box>
        </form>
    );
};

export default LoginStep;