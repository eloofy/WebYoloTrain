import RegisterOrLogin from './pages/RegisterLogin';
import AuthLanding from './pages/DatasetPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ErrorProvider } from './context/ErrorContext';

const App = () => (
    <ErrorProvider>
        <RegisterOrLogin />
    </ErrorProvider>
);

export default App;