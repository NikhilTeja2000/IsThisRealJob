import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Database, 
  Check, 
  AlertTriangle, 
  Bell, 
  Bookmark, 
  Brain, 
  Chrome,
  Code,
  Search,
  MessageCircle,
  Globe
} from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Mission Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Building Trust in Job Search
            </h1>
            <p className="text-xl text-white/80 mb-6">
              We've all applied for jobs that never get a response — or later realized they were fake.
              That's why we built IsThisRealJob — to help job seekers avoid scams, ghost jobs, and repost traps using real-time web intelligence and AI.
            </p>
            <p className="text-lg text-white/60">
              Our mission is simple: Make job search more transparent and less frustrating.
            </p>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Tech Stack Behind the Scenes</h2>
              <div className="space-y-4">
                <TechStackItem
                  icon={<Brain className="h-6 w-6 text-blue-400" />}
                  title="LLM + Structured Prompting"
                  description="Perplexity Sonar for reliable data extraction and analysis"
                />
                <TechStackItem
                  icon={<Code className="h-6 w-6 text-blue-400" />}
                  title="Custom Risk Analysis Engine"
                  description="Our logic layer weighs reposts, platform consistency, and social sentiment"
                />
                <TechStackItem
                  icon={<Database className="h-6 w-6 text-blue-400" />}
                  title="APIs & Scraping (coming soon)"
                  description="Integrating real Glassdoor, Reddit, and job board APIs"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Sources Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Our Data Sources</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-6 w-6 text-blue-400" />
                    <span className="text-white">Company Career Pages</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Search className="h-6 w-6 text-blue-400" />
                    <span className="text-white">Major Job Boards</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-6 w-6 text-blue-400" />
                    <span className="text-white">Reddit & Blind</span>
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Database className="h-6 w-6 text-blue-400" />
                    <span className="text-white">Market Data APIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Why We're Different</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 text-white/80">Feature</th>
                      <th className="text-center py-3 text-white/80">LLM</th>
                      <th className="text-center py-3 text-white/80">Other tools</th>
                      <th className="text-center py-3 text-white/80">This Tool</th>
                    </tr>
                  </thead>
                  <tbody className="text-white/60">
                    <ComparisonRow
                      feature="Enter custom job"
                      llm={false}
                      others={false}
                      us={true}
                    />
                    <ComparisonRow
                      feature="Real-time trust score"
                      llm={false}
                      others={false}
                      us={true}
                    />
                    <ComparisonRow
                      feature="Community feedback"
                      llm={false}
                      others={false}
                      us={true}
                    />
                    <ComparisonRow
                      feature="Structured citations"
                      llm={false}
                      others={false}
                      us={true}
                    />
                    <ComparisonRow
                      feature="Browser extension (coming)"
                      llm={false}
                      others={false}
                      us={true}
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Coming Soon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <RoadmapItem
                  icon={<Bookmark className="h-6 w-6 text-blue-400" />}
                  title="Save job scans & history"
                />
                <RoadmapItem
                  icon={<Brain className="h-6 w-6 text-blue-400" />}
                  title="Company pattern detection"
                />
                <RoadmapItem
                  icon={<Bell className="h-6 w-6 text-blue-400" />}
                  title="Weekly ghost job alerts"
                />
                <RoadmapItem
                  icon={<Chrome className="h-6 w-6 text-blue-400" />}
                  title="Browser extension"
                />
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
              <h2 className="text-2xl font-bold mb-6 text-white">Ready to Try It?</h2>
              <p className="text-white/80 mb-8">
                Start checking job postings and avoid wasting time on ghost jobs.
              </p>
              <Link
                to="/check"
                className="glass-button px-8 py-4 text-white font-medium inline-flex items-center"
              >
                Check Your First Job <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface TechStackItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const TechStackItem: React.FC<TechStackItemProps> = ({ icon, title, description }) => (
  <div className="glass p-4 rounded-xl">
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="ml-4">
        <h3 className="text-white font-medium">{title}</h3>
        <p className="text-white/60 text-sm mt-1">{description}</p>
      </div>
    </div>
  </div>
);

interface ComparisonRowProps {
  feature: string;
  llm: boolean;
  others: boolean;
  us: boolean;
}

const ComparisonRow: React.FC<ComparisonRowProps> = ({ feature, llm, others, us }) => (
  <tr className="border-b border-white/10">
    <td className="py-3">{feature}</td>
    <td className="text-center py-3">
      {llm ? <Check className="h-5 w-5 text-green-400 inline" /> : <AlertTriangle className="h-5 w-5 text-red-400 inline" />}
    </td>
    <td className="text-center py-3">
      {others ? <Check className="h-5 w-5 text-green-400 inline" /> : <AlertTriangle className="h-5 w-5 text-red-400 inline" />}
    </td>
    <td className="text-center py-3">
      {us ? <Check className="h-5 w-5 text-green-400 inline" /> : <AlertTriangle className="h-5 w-5 text-red-400 inline" />}
    </td>
  </tr>
);

interface RoadmapItemProps {
  icon: React.ReactNode;
  title: string;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ icon, title }) => (
  <div className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform duration-300">
    <div className="flex items-center space-x-3">
      {icon}
      <span className="text-white">{title}</span>
    </div>
  </div>
);

export default AboutPage;