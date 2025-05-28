import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, X, ArrowLeft, RefreshCw, Shield, AlertTriangle, Info, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';

interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobLink?: string;
}

const CheckPage: React.FC = () => {
  const [formData, setFormData] = useState<JobFormData>({
    jobTitle: '',
    companyName: '',
    jobLink: '',
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [result, setResult] = useState<JobAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    repostingHistory: true,
    communitySentiment: true,
    companyVerification: true,
    jobDetails: true,
    sources: true
  });
  
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
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        throw new Error('Failed to analyze job');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
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
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleShare = async () => {
    const shareData = {
      title: `${formData.jobTitle} at ${formData.companyName} - Job Analysis`,
      text: `Trust Score: ${result?.trustScore * 100}%\n${result?.reasoning}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback for browsers that don't support Web Share API
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
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
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-5 w-5" />
                        Check Job
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
                <div className="mb-8 flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {formData.jobTitle} at {formData.companyName}
                    </h3>
                    <div className="flex items-center space-x-4">
                      {getScoreIcon(result.legitimacyStatus)}
                      <div>
                        <div className={`text-xl font-semibold ${getScoreColor(result.trustScore * 100)}`}>
                          {result.trustScore * 100}%
                        </div>
                        <div className="text-white/60 text-sm">
                          Trust Score
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleShare}
                    className="glass-button text-white font-medium py-2 px-4 rounded-lg inline-flex items-center"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>

                {/* Overall Analysis */}
                <div className="mb-6 glass p-6 rounded-xl border border-blue-500/20">
                  <h4 className="font-medium text-white mb-3">Overall Analysis</h4>
                  <p className="text-white/80">{result.reasoning}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Reposting History */}
                  <div className="glass p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-white">Reposting History</h4>
                      <button
                        onClick={() => toggleSection('repostingHistory')}
                        className="text-white/60 hover:text-white"
                      >
                        {expandedSections.repostingHistory ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                    {expandedSections.repostingHistory && (
                      <>
                        <p className="text-white/70">{result.repostingHistory.summary}</p>
                        <p className="text-white/60 text-sm mt-2">{result.repostingHistory.explanation}</p>
                      </>
                    )}
                  </div>

                  {/* Community Sentiment */}
                  <div className="glass p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-white">Community Sentiment</h4>
                      <button
                        onClick={() => toggleSection('communitySentiment')}
                        className="text-white/60 hover:text-white"
                      >
                        {expandedSections.communitySentiment ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                    {expandedSections.communitySentiment && (
                      <>
                        <p className="text-white/70">{result.communitySentiment.summary}</p>
                        <div className="mt-4 space-y-3">
                          <div>
                            <h5 className="font-medium text-white/90">Reddit Analysis</h5>
                            <p className="text-white/60">{result.communitySentiment.redditAnalysis}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-white/90">Blind Analysis</h5>
                            <p className="text-white/60">{result.communitySentiment.blindAnalysis}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Company Verification */}
                <div className="mt-6 glass p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white">Company Verification</h4>
                    <button
                      onClick={() => toggleSection('companyVerification')}
                      className="text-white/60 hover:text-white"
                    >
                      {expandedSections.companyVerification ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  {expandedSections.companyVerification && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">LinkedIn Presence</span>
                          <span className={result.companySignal.linkedInPresence ? 'text-green-400' : 'text-red-400'}>
                            {getIconForValue(result.companySignal.linkedInPresence)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Career Page Active</span>
                          <span className={result.companySignal.careerPageActive ? 'text-green-400' : 'text-red-400'}>
                            {getIconForValue(result.companySignal.careerPageActive)}
                          </span>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{result.companySignal.explanation}</p>
                    </>
                  )}
                </div>

                {/* Job Details */}
                <div className="mt-6 glass p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-white">Job Details</h4>
                    <button
                      onClick={() => toggleSection('jobDetails')}
                      className="text-white/60 hover:text-white"
                    >
                      {expandedSections.jobDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                  </div>
                  {expandedSections.jobDetails && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg group relative">
                          <span className="text-white/70">Requirements Realistic</span>
                          <div className="flex items-center">
                            <span className={result.jobDetails.realisticRequirements ? 'text-green-400' : 'text-red-400'}>
                              {getIconForValue(result.jobDetails.realisticRequirements)}
                            </span>
                            <Info className="h-4 w-4 ml-2 text-white/40 group-hover:text-white/60 cursor-help" />
                          </div>
                          <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-black/90 rounded-lg text-sm text-white/80 hidden group-hover:block z-10">
                            Indicates if the job requirements match industry standards and are realistic for the role.
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg group relative">
                          <span className="text-white/70">Salary Provided</span>
                          <div className="flex items-center">
                            <span className={result.jobDetails.salaryProvided ? 'text-green-400' : 'text-red-400'}>
                              {getIconForValue(result.jobDetails.salaryProvided)}
                            </span>
                            <Info className="h-4 w-4 ml-2 text-white/40 group-hover:text-white/60 cursor-help" />
                          </div>
                          <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-black/90 rounded-lg text-sm text-white/80 hidden group-hover:block z-10">
                            Shows whether the job posting includes salary information, which is a positive signal.
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Posting Age</span>
                          <span className="text-white font-medium">{result.jobDetails.postingAge}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <span className="text-white/70">Reposted Times</span>
                          <span className="text-white font-medium">{result.jobDetails.repostedTimes}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg group relative">
                          <span className="text-white/70">Consistency Across Sites</span>
                          <div className="flex items-center">
                            <span className={result.jobDetails.consistencyAcrossSites ? 'text-green-400' : 'text-red-400'}>
                              {getIconForValue(result.jobDetails.consistencyAcrossSites)}
                            </span>
                            <Info className="h-4 w-4 ml-2 text-white/40 group-hover:text-white/60 cursor-help" />
                          </div>
                          <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-black/90 rounded-lg text-sm text-white/80 hidden group-hover:block z-10">
                            Indicates if the job details are consistent across different job boards and platforms.
                          </div>
                        </div>
                      </div>
                      <p className="text-white/60 text-sm">{result.jobDetails.explanation}</p>
                    </>
                  )}
                </div>

                {/* Sources */}
                {result.citations && result.citations.length > 0 && (
                  <div className="mt-6 glass p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-white">Sources</h4>
                      <button
                        onClick={() => toggleSection('sources')}
                        className="text-white/60 hover:text-white"
                      >
                        {expandedSections.sources ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                      </button>
                    </div>
                    {expandedSections.sources && (
                      <div className="space-y-2">
                        {result.citations.map((citation, index) => (
                          <a
                            key={index}
                            href={citation}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-blue-400 hover:text-blue-300 text-sm truncate"
                          >
                            {citation}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckPage;