import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import WarehouseSettings from './pages/WarehouseSettings';
import LocationSettings from './pages/LocationSettings';
import Stock from './pages/Stock';
import MoveHistory from './pages/MoveHistory';

// Import base css where Tailwind should be loaded
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/history" element={<MoveHistory />} />
        <Route path="/settings/warehouse" element={<WarehouseSettings />} />
        <Route path="/settings/location" element={<LocationSettings />} />
      </Routes>
    </Router>
  );
}

export default App;
