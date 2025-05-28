import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Search, Shield, Database, Users, AlertTriangle } from 'lucide-react';
import JobCheckForm from '../components/JobCheckForm';

const HomePage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-20 sm:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Not Every Job is Real.
              <br />Let Us Show You Which Are.
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-white/80">
              Trust but verify — with AI. We fact-check jobs, so you don't have to.
            </p>
            <div className="glass-card p-8 max-w-2xl mx-auto transform transition-all duration-500 hover:scale-[1.02]">
              <JobCheckForm />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Use Our Fact Checker?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
              <Search className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Smarter Than a Job Board</h3>
              <p className="text-white/70">We don't list jobs — we audit them. In real-time.</p>
            </div>
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
              <AlertTriangle className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Ghosting Warnings</h3>
              <p className="text-white/70">We scan Reddit and forums to catch patterns of ghosting and fake postings.</p>
            </div>
            <div className="glass-card p-6 hover:scale-[1.02] transition-transform duration-300">
              <Users className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-white">Community Insights</h3>
              <p className="text-white/70">Real feedback from candidates who've been there before.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Warning Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 border border-red-500/20">
              <h3 className="text-xl font-bold mb-4 text-white flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-400 mr-2" />
                Common Red Flags in Job Postings
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
              <div className="mt-6 text-sm text-white/60">
                <a 
                  href="https://www.indeed.com/career-advice/finding-a-job/job-scams" 
                  className="glass-button text-white/80 px-4 py-2 inline-flex items-center text-sm hover:text-white"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Learn More About Job Scams
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-white">How It Works</h2>
            <div className="glass-card p-8">
              <div className="space-y-8">
                <Step
                  number="01"
                  title="Submit a Job to Investigate"
                  description="Enter the details of any job posting you want to verify"
                  icon={<Search className="h-6 w-6 text-blue-400" />}
                />
                <Step
                  number="02"
                  title="We Scan the Web in Seconds"
                  description="Our AI searches job boards, Reddit, company sites, and forums for red flags"
                  icon={<Database className="h-6 w-6 text-blue-400" />}
                />
                <Step
                  number="03"
                  title="You Get a Trust Score with Receipts"
                  description="Every result comes with citations and warnings, just like a research paper"
                  icon={<CheckCircle className="h-6 w-6 text-blue-400" />}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4 text-white">Ready to Try?</h2>
            <p className="text-xl text-white/80 mb-8">
              Stop wasting time on fake listings. Verify your next opportunity now.
            </p>
            <Link
              to="/check"
              className="glass-button px-8 py-4 text-white font-medium inline-flex items-center"
            >
              Fact-Check a Job <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0 w-12 h-12 glass flex items-center justify-center rounded-xl">
      {icon}
    </div>
    <div className="flex-grow">
      <div className="flex items-center mb-2">
        <span className="text-blue-400 font-mono mr-2">{number}</span>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="text-white/70">{description}</p>
    </div>
  </div>
);

export default HomePage;