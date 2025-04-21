import { useState } from 'react';
import { Box, TextField, Button, Collapse, Typography } from '@mui/material';
import { blueButtonStyle, transparentButtonStyle } from '../../styles/authStyles';

const passwordChecks = [
    { label: 'at least 8 characters', test: (pwd) => pwd.length >= 8 },
    { label: 'contains a digit', test: (pwd) => /[0-9]/.test(pwd) },
    { label: 'contains a special character', test: (pwd) => /[^A-Za-z0-9]/.test(pwd) },
    { label: 'contains an uppercase letter', test: (pwd) => /[A-Z]/.test(pwd) },
];

const AuthForm = ({
                      email,
                      password,
                      nickname,
                      setPassword,
                      setNickname,
                      emailExists,
                      onSubmit,
                      onBack,
                  }) => {
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState(false);
    const passwordsMatch = password === confirmPassword;
    const showMismatch = confirmPassword.length > 0 && !passwordsMatch;

    const handleSubmit = (e) => {
        e.preventDefault();

        const allChecksPassed = passwordChecks.every(({ test }) => test(password));

        if (!emailExists) {
            if (password !== confirmPassword || !allChecksPassed) {
                setPasswordError(true);
                return;
            }
        }

        setPasswordError(false);
        onSubmit(e);
    };

    return (
        <Collapse in timeout={400} unmountOnExit>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField fullWidth label="Email" value={email} disabled sx={{ mb: 2 }} />

                {!emailExists && (
                    <TextField
                        fullWidth
                        label="Nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        required
                        sx={{ mb: 2 }}
                    />
                )}

                <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    error={passwordError}
                    sx={{ mb: 1 }}
                />

                {!emailExists && (
                    <Box sx={{ mb: 2, pl: 1 }}>
                        {passwordChecks.map(({ label, test }) => {
                            const passed = test(password);
                            return (
                                <Box
                                    key={label}
                                    sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                                >
                                    <Box
                                        sx={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: passed ? 'success.main' : 'error.main',
                                            mr: 1.5,
                                            transition: 'background-color 0.3s',
                                        }}
                                    />
                                    <Typography
                                        sx={{
                                            fontSize: '0.875rem',
                                            color: passed ? 'text.primary' : 'text.secondary',
                                        }}
                                    >
                                        {label}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {!emailExists && (
                    <TextField
                        fullWidth
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        error={showMismatch}
                        sx={{ mb: 1 }}
                    />

                )}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button onClick={onBack} size="large" sx={{ ...transparentButtonStyle, width: '48%' }}>
                        Back
                    </Button>
                    <Button type="submit" size="large" sx={{ ...blueButtonStyle, width: '48%' }}>
                        {emailExists ? 'Sign In' : 'Sign Up'}
                    </Button>
                </Box>
            </Box>
        </Collapse>
    );
};

export default AuthForm;