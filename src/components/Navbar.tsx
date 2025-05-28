import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Scan, Target } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);
  
  return (
    <header 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'glass border-b border-white/10' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <div className="relative">
              <Target className="h-8 w-8 text-blue-400" />
              <Scan className="h-5 w-5 text-green-400 absolute -bottom-1.5 -right-1.5" />
            </div>
            <span className="text-xl font-bold text-white">Is This Job Real?</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" isActive={location.pathname === '/'}>
              Home
            </NavLink>
            <NavLink to="/about" isActive={location.pathname === '/about'}>
              About
            </NavLink>
            <NavLink to="/check" isActive={location.pathname === '/check'}>
              Check Job
            </NavLink>
          </nav>
          
          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/5 focus:outline-none"
            aria-expanded={isMenuOpen}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden glass border-t border-white/10">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <MobileNavLink to="/" isActive={location.pathname === '/'}>
              Home
            </MobileNavLink>
            <MobileNavLink to="/about" isActive={location.pathname === '/about'}>
              About
            </MobileNavLink>
            <MobileNavLink to="/check" isActive={location.pathname === '/check'}>
              Check Job
            </MobileNavLink>
          </div>
        </div>
      )}
    </header>
  );
};

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`font-medium transition-colors duration-200 ${
      isActive
        ? 'text-blue-400 border-b-2 border-blue-400'
        : 'text-white/80 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

const MobileNavLink: React.FC<NavLinkProps> = ({ to, isActive, children }) => (
  <Link
    to={to}
    className={`block py-2 px-3 rounded-md ${
      isActive
        ? 'text-blue-400 bg-white/5'
        : 'text-white/80 hover:bg-white/5 hover:text-white'
    }`}
  >
    {children}
  </Link>
);

export default Navbar;