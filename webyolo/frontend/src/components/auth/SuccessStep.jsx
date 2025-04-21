import { Box, Typography, Alert, Button, Fade } from '@mui/material';
import { blueButtonStyle } from '../../styles/authStyles';

const SuccessStep = ({ nickname , emailExists}) => (
    <Fade in>
        <Box justifyContent="center" dispaly="flex" sx={{ mt: 2 }}>
            <Alert
                severity="success"
                sx={{
                    mb: 2,
                    fontSize: '1rem',
                }}
            >
                {emailExists ? 'Sign In Complete' : 'Sign Up complete'}
            </Alert>
            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                Welcome <strong>{nickname}</strong>. You're ready to use WebCV.
            </Typography>
            <Button
                fullWidth
                variant="contained"
                size="large"
                sx={blueButtonStyle}
                onClick={() => (window.location.href = '/tasks')}
            >
                Go to Dashboard
            </Button>
        </Box>
    </Fade>
);

export default SuccessStep;