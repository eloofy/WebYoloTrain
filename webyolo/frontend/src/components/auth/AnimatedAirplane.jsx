// components/AnimatedAirplanes.jsx
import { Box, keyframes } from '@mui/system';
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';

const flyAnimation = keyframes`
  0% { transform: translate(0, 0) rotate(50deg); opacity: 0.7; }
  100% { transform: translate(100vw, -100vh) rotate(50deg); opacity: 0; }
`;

const planes = [
    { size: '40px', left: '10%', delay: 0, duration: 8 },
    { size: '50px', left: '30%', delay: 2, duration: 10 },
    { size: '30px', left: '70%', delay: 4, duration: 7 },
    { size: '60px', left: '50%', delay: 1, duration: 9 },
    { size: '45px', left: '80%', delay: 3, duration: 8 }
];

const AnimatedAirplanes = () => (
    <Box
        sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 0,
            overflow: 'hidden'
        }}
    >
        {planes.map(({ size, left, delay, duration }, i) => (
            <Box
                key={i}
                sx={{
                    position: 'absolute',
                    bottom: '-80px',
                    left,
                    fontSize: size,
                    color: 'rgba(255, 255, 255, 0.9)',
                    animation: `${flyAnimation} ${duration}s linear infinite`,
                    animationDelay: `${delay}s`
                }}
            >
                <AirplanemodeActiveIcon fontSize="inherit" />
            </Box>
        ))}
    </Box>
);

export default AnimatedAirplanes;