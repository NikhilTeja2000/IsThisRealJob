import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, X, ArrowLeft, RefreshCw, Shield, AlertTriangle } from 'lucide-react';

interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobLink?: string;
}

interface JobResult {
  score: number;
  legitimacyStatus: 'legitimate' | 'suspicious' | 'likely-fake';
  details: {
    companyVerification: {
      linkedInPresence: boolean;
      careerPage: boolean;
      consistentDetails: boolean;
    };
    jobAnalysis: {
      realisticRequirements: boolean;
      salaryProvided: boolean;
      multiplePostings: boolean;
      postingAge: string;
      repostedTimes: number;
    };
    communityFeedback: {
      redditMentions: boolean;
      glassdoorReviews: boolean;
    };
  };
}

const CheckPage: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    companyName: '',
    jobLink: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<JobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const storedData = sessionStorage.getItem('jobCheckData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setFormData(parsedData);
      } catch (err) {
        console.error('Error parsing stored job data:', err);
      }
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    checkJob();
  };
  
  const checkJob = async () => {
    setIsVerifying(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/jobs/fact-check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job insights');
      }

      const data = await response.json();
      setResult(data.data);
    } catch (err) {
      setError('Error fetching job insights. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const resetForm = () => {
    setFormData({
      jobTitle: '',
      companyName: '',
      jobLink: '',
    });
    setResult(null);
    setError(null);
    sessionStorage.removeItem('jobCheckData');
  };
  
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };
  
  const getScoreIcon = (status: string) => {
    switch (status) {
      case 'legitimate':
        return <Shield className="h-6 w-6 text-green-400" />;
      case 'suspicious':
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
      case 'likely-fake':
        return <AlertCircle className="h-6 w-6 text-red-400" />;
      default:
        return null;
    }
  };
  
  const getIconForValue = (value: boolean) => {
    return value ? (
      <Check className="h-4 w-4 text-green-400" />
    ) : (
      <X className="h-4 w-4 text-red-400" />
    );
  };
  
  return (
    <div className="pt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold mt-4 text-white">Check Job Legitimacy</h1>
            <p className="text-white/70 mt-2">
              Enter job details below to verify if it's a real opportunity or potentially a ghost job.
            </p>
          </div>
          
          <div className="glass-card overflow-hidden">
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="jobTitle" className="block text-sm font-medium text-white/80 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      name="jobTitle"
                      value={formData.jobTitle}
                      onChange={handleChange}
                      placeholder="e.g. Software Engineer"
                      required
                      className="glass-input w-full"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-white/80 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g. Acme Inc."
                      required
                      className="glass-input w-full"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="jobLink" className="block text-sm font-medium text-white/80 mb-2">
                    Job Link (Optional)
                  </label>
                  <input
                    type="url"
                    id="jobLink"
                    name="jobLink"
                    value={formData.jobLink || ''}
                    onChange={handleChange}
                    placeholder="https://example.com/job-posting"
                    className="glass-input w-full"
                  />
                </div>
                
                <div className="pt-2 flex flex-col sm:flex-row sm:gap-4 gap-3">
                  <button
                    type="submit"
                    disabled={isVerifying}
                    className={`glass-button text-white font-medium py-3 px-6 inline-flex items-center justify-center sm:flex-1 ${
                      isVerifying ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isVerifying ? (
                      <>
                        <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Verify Job
                      </>
                    )}
                  </button>
                  
                  {(result || error) && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="glass border border-white/10 hover:bg-white/5 text-white/80 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center"
                    >
                      <X className="mr-2 h-5 w-5" />
                      Start Over
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {error && (
              <div className="p-8 glass border-t border-red-500/20">
                <div className="flex items-center text-red-400 mb-2">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <h3 className="font-semibold">Error</h3>
                </div>
                <p className="text-red-400">{error}</p>
              </div>
            )}
            
            {isVerifying && (
              <div className="p-8 glass border-t border-white/10">
                <div className="flex items-center justify-center space-x-3">
                  <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                  <p className="text-blue-400 font-medium">Analyzing job listing...</p>
                </div>
              </div>
            )}
            
            {result && !isVerifying && (
              <div className="p-8 glass border-t border-white/10">
                <div className="mb-8">
                  <h3 className="text-2xl font-semibold text-white mb-4">
                    {formData.jobTitle} at {formData.companyName}
                  </h3>
                  <div className="flex items-center space-x-4">
                    {getScoreIcon(result.legitimacyStatus)}
                    <div>
                      <div className={`text-xl font-semibold ${getScoreColor(result.score)}`}>
                        {result.score}/100
                      </div>
                      <div className="text-white/60 text-sm">
                        Trust Score
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass p-6 rounded-xl">
                    <h4 className="font-medium text-white mb-4">Company Verification</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">LinkedIn Presence</span>
                        {getIconForValue(result.details.companyVerification.linkedInPresence)}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Active Career Page</span>
                        {getIconForValue(result.details.companyVerification.careerPage)}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Consistent Job Details</span>
                        {getIconForValue(result.details.companyVerification.consistentDetails)}
                      </li>
                    </ul>
                  </div>
                  
                  <div className="glass p-6 rounded-xl">
                    <h4 className="font-medium text-white mb-4">Job Analysis</h4>
                    <ul className="space-y-3">
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Realistic Requirements</span>
                        {getIconForValue(result.details.jobAnalysis.realisticRequirements)}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Salary Information</span>
                        {getIconForValue(result.details.jobAnalysis.salaryProvided)}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Multiple Site Listings</span>
                        {getIconForValue(result.details.jobAnalysis.multiplePostings)}
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Posting Age</span>
                        <span className="text-white font-medium">{result.details.jobAnalysis.postingAge}</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-white/70">Times Reposted</span>
                        <span className="text-white font-medium">{result.details.jobAnalysis.repostedTimes}</span>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 glass p-6 rounded-xl">
                  <h4 className="font-medium text-white mb-4">Community Feedback</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center justify-between">
                      <span className="text-white/70">Reddit Mentions of Ghosting</span>
                      {getIconForValue(result.details.communityFeedback.redditMentions)}
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-white/70">Negative Glassdoor Reviews</span>
                      {getIconForValue(result.details.communityFeedback.glassdoorReviews)}
                    </li>
                  </ul>
                </div>
                
                <div className="mt-6 glass p-6 rounded-xl border border-blue-500/20">
                  <h4 className="font-medium text-white mb-3">Our Analysis</h4>
                  <p className="text-white/80">
                    {result.score >= 70 ? (
                      "This job appears to be legitimate based on our analysis. The company has a verified online presence and the job details are consistent with industry standards."
                    ) : result.score >= 40 ? (
                      "This job has some suspicious elements. While the company appears to be legitimate, there are inconsistencies in the job details or posting patterns that warrant caution."
                    ) : (
                      "This job shows multiple red flags typical of fake job listings. The posting has been repeatedly listed, lacks key details, or the company has been associated with ghosting candidates."
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;