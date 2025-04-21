export const buttonStyle = {
    borderRadius: '10px',
    fontWeight: 600,
    textTransform: 'uppercase',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
};

export const blueButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#2660f1',
    color: '#fff',
    '&:hover': {
        backgroundColor: '#0041e8',
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.12)',
    },
};

export const transparentButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'transparent',
    color: '#0041e8',
    boxShadow: 'none',
    '&:hover': {
        backgroundColor: '#0041e8',
        color: '#fff',
        boxShadow: 'none',
    },
};