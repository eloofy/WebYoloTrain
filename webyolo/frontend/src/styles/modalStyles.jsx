import { colors } from '../constants/uploadDatasetColors';

// Общий стиль для модального окна
export const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: colors.background,
    color: colors.textPrimary,
    boxShadow: 24,
    p: 4,
    width: 560,
    maxHeight: '80vh',
    overflowY: 'auto',
    borderRadius: 2,
};