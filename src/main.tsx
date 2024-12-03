import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import Login from './login.tsx';
import Index from './index.tsx';
import { RoleProvider } from './RoleContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RoleProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/encuesta" element={<Index />} />
        </Routes>
      </Router>
    </RoleProvider>
  </StrictMode>,
);
