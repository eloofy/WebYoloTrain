import {TextField, Button, Box} from '@mui/material';
import {blueButtonStyle, transparentButtonStyle} from '../../styles/authStyles';

const EmailStep = ({ email, setEmail, onSubmit, onBack}) => (
    <form onSubmit={onSubmit}>
        <TextField
            fullWidth
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
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

export default EmailStep;