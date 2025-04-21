import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import RegisterOrLogin from "./pages/RegisterLogin";
import DatasetsPage from './pages/DatasetPage';
import ProfilePage from './pages/MyProfile';
import CreateTaskPage from './pages/CreateTask';
import TasksPage from './pages/MyTasks';
import NewsPage from './pages/News';
import ProtectedRoutes from './components/auth/ProtectedRoute';
import UseModelPage from './pages/Inference';
import { ErrorProvider } from './context/ErrorContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ErrorProvider>
        <Router>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/register" element={<RegisterOrLogin />} />
                <Route path="/datasets" element={
                    <ProtectedRoutes>
                        <DatasetsPage />
                    </ProtectedRoutes>
                } />
                <Route path="/createtasks" element={
                    <ProtectedRoutes>
                        <CreateTaskPage />
                    </ProtectedRoutes>
                } />
                <Route path="/use-models" element={
                    <ProtectedRoutes>
                        <UseModelPage />
                    </ProtectedRoutes>
                } />
                <Route path="/me" element={
                    <ProtectedRoutes>
                        <ProfilePage />
                    </ProtectedRoutes>
                } />
                <Route path="/tasks" element={
                    <ProtectedRoutes>
                        <TasksPage />
                    </ProtectedRoutes>
                } />
                <Route path="/news" element={
                    <ProtectedRoutes>
                        <NewsPage />
                    </ProtectedRoutes>
                } />
            </Routes>
        </Router>
    </ErrorProvider>
);