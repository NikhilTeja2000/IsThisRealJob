import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0A0A] relative overflow-hidden">
      {/* Gradient background */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/20 via-purple-500/20 to-transparent"></div>
        <div className="absolute inset-0 bg-noise opacity-[0.03] mix-blend-soft-light"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <main className="relative">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;