import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access='))
        ?.split('=')[1];

    return token ? children : <Navigate to="/register" replace />;
};

export default ProtectedRoute;