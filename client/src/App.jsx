import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import WarehouseSettings from './pages/WarehouseSettings';
import LocationSettings from './pages/LocationSettings';
import Stock from './pages/Stock';
import MoveHistory from './pages/MoveHistory';
import Receipt from './pages/Receipt';
import AddReceipt from './pages/AddReceipt';
import Delivery from './pages/Delivery';
import AddDelivery from './pages/AddDelivery';
import Adjustment from './pages/Adjustment';
// Import base css where Tailwind should be loaded
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/stock" element={<ProtectedRoute><Stock /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><MoveHistory /></ProtectedRoute>} />
          <Route path="/operations/receipt" element={<ProtectedRoute><Receipt /></ProtectedRoute>} />
          <Route path="/operations/receipt/new" element={<ProtectedRoute><AddReceipt /></ProtectedRoute>} />
          <Route path="/operations/delivery" element={<ProtectedRoute><Delivery /></ProtectedRoute>} />
          <Route path="/operations/delivery/new" element={<ProtectedRoute><AddDelivery /></ProtectedRoute>} />
          <Route path="/operations/adjustment" element={<ProtectedRoute><Adjustment /></ProtectedRoute>} />
          <Route path="/settings/warehouse" element={<ProtectedRoute><WarehouseSettings /></ProtectedRoute>} />
          <Route path="/settings/location" element={<ProtectedRoute><LocationSettings /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
