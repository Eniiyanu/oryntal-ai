import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Influencers from './pages/Influencers';
import Alerts from './pages/Alerts';
import Recommendations from './pages/Recommendations';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyOTP from './pages/auth/VerifyOTP';
import ForgotPassword from './pages/auth/ForgotPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/auth/verify-otp" element={<VerifyOTP />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/influencers" element={<Layout><Influencers /></Layout>} />
        <Route path="/alerts" element={<Layout><Alerts /></Layout>} />
        <Route path="/recommendations" element={<Layout><Recommendations /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
