import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield } from 'lucide-react';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-400" />
            <span className="text-white font-semibold">IsThisRealJob</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/home"
              className={`text-sm font-medium transition-colors ${
                isActive('/home')
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Home
            </Link>
            <Link
              to="/check"
              className={`text-sm font-medium transition-colors ${
                isActive('/check')
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              Check Job
            </Link>
            <Link
              to="/history"
              className={`text-sm font-medium transition-colors ${
                isActive('/history')
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              History
            </Link>
            <Link
              to="/about"
              className={`text-sm font-medium transition-colors ${
                isActive('/about')
                  ? 'text-blue-400'
                  : 'text-white/60 hover:text-white/80'
              }`}
            >
              About
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;