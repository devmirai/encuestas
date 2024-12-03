import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import Login from './login.tsx';
import Index from './index.tsx';
import { RoleProvider } from './RoleContext';
import PrivateRoute from './PrivateRoute';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/encuesta" element={<Index />} />
          </Route>
        </Routes>
      </Router>
    </RoleProvider>
  </StrictMode>,
);
