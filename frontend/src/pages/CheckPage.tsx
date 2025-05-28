import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, X, ArrowLeft, RefreshCw, Shield, AlertTriangle, Info, ChevronDown, ChevronUp, Share2, AlertOctagon } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';
import { formatDistanceToNow } from 'date-fns';
import JobAnalysisDetails from '../components/JobAnalysisDetails';
import '../styles/scrollbar.css';

interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobLink?: string;
}

interface FallbackData {
  message: string;
  icon: React.ReactNode;
}

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return 'Unknown date';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return 'Invalid date';
  }
};

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
  
  const saveToHistory = (result: JobAnalysisResult) => {
    const historyItem = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      formData,
      result
    };

    const existingHistory = localStorage.getItem('jobAnalysisHistory');
    const history = existingHistory ? JSON.parse(existingHistory) : [];
    
    // Add new item to the beginning of the array
    history.unshift(historyItem);
    
    // Keep only the last 50 items
    const trimmedHistory = history.slice(0, 50);
    
    localStorage.setItem('jobAnalysisHistory', JSON.stringify(trimmedHistory));
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
      saveToHistory(data);
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
    if (!result) return;

    const shareData = {
      title: `${formData.jobTitle} at ${formData.companyName} - Job Analysis`,
      text: `Trust Score: ${result.trustScore * 100}%\n${result.reasoning}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };
  
  const getFallbackData = (type: string): FallbackData => {
    switch (type) {
      case 'repostingHistory':
        return {
          message: 'No reposting history available. This might indicate a new posting or limited data.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'communitySentiment':
        return {
          message: 'No community feedback available. This could be a new posting or limited discussion.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'companySignal':
        return {
          message: 'Limited company verification data available. Proceed with caution.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'jobDetails':
        return {
          message: 'Incomplete job details. Some information may be missing.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'citations':
        return {
          message: 'Limited source citations available. Consider verifying through additional channels.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      default:
        return {
          message: 'Data not available',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
    }
  };

  const FallbackMessage: React.FC<{ type: string }> = ({ type }) => {
    const fallback = getFallbackData(type);
    return (
      <div className="flex items-start space-x-2 p-3 bg-yellow-400/10 rounded-lg border border-yellow-400/20">
        {fallback.icon}
        <p className="text-yellow-400 text-sm">{fallback.message}</p>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold mt-4 text-white">Check Job Legitimacy</h1>
            <p className="text-white/70 mt-2 text-sm sm:text-base">
              Enter job details below to verify if it's a real opportunity or potentially a ghost job.
            </p>
          </div>
          
          <div className="glass-card overflow-hidden mb-8">
            <div className="p-4 sm:p-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
          </div>
          
          {error && (
            <div className="glass-card border-t border-red-500/20 p-4 sm:p-8">
              <div className="flex items-center text-red-400 mb-2">
                <AlertCircle className="h-5 w-5 mr-2" />
                <h3 className="font-semibold">Error</h3>
              </div>
              <p className="text-red-400">{error}</p>
            </div>
          )}
          
          {isVerifying && (
            <div className="glass-card border-t border-white/10 p-4 sm:p-8">
              <div className="flex items-center justify-center space-x-3">
                <RefreshCw className="h-6 w-6 text-blue-400 animate-spin" />
                <p className="text-blue-400 font-medium">Analyzing job listing...</p>
              </div>
            </div>
          )}
          
          {result && !isVerifying && (
            <div className="glass-card border-t border-white/10">
              <div className="p-4 sm:p-8 border-b border-white/10">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4">
                      {formData.jobTitle} at {formData.companyName}
                    </h3>
                  </div>
                  <button
                    onClick={handleShare}
                    className="glass-button text-white font-medium py-2 px-4 rounded-lg inline-flex items-center self-start"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              <JobAnalysisDetails
                result={result}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckPage;