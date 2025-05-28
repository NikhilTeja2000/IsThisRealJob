import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/95 backdrop-blur-lg border-t border-white/10 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-semibold mb-4">IsThisRealJob</h3>
            <p className="text-white/60 text-sm">
              Helping job seekers verify the legitimacy of job postings.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/check" className="text-white/60 hover:text-white/80 text-sm">
                  Check Job
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-white/60 hover:text-white/80 text-sm">
                  History
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white/60 hover:text-white/80 text-sm">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/80"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white/80"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <p className="text-white/40 text-sm text-center">
            © {new Date().getFullYear()} IsThisRealJob. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;