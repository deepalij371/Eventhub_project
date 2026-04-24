import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OrganizerDashboard from './pages/OrganizerDashboard';
import SalesAnalytics from './pages/SalesAnalytics';
import AttendeeHome from './pages/AttendeeHome';
import EventDetails from './pages/EventDetails';
import MyTickets from './pages/MyTickets';
import StaffValidation from './pages/StaffValidation';
import './index.css';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Home: React.FC = () => {
  const { user } = useAuth();
  if (user?.role === 'ROLE_ORGANIZER') {
    return <OrganizerDashboard />;
  }
  if (user?.role === 'ROLE_STAFF') {
      return <Navigate to="/staff/validate" />;
  }
  return <AttendeeHome />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/event/:id" element={<PrivateRoute><EventDetails /></PrivateRoute>} />
          <Route path="/my-tickets" element={<PrivateRoute><MyTickets /></PrivateRoute>} />
          <Route path="/organizer/dashboard/:eventId" element={<PrivateRoute><SalesAnalytics /></PrivateRoute>} />
          <Route path="/staff/validate" element={<PrivateRoute><StaffValidation /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
