import {Button, Box, Typography, Link} from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const LandingStep = ({ handleEmailStart }) => (
        <Box sx={{ mb: 1 }}>
        <Button
            fullWidth
            variant="contained"
            startIcon={<GitHubIcon />}
            sx={{
                backgroundColor: '#333',
                color: '#fff',
                mb: 2,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#000' },
            }}
        >
            Continue with Github
        </Button>

        <Button
            fullWidth
            variant="contained"
            startIcon={<EmailIcon />}
            onClick={handleEmailStart}
            sx={{
                backgroundColor: '#6c2bd9',
                color: '#fff',
                mb: 2,
                textTransform: 'none',
                '&:hover': { backgroundColor: '#5a20c6' },
            }}
        >
            Continue with Email
        </Button>

        <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            By continuing, you accept our{' '}
            <Link href="#" underline="hover">Terms of Service</Link> and{' '}
            <Link href="#" underline="hover">Privacy Policy</Link>.
        </Typography>
    </Box>
)

export default LandingStep;