import React, { useEffect, useState } from 'react';
import {
    Container, Box, Typography, Alert,
} from '@mui/material';
import AnimatedAirplanes from '../components/auth/AnimatedAirplane';
import {EmailStep, AuthForm, VerifyStep, SuccessStep, LandingStep, LoginStep} from '../components/auth';
import useRegisterLogin from '../hooks/useRegisterLogin';
import { AuthSteps } from '../constants/authSteps';
import { useError } from '../context/ErrorContext';

const RegisterOrLogin = () => {
    const [showLanding, setShowLanding] = useState(false);

    const {
        step, setStep,
        email, setEmail,
        code, setCode,
        password, setPassword,
        nickname, setNickname,
        emailExists, setEmailExists,
        handleLogin,
        handleRegister,
        verifyEmailCode,
        handleCheckEmail
    } = useRegisterLogin();

    const { error, setError } = useError();

    useEffect(() => {
        setError('');
    }, [step]);

    const handleEmailStart = () => {
        setShowLanding(false);
        setStep(AuthSteps.EMAIL);
    };

    return (
        <Container
            maxWidth={false}
            disableGutters
            sx={{
                position: 'relative',
                minHeight: '100vh',
                width: '100vw',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: 'radial-gradient(circle, #1e3c72, #2a5298)',
            }}
        >
            <AnimatedAirplanes />

            {(
                <Box
                    sx={{
                        position: 'relative',
                        bgcolor: 'white',
                        width: '22%',
                        borderRadius: 4,
                        p: 4,
                        textAlign: 'center',
                        boxShadow: 6,
                        backdropFilter: 'blur(12px)',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#0041e8' }}>
                        WebCV
                    </Typography>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.secondary', mb: 3 }}>
                        {emailExists !== null ? (emailExists ? 'Sign In' : 'Sign Up') : 'Sign In or Sign Up'}
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                    {step === AuthSteps.LANDING && (
                        <LandingStep
                            handleEmailStart={() => handleEmailStart()}
                        />
                    )}

                    {step === AuthSteps.EMAIL && (
                        <EmailStep
                            email={email}
                            setEmail={setEmail}
                            onSubmit={(e) => handleCheckEmail(e, setStep)}
                            onBack={() =>
                            {
                                setStep(AuthSteps.LANDING);
                                setEmailExists(null);
                                setEmail("");
                            }}
                        />
                    )}

                    {step === AuthSteps.LOGIN && (
                        <LoginStep
                            email={email}
                            password={password}
                            setPassword={setPassword}
                            onSubmit={() => handleLogin()}
                            onBack={() =>
                            {
                                setStep(AuthSteps.EMAIL);
                                setEmailExists(null);
                            }}
                        />
                    )}

                    {step === AuthSteps.FORM && (
                        <AuthForm
                            email={email}
                            password={password}
                            nickname={nickname}
                            setPassword={setPassword}
                            setNickname={setNickname}
                            emailExists={emailExists}
                            onSubmit={emailExists
                                ? (e) => handleLogin(e, setStep)
                                : (e) => handleRegister(e, setStep)}
                            onBack={() =>
                            {
                                setStep(AuthSteps.EMAIL);
                                setEmailExists(null);
                                setEmail("");
                                setPassword("")
                                setNickname("")
                            }}
                        />
                    )}

                    {step === AuthSteps.VERIFY_CODE && (
                        <VerifyStep
                            email={email}
                            code={code}
                            setCode={setCode}
                            onBack={() => setStep(emailExists ? AuthSteps.EMAIL : AuthSteps.FORM)}
                            onVerify={(e) => {
                                e.preventDefault();
                                verifyEmailCode(setStep);
                            }}
                        />
                    )}

                    {step === AuthSteps.SUCCESS && <SuccessStep nickname={nickname} emailExists={emailExists} />}
                </Box>
            )}
        </Container>
    );
};

export default RegisterOrLogin;