import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage, RegisterPage, AdminDashboard, ChauffeurDashboard } from './pages';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/chauffeur/dashboard" element={<ChauffeurDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
