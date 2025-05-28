import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Database, Users, Check, AlertTriangle, ExternalLink, Bell, Bookmark, Brain, Chrome } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative">
        <div className="container mx-auto px-4 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/80">
              Building Trust in Job Search
            </h1>
            <p className="text-xl text-white/80">
              In today's job market, it's hard to know what's real. Ghost listings. Reposts. Resume traps.
              We're building a layer of trust on top of job boards — powered by AI and real community signals.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 mb-8">
              <div className="flex items-center mb-6">
                <Shield className="h-8 w-8 text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-white">Protecting Job Seekers</h2>
              </div>
              <p className="text-white/80 mb-6">
                Job scams are getting more sophisticated, but so are your tools. We're building a layer of AI-powered defense against common threats:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Unverified Listings
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Ghost Companies
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Deceptive Offers
                  </div>
                </div>
                <div className="glass p-4 rounded-xl">
                  <div className="flex items-center text-white/80">
                    <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                    Resume Harvesting
                  </div>
                </div>
              </div>
              <div className="glass p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Database className="h-5 w-5 text-blue-400 mr-2" />
                  Trusted Resources
                </h3>
                <div className="space-y-3">
                  <ResourceLink
                    title="How to Know If a Job is a Scam"
                    source="Indeed"
                    href="https://www.indeed.com/career-advice/finding-a-job/how-to-know-if-a-job-is-a-scam"
                  />
                  <ResourceLink
                    title="Stay Secure While Job Hunting"
                    source="NCA"
                    href="https://www.staysafeonline.org/articles/stay-secure-while-job-hunting"
                  />
                  <ResourceLink
                    title="8 Red Flags of Employment Scams"
                    source="Dexian"
                    href="https://dexian.com/blog/legit-job-or-employment-scam-8-red-flags-to-avoid-becoming-a-victim"
                  />
                  <ResourceLink
                    title="How to Tell if a Job Offer is a Scam"
                    source="LinkedIn"
                    href="https://www.linkedin.com/pulse/how-tell-job-offer-real-scam-jan-tegze-kp41e"
                  />
                  <ResourceLink
                    title="How to Report Job Scams"
                    source="FTC"
                    href="https://consumer.ftc.gov/articles/job-scams"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We're For Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8">
              <h2 className="text-2xl font-bold mb-6 text-white">Who We're For</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PersonaCard
                  icon={<Users className="h-6 w-6 text-blue-400" />}
                  title="Students & Graduates"
                  description="Avoid wasting applications on fake internships"
                />
                <PersonaCard
                  icon={<Database className="h-6 w-6 text-blue-400" />}
                  title="Job Switchers"
                  description="Make sure your next role is worth pursuing"
                />
                <PersonaCard
                  icon={<Shield className="h-6 w-6 text-blue-400" />}
                  title="Career Coaches"
                  description="Offer fact-based job insights to your clients"
                />
                <PersonaCard
                  icon={<Check className="h-6 w-6 text-blue-400" />}
                  title="Job Platforms"
                  description="Integrate our API for pre-listing verification"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 text-center">
              <blockquote className="text-xl italic text-white/90 mb-6">
                "If I had this tool a year ago, I wouldn't have wasted months applying to ghost jobs. 
                This is like Credit Karma for careers."
              </blockquote>
              <p className="text-white/70">— Beta tester, Austin TX</p>
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
                  title="Save job scans"
                />
                <RoadmapItem
                  icon={<Brain className="h-6 w-6 text-blue-400" />}
                  title="Pattern detection on companies"
                />
                <RoadmapItem
                  icon={<Bell className="h-6 w-6 text-blue-400" />}
                  title="Weekly ghost job alerts"
                />
                <RoadmapItem
                  icon={<Chrome className="h-6 w-6 text-blue-400" />}
                  title="Chrome extension"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="glass-card p-8 text-center">
              <h2 className="text-2xl font-bold mb-6 text-white">Join the Mission</h2>
              <p className="text-white/80 mb-8">
                If you've ever been ghosted after a job application, you know the pain. 
                We're building this for you. Want to help test, contribute, or give feedback?
              </p>
              <Link
                to="/check"
                className="glass-button px-8 py-4 text-white font-medium inline-flex items-center"
              >
                Run a Job Scan <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

interface PersonaCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const PersonaCard: React.FC<PersonaCardProps> = ({ icon, title, description }) => (
  <div className="glass p-6 rounded-xl hover:scale-[1.02] transition-transform duration-300">
    <div className="flex items-center mb-3">
      {icon}
      <h3 className="text-lg font-semibold ml-3 text-white">{title}</h3>
    </div>
    <p className="text-white/70">{description}</p>
  </div>
);

interface RoadmapItemProps {
  icon: React.ReactNode;
  title: string;
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ icon, title }) => (
  <div className="glass p-4 rounded-xl hover:scale-[1.02] transition-transform duration-300">
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{icon}</span>
      <span className="text-white">{title}</span>
    </div>
  </div>
);

interface ResourceLinkProps {
  title: string;
  source: string;
  href: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({ title, source, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="glass p-3 rounded-lg flex items-center justify-between group hover:border-blue-500/20 border border-transparent transition-all"
  >
    <div className="flex items-center">
      <span className="text-white/80 group-hover:text-white transition-colors">{title}</span>
      <span className="ml-2 text-blue-400/70 text-sm">[{source}]</span>
    </div>
    <ExternalLink className="h-4 w-4 text-white/40 group-hover:text-white/80 transition-colors" />
  </a>
);

export default AboutPage;