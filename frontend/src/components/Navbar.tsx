import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 10);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-3xl">calendar_today</span>
            <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">EventHub</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Explore</Link>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Venues</a>
            <a href="#" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Pricing</a>
            {isAuthenticated && (
              <Link to="/my-tickets" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">My Tickets</Link>
            )}
            {user?.role === 'ROLE_ORGANIZER' && (
              <Link to="/organizer/dashboard/0" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Dashboard</Link>
            )}
            {user?.role === 'ROLE_STAFF' && (
              <Link to="/staff/validate" className="text-sm font-medium hover:text-primary transition-colors text-slate-700 dark:text-slate-300">Validate</Link>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Hi, {user?.username}</span>
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-red-500 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">Login</Link>
                <Link to="/signup" className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-lg text-sm font-bold shadow-lg shadow-primary/20 transition-all">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
