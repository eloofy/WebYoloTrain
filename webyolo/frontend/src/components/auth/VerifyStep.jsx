import { Box, TextField, Typography, Button, Fade } from '@mui/material';
import { blueButtonStyle, transparentButtonStyle } from '../../styles/authStyles';

const VerifyStep = ({ email, code, setCode, onBack, onVerify }) => (
    <Fade in>
        <Box component="form" onSubmit={onVerify} sx={{ mt: 2 }}>
            <Typography sx={{ mb: 2 }}>
                Enter the verification code sent to <strong>{email}</strong>
            </Typography>
            <TextField
                fullWidth
                label="Verification Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                sx={{ mb: 3 }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button onClick={onBack} size="large" sx={{ ...transparentButtonStyle, width: '48%' }}>
                    Back
                </Button>
                <Button type="submit" size="large" sx={{ ...blueButtonStyle, width: '48%' }}>
                    Verify Code
                </Button>
            </Box>
        </Box>
    </Fade>
);

export default VerifyStep;