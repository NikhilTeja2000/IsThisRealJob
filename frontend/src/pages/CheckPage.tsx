import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Check, X, ArrowLeft, RefreshCw, Shield, AlertTriangle, Info, ChevronDown, ChevronUp, Share2, AlertOctagon } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';
import { formatDistanceToNow } from 'date-fns';

interface JobFormData {
  jobTitle: string;
  companyName: string;
  jobLink?: string;
}

interface FallbackData {
  message: string;
  icon: React.ReactNode;
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
                    <div className="flex items-center space-x-4">
                      {getScoreIcon(result.legitimacyStatus)}
                      <div>
                        <div className={`text-lg sm:text-xl font-semibold ${getScoreColor(result.trustScore * 100)}`}>
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
                    className="glass-button text-white font-medium py-2 px-4 rounded-lg inline-flex items-center self-start"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>

              <div className="p-4 sm:p-8 border-b border-white/10">
                <h4 className="font-medium text-white mb-3">Overall Analysis</h4>
                <p className="text-white/80">{result.reasoning}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-8">
                <div className="glass p-4 sm:p-6 rounded-xl">
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
                      {result.repostingHistory.sources.length === 0 ? (
                        <FallbackMessage type="repostingHistory" />
                      ) : (
                        <>
                          <p className="text-white/70">{result.repostingHistory.summary}</p>
                          <p className="text-white/60 text-sm mt-2">{result.repostingHistory.explanation}</p>
                          <div className="mt-4 space-y-2">
                            {result.repostingHistory.sources.map((source, index) => (
                              <a
                                key={index}
                                href={source.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-blue-400 hover:text-blue-300 text-sm truncate"
                              >
                                {source.platform} - {source.title} ({formatDistanceToNow(new Date(source.date))} ago)
                              </a>
                            ))}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                <div className="glass p-4 sm:p-6 rounded-xl">
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
                      {result.communitySentiment.redditAnalysis.length === 0 && 
                       result.communitySentiment.blindAnalysis.length === 0 && 
                       result.communitySentiment.glassdoorAnalysis.length === 0 ? (
                        <FallbackMessage type="communitySentiment" />
                      ) : (
                        <>
                          <p className="text-white/70">{result.communitySentiment.summary}</p>
                          
                          <div className="mt-4">
                            <h5 className="font-medium text-white/90 mb-2">Reddit Feedback</h5>
                            {result.communitySentiment.redditAnalysis.length === 0 ? (
                              <p className="text-white/60 text-sm">No Reddit discussions found</p>
                            ) : (
                              <div className="space-y-3">
                                {result.communitySentiment.redditAnalysis.map((analysis, index) => (
                                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                                    <p className="text-white/80 italic">"{analysis.quote}"</p>
                                    <a
                                      href={analysis.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 text-sm mt-1 block truncate"
                                    >
                                      View on Reddit • {formatDistanceToNow(new Date(analysis.date))} ago
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium text-white/90 mb-2">Blind Reviews</h5>
                            {result.communitySentiment.blindAnalysis.length === 0 ? (
                              <p className="text-white/60 text-sm">No Blind reviews found</p>
                            ) : (
                              <div className="space-y-3">
                                {result.communitySentiment.blindAnalysis.map((analysis, index) => (
                                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                                    <p className="text-white/80 italic">"{analysis.quote}"</p>
                                    <a
                                      href={analysis.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 text-sm mt-1 block truncate"
                                    >
                                      View on Blind • {formatDistanceToNow(new Date(analysis.date))} ago
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="mt-4">
                            <h5 className="font-medium text-white/90 mb-2">Glassdoor Reviews</h5>
                            {result.communitySentiment.glassdoorAnalysis.length === 0 ? (
                              <p className="text-white/60 text-sm">No Glassdoor reviews found</p>
                            ) : (
                              <div className="space-y-3">
                                {result.communitySentiment.glassdoorAnalysis.map((analysis, index) => (
                                  <div key={index} className="bg-white/5 p-3 rounded-lg">
                                    <div className="flex items-center mb-1">
                                      <span className="text-yellow-400">★</span>
                                      <span className="text-white/80 ml-1">{analysis.rating.toFixed(1)}</span>
                                    </div>
                                    <p className="text-white/80 italic">"{analysis.review}"</p>
                                    <a
                                      href={analysis.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 text-sm mt-1 block truncate"
                                    >
                                      View on Glassdoor • {formatDistanceToNow(new Date(analysis.date))} ago
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 sm:p-8 border-t border-white/10">
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
                    {!result.companySignal.linkedInPresence.exists && 
                     !result.companySignal.careerPageActive.exists && 
                     result.companySignal.officialSources.length === 0 ? (
                      <FallbackMessage type="companySignal" />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70">LinkedIn Presence</span>
                            <div className="flex items-center">
                              <span className={result.companySignal.linkedInPresence.exists ? 'text-green-400' : 'text-red-400'}>
                                {getIconForValue(result.companySignal.linkedInPresence.exists)}
                              </span>
                              {result.companySignal.linkedInPresence.exists && (
                                <a
                                  href={result.companySignal.linkedInPresence.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm ml-2"
                                >
                                  View Profile
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70">Career Page Active</span>
                            <div className="flex items-center">
                              <span className={result.companySignal.careerPageActive.exists ? 'text-green-400' : 'text-red-400'}>
                                {getIconForValue(result.companySignal.careerPageActive.exists)}
                              </span>
                              {result.companySignal.careerPageActive.exists && (
                                <a
                                  href={result.companySignal.careerPageActive.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm ml-2"
                                >
                                  View Career Page
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <h5 className="font-medium text-white/90 mb-2">Official Sources</h5>
                          {result.companySignal.officialSources.length === 0 ? (
                            <p className="text-white/60 text-sm">No official sources found</p>
                          ) : (
                            <div className="space-y-2">
                              {result.companySignal.officialSources.map((source, index) => (
                                <a
                                  key={index}
                                  href={source.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="block text-blue-400 hover:text-blue-300 text-sm truncate"
                                >
                                  {source.title} • {formatDistanceToNow(new Date(source.date))} ago
                                </a>
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-white/60 text-sm mt-4">{result.companySignal.explanation}</p>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="p-4 sm:p-8 border-t border-white/10">
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
                    {!result.jobDetails.realisticRequirements && 
                     !result.jobDetails.salaryProvided && 
                     result.jobDetails.crossPlatformComparison.length === 0 ? (
                      <FallbackMessage type="jobDetails" />
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg group relative">
                            <span className="text-white/70">Requirements Realistic</span>
                            <div className="flex items-center">
                              <span className={result.jobDetails.realisticRequirements ? 'text-green-400' : 'text-red-400'}>
                                {getIconForValue(result.jobDetails.realisticRequirements)}
                              </span>
                              <Info className="h-4 w-4 ml-2 text-white/40 group-hover:text-white/60 cursor-help" />
                            </div>
                            <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-black/90 rounded-lg text-sm text-white/80 hidden group-hover:block z-10">
                              {result.jobDetails.requirements.analysis || 'No analysis available'}
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
                            {result.jobDetails.salaryProvided && (
                              <div className="absolute right-0 top-full mt-2 w-64 p-2 bg-black/90 rounded-lg text-sm text-white/80 hidden group-hover:block z-10">
                                {result.jobDetails.salary.range} {result.jobDetails.salary.currency}
                                <br />
                                Source: {result.jobDetails.salary.source}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70">Posting Age</span>
                            <span className="text-white font-medium">{result.jobDetails.postingAge || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                            <span className="text-white/70">Reposted Times</span>
                            <span className="text-white font-medium">{result.jobDetails.repostedTimes || 0}</span>
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

                        <div className="mt-4">
                          <h5 className="font-medium text-white/90 mb-2">Cross-Platform Comparison</h5>
                          {result.jobDetails.crossPlatformComparison.length === 0 ? (
                            <p className="text-white/60 text-sm">No cross-platform comparison available</p>
                          ) : (
                            <div className="space-y-4">
                              {result.jobDetails.crossPlatformComparison.map((comparison, index) => (
                                <div key={index} className="bg-white/5 p-4 rounded-lg">
                                  <div className="flex justify-between items-start mb-2">
                                    <a
                                      href={comparison.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-blue-400 hover:text-blue-300 truncate"
                                    >
                                      {comparison.platform}
                                    </a>
                                    <span className="text-white/60 text-sm ml-2">
                                      {formatDistanceToNow(new Date(comparison.date))} ago
                                    </span>
                                  </div>
                                  <h6 className="text-white/80 font-medium mb-2 truncate">{comparison.title}</h6>
                                  {comparison.salary && (
                                    <p className="text-white/70 text-sm mb-2">Salary: {comparison.salary}</p>
                                  )}
                                  <div className="text-white/60 text-sm">
                                    <p className="font-medium mb-1">Requirements:</p>
                                    <ul className="list-disc list-inside space-y-1">
                                      {comparison.requirements.map((req, i) => (
                                        <li key={i} className="truncate">{req}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <p className="text-white/60 text-sm mt-4">{result.jobDetails.explanation}</p>
                      </>
                    )}
                  </>
                )}
              </div>

              {result.citations && result.citations.length > 0 ? (
                <div className="p-4 sm:p-8 border-t border-white/10">
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
                    <div className="space-y-3">
                      {result.citations
                        .sort((a, b) => (a.isOfficial === b.isOfficial ? 0 : a.isOfficial ? -1 : 1))
                        .map((citation, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className={`text-sm ${citation.isOfficial ? 'text-green-400' : 'text-white/60'}`}>
                              {citation.isOfficial ? '✓' : '•'}
                            </span>
                            <a
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm flex-1 truncate"
                            >
                              {citation.title}
                            </a>
                            <span className="text-white/40 text-sm">
                              {formatDistanceToNow(new Date(citation.date))} ago
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 sm:p-8 border-t border-white/10">
                  <FallbackMessage type="citations" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckPage;