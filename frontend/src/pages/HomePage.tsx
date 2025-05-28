import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  RefreshCcw,
  MessageCircle,
  Globe,
  FileCheck,
  Shield
} from 'lucide-react';
import JobCheckForm from '../components/JobCheckForm';

const HomePage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Is This Job Real or a Ghost?
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-white/80">
              Use AI to verify any job posting in seconds.
            </p>
            <p className="text-lg mb-8 text-white/60">
              Check reposting patterns, company signals, Reddit discussions, and more.
            </p>
            <div className="glass-card p-8 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
              <JobCheckForm />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Score Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 mb-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Trust Score Analysis</h2>
              </div>
              <p className="text-white/80 mb-6">
                Every job gets a comprehensive trust score based on multiple factors:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Company Verification
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Posting Consistency
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Community Feedback
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    Technical Validation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Red Flags Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 border border-red-500/20">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
                Common Red Flags We Check
              </h3>
              <div className="space-y-3">
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center text-white/80">
                    <span className="text-red-400 mr-2">⚠️</span>
                    Unofficial Communication Channels (WhatsApp, Personal Gmail)
                  </div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center text-white/80">
                    <span className="text-red-400 mr-2">⚠️</span>
                    Vague Job Descriptions or Missing Key Details
                  </div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center text-white/80">
                    <span className="text-red-400 mr-2">⚠️</span>
                    Unrealistic Pay for Required Experience
                  </div>
                </div>
                <div className="glass p-3 rounded-lg">
                  <div className="flex items-center text-white/80">
                    <span className="text-red-400 mr-2">⚠️</span>
                    Requests for Personal Info Before Interview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">15+</div>
                <div className="text-white/80">Data Sources</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">30s</div>
                <div className="text-white/80">Average Scan Time</div>
              </div>
              <div className="glass-card p-6 text-center">
                <div className="text-3xl font-bold text-blue-400 mb-2">99%</div>
                <div className="text-white/80">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-6 text-white">Try the Trust Checker Now</h2>
              <p className="text-white/80 mb-8">
                Enter a job title and company → Let our AI do the digging for you.
                Know before you apply.
              </p>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/check"
                  className="glass-button px-8 py-4 text-white font-medium inline-flex items-center"
                >
                  Check a Job Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="text-white/60 hover:text-white/80 transition-colors"
                >
                  Learn how it works →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;