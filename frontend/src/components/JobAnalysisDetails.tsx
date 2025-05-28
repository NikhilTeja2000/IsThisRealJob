import React from 'react';
import { ChevronDown, ChevronUp, AlertOctagon, Shield, AlertTriangle, AlertCircle, Check, X, Info } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';
import { formatDate } from '../utils/dateUtils';

interface JobAnalysisDetailsProps {
  result: JobAnalysisResult;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

const statusBadge = (status: string) => {
  switch (status) {
    case 'legitimate':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 ml-2">Legitimate</span>;
    case 'suspicious':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 ml-2">Suspicious</span>;
    case 'likely-fake':
      return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 ml-2">Likely Fake</span>;
    default:
      return null;
  }
};

const JobAnalysisDetails: React.FC<JobAnalysisDetailsProps> = ({
  result,
  expandedSections,
  toggleSection
}) => {
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

  const getFallbackData = (type: string) => {
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
      <div className="flex flex-col items-center justify-center space-y-2 p-4 bg-yellow-400/10 rounded-lg border border-yellow-400/20 text-center">
        {fallback.icon}
        <p className="text-yellow-400 text-sm font-medium">{fallback.message}</p>
      </div>
    );
  };

  // Section divider
  const Divider = () => <div className="my-4" />;

  return (
    <div className="space-y-4">
      {/* Trust Score and Overall Analysis - only this card has top rounded corners */}
      <div className="glass-card pt-0 pb-6 px-0 sm:px-0 border-b border-white/10 shadow-xl bg-gradient-to-br from-blue-900/30 to-black/60 rounded-t-2xl rounded-b-none">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              {getScoreIcon(result.legitimacyStatus)}
              <div>
                <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(result.trustScore * 100)}`}>{result.trustScore * 100}%</div>
                <div className="text-white/60 text-sm font-medium">Trust Score</div>
              </div>
              {statusBadge(result.legitimacyStatus)}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 tracking-wide">Overall Analysis</h4>
            <p className="text-white/80 text-base leading-relaxed">{result.reasoning}</p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Reposting History and Community Sentiment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reposting History */}
        <div className="glass p-6 rounded-2xl h-full shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white tracking-wide">Reposting History</h4>
            <button
              onClick={() => toggleSection('repostingHistory')}
              className="text-white/60 hover:text-white transition-transform duration-200"
              aria-label="Toggle Reposting History"
            >
              <span className={expandedSections.repostingHistory ? 'rotate-180 transition-transform' : 'transition-transform'}>
                {expandedSections.repostingHistory ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
            </button>
          </div>
          {expandedSections.repostingHistory && (
            <>
              {result.repostingHistory.sources.length === 0 ? (
                <FallbackMessage type="repostingHistory" />
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-white/70 font-medium">{result.repostingHistory.summary}</p>
                    <p className="text-white/60 text-sm mt-2">{result.repostingHistory.explanation}</p>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {result.repostingHistory.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 bg-white/5 rounded-lg hover:bg-blue-500/10 transition-colors border border-transparent hover:border-blue-400"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-white/90 font-medium truncate">{source.title}</p>
                            <p className="text-white/60 text-sm">{source.platform}</p>
                          </div>
                          <span className="text-white/40 text-sm ml-2 whitespace-nowrap">
                            {formatDate(source.date)}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Community Sentiment */}
        <div className="glass p-6 rounded-2xl h-full shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white tracking-wide">Community Sentiment</h4>
            <button
              onClick={() => toggleSection('communitySentiment')}
              className="text-white/60 hover:text-white transition-transform duration-200"
              aria-label="Toggle Community Sentiment"
            >
              <span className={expandedSections.communitySentiment ? 'rotate-180 transition-transform' : 'transition-transform'}>
                {expandedSections.communitySentiment ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
            </button>
          </div>
          {expandedSections.communitySentiment && (
            <>
              {result.communitySentiment.redditAnalysis.length === 0 && 
               result.communitySentiment.blindAnalysis.length === 0 && 
               result.communitySentiment.glassdoorAnalysis.length === 0 ? (
                <FallbackMessage type="communitySentiment" />
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/5 p-4 rounded-lg">
                    <p className="text-white/70 font-medium">{result.communitySentiment.summary}</p>
                  </div>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {/* Reddit Feedback */}
                    {result.communitySentiment.redditAnalysis.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                          Reddit Feedback
                        </h5>
                        {result.communitySentiment.redditAnalysis.map((analysis, index) => (
                          <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-white/80 italic">"{analysis.quote}"</p>
                            <a
                              href={analysis.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center"
                            >
                              View on Reddit • {formatDate(analysis.date)}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Blind Reviews */}
                    {result.communitySentiment.blindAnalysis.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                          Blind Reviews
                        </h5>
                        {result.communitySentiment.blindAnalysis.map((analysis, index) => (
                          <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <p className="text-white/80 italic">"{analysis.quote}"</p>
                            <a
                              href={analysis.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center"
                            >
                              View on Blind • {formatDate(analysis.date)}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Glassdoor Reviews */}
                    {result.communitySentiment.glassdoorAnalysis.length > 0 && (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Glassdoor Reviews
                        </h5>
                        {result.communitySentiment.glassdoorAnalysis.map((analysis, index) => (
                          <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                            <div className="flex items-center mb-2">
                              <span className="text-yellow-400">★</span>
                              <span className="text-white/80 ml-1">{analysis.rating.toFixed(1)}</span>
                            </div>
                            <p className="text-white/80 italic">"{analysis.review}"</p>
                            <a
                              href={analysis.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-flex items-center"
                            >
                              View on Glassdoor • {formatDate(analysis.date)}
                            </a>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Divider />

      {/* Company Verification */}
      <div className="p-6 sm:p-10 border-t-0 border-b-0 glass-card rounded-none shadow-md mt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Company Verification</h4>
          <button
            onClick={() => toggleSection('companyVerification')}
            className="text-white/60 hover:text-white transition-transform duration-200"
            aria-label="Toggle Company Verification"
          >
            <span className={expandedSections.companyVerification ? 'rotate-180 transition-transform' : 'transition-transform'}>
              {expandedSections.companyVerification ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
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
                          {source.title} • {formatDate(source.date)}
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

      <Divider />

      {/* Job Details */}
      <div className="p-6 sm:p-10 border-t-0 border-b-0 glass-card rounded-none shadow-md mt-4">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Job Details</h4>
          <button
            onClick={() => toggleSection('jobDetails')}
            className="text-white/60 hover:text-white transition-transform duration-200"
            aria-label="Toggle Job Details"
          >
            <span className={expandedSections.jobDetails ? 'rotate-180 transition-transform' : 'transition-transform'}>
              {expandedSections.jobDetails ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
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
                        <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
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
                              {formatDate(comparison.date)}
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

      <Divider />

      {/* Citations */}
      {result.citations && result.citations.length > 0 ? (
        <div className="p-6 sm:p-10 border-t-0 glass-card shadow-md rounded-b-2xl mt-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-semibold text-white tracking-wide">Sources</h4>
            <button
              onClick={() => toggleSection('sources')}
              className="text-white/60 hover:text-white transition-transform duration-200"
              aria-label="Toggle Sources"
            >
              <span className={expandedSections.sources ? 'rotate-180 transition-transform' : 'transition-transform'}>
                {expandedSections.sources ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </span>
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
                      {formatDate(citation.date)}
                    </span>
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6 sm:p-10 border-t-0 glass-card shadow-md rounded-b-2xl mt-4">
          <FallbackMessage type="citations" />
        </div>
      )}
    </div>
  );
};

export default JobAnalysisDetails; 