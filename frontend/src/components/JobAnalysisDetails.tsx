import React from 'react';
import { ChevronDown, ChevronUp, AlertOctagon, Shield, AlertTriangle, AlertCircle, Check, X, Info, Globe, Building, Database, Lock } from 'lucide-react';
import { JobAnalysisResult } from '../types/jobAnalysis';
import { formatDate } from '../utils/dateUtils';

interface JobAnalysisDetailsProps {
  result: JobAnalysisResult;
  expandedSections: Record<string, boolean>;
  toggleSection: (section: string) => void;
}

interface SalarySource {
  platform: string;
  dataPoint: string;
  date: string;
}

interface Skill {
  name: string;
  level?: string;
}

interface JobRequirement {
  description: string;
  required: boolean;
}

const statusBadge = (score: number) => {
  if (score >= 0.7) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 ml-2">Legitimate</span>;
  } else if (score >= 0.4) {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 ml-2">Suspicious</span>;
  } else {
    return <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 ml-2">Likely Fake</span>;
  }
};

const JobAnalysisDetails: React.FC<JobAnalysisDetailsProps> = ({
  result,
  expandedSections,
  toggleSection
}) => {
  // Safe access helpers
  const safeAccess = <T,>(obj: any, path: string[], defaultValue: T): T => {
    return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  };

  const safeArrayAccess = <T,>(arr: T[] | undefined | null): T[] => {
    return Array.isArray(arr) ? arr : [];
  };

  // Safe number access helper
  const safeNumberAccess = (obj: any, path: string[], defaultValue: number = 0): number => {
    const value = safeAccess<number | undefined>(obj, path, defaultValue);
    return typeof value === 'number' ? value : defaultValue;
  };

  // Safe boolean access helper
  const safeBooleanAccess = (obj: any, path: string[], defaultValue: boolean = false): boolean => {
    const value = safeAccess<boolean | undefined>(obj, path, defaultValue);
    return typeof value === 'boolean' ? value : defaultValue;
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-400';
    if (score >= 0.4) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 0.7) {
      return <Shield className="h-6 w-6 text-green-400" />;
    } else if (score >= 0.4) {
      return <AlertTriangle className="h-6 w-6 text-yellow-400" />;
    } else {
      return <AlertCircle className="h-6 w-6 text-red-400" />;
    }
  };

  const getIconForValue = (value: boolean) => {
    return value ? (
      <Check className="h-4 w-4 text-green-400" />
    ) : (
      <X className="h-4 w-4 text-red-400" />
    );
  };

  // Section divider
  const Divider = () => <div className="my-4" />;

  const getFallbackData = (type: string) => {
    switch (type) {
      case 'jobPostingAnalysis':
        return {
          message: 'No job posting analysis available. This might indicate a new or suspicious posting.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'communityInsights':
        return {
          message: 'No community insights available. This could be a new company or limited online presence.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'companyVerification':
        return {
          message: 'Limited company verification data available. Exercise caution.',
          icon: <AlertOctagon className="h-5 w-5 text-yellow-400" />
        };
      case 'technicalValidation':
        return {
          message: 'Technical validation data unavailable. Consider additional verification.',
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

  return (
    <div className="space-y-4">
      {/* Trust Score and Overall Analysis - only this card has top rounded corners */}
      <div className="glass-card pt-0 pb-6 px-0 sm:px-0 border-b border-white/10 shadow-xl bg-gradient-to-br from-blue-900/30 to-black/60 rounded-t-2xl rounded-b-none">
        <div className="p-6 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center space-x-4">
              {getScoreIcon(safeNumberAccess(result, ['trustScore']))}
              <div>
                <div className={`text-2xl sm:text-3xl font-bold ${getScoreColor(safeNumberAccess(result, ['trustScore']))}`}>
                  {safeNumberAccess(result, ['trustScore']).toFixed(2)}
                </div>
                <div className="text-white/60 text-sm font-medium">Trust Score</div>
              </div>
              {statusBadge(safeNumberAccess(result, ['trustScore']))}
            </div>
          </div>
          <div className="mt-6">
            <h4 className="text-lg sm:text-xl font-semibold text-white mb-2 tracking-wide">Overall Analysis</h4>
            <p className="text-white/80 text-base leading-relaxed">
              {safeAccess(result, ['reasoning'], 'No analysis available')}
            </p>
          </div>
        </div>
      </div>

      <Divider />

      {/* Job Posting Analysis */}
      <div className="glass p-6 rounded-2xl h-full shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Job Posting Analysis</h4>
          <button
            onClick={() => toggleSection('jobPostingAnalysis')}
            className="text-white/60 hover:text-white transition-transform duration-200"
            aria-label="Toggle Job Posting Analysis"
          >
            <span className={expandedSections.jobPostingAnalysis ? 'rotate-180 transition-transform' : 'transition-transform'}>
              {expandedSections.jobPostingAnalysis ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
          </button>
        </div>
        {expandedSections.jobPostingAnalysis && (
          <>
            {result.jobPostingAnalysis.crossPlatformPresence.length === 0 ? (
              <FallbackMessage type="jobPostingAnalysis" />
            ) : (
              <div className="space-y-6">
                {/* Consistency Analysis */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3">Consistency Check</h5>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Requirements</span>
                      {getIconForValue(result.jobPostingAnalysis.consistencyAnalysis.requirementsConsistent)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Salary Range</span>
                      {getIconForValue(result.jobPostingAnalysis.consistencyAnalysis.salaryRangeConsistent)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Contact Method</span>
                      {getIconForValue(result.jobPostingAnalysis.consistencyAnalysis.contactMethodConsistent)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Description Match</span>
                      <span className="text-white">{(result.jobPostingAnalysis.consistencyAnalysis.descriptionSimilarity * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  {result.jobPostingAnalysis.consistencyAnalysis.inconsistencies.length > 0 && (
                    <div className="mt-3 p-3 bg-red-500/10 rounded-lg">
                      <h6 className="text-red-400 text-sm font-medium mb-2">Inconsistencies Found:</h6>
                      <ul className="list-disc list-inside space-y-1">
                        {result.jobPostingAnalysis.consistencyAnalysis.inconsistencies.map((item: string, index: number) => (
                          <li key={index} className="text-white/70 text-sm">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Reposting Patterns */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3">Posting Pattern</h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Frequency</span>
                      <span className="text-white">{result.jobPostingAnalysis.repostingPatterns.frequency}</span>
                    </div>
                    <div>
                      <span className="text-white/70 block mb-2">Found on Platforms:</span>
                      <div className="flex flex-wrap gap-2">
                        {result.jobPostingAnalysis.repostingPatterns.platforms.map((platform, index) => (
                          <span key={index} className="px-2 py-1 bg-white/10 rounded-full text-white/80 text-sm">
                            {platform}
                          </span>
                        ))}
                      </div>
                    </div>
                    {result.jobPostingAnalysis.repostingPatterns.suspiciousPatterns.length > 0 && (
                      <div className="p-3 bg-yellow-500/10 rounded-lg">
                        <h6 className="text-yellow-400 text-sm font-medium mb-2">Suspicious Patterns:</h6>
                        <ul className="list-disc list-inside space-y-1">
                          {result.jobPostingAnalysis.repostingPatterns.suspiciousPatterns.map((pattern, index) => (
                            <li key={index} className="text-white/70 text-sm">{pattern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Market Alignment */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3">Market Alignment</h5>
                  
                  {/* Salary Analysis */}
                  <div className="mb-4">
                    <h6 className="text-white/80 text-sm font-medium mb-2">Salary Analysis</h6>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Range</span>
                        <span className="text-white">
                          {safeAccess<string>(result, ['jobPostingAnalysis', 'marketAlignment', 'salaryAnalysis', 'range'], 'Not available')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Market Comparison</span>
                        <span className="text-white">
                          {safeAccess<string>(result, ['jobPostingAnalysis', 'marketAlignment', 'salaryAnalysis', 'marketComparison'], 'Not available')}
                        </span>
                      </div>
                      
                      {/* Salary Sources */}
                      {(() => {
                        const sources = safeArrayAccess(safeAccess<SalarySource[]>(
                          result,
                          ['jobPostingAnalysis', 'marketAlignment', 'salaryAnalysis', 'sources'],
                          []
                        ));
                        
                        if (sources.length === 0) return null;
                        
                        return (
                          <div className="mt-3">
                            <h6 className="text-white/80 text-sm font-medium mb-2">Salary Sources</h6>
                            <div className="space-y-2">
                              {sources.map((source: SalarySource, index: number) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                  <span className="text-white/70">{source.platform}</span>
                                  <span className="text-white">{source.dataPoint}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  <div>
                    <h6 className="text-white/80 text-sm font-medium mb-2">Skills Analysis</h6>
                    <div className="space-y-3">
                      {/* Required Skills */}
                      {(() => {
                        const skills = safeArrayAccess(safeAccess<string[]>(
                          result,
                          ['jobPostingAnalysis', 'marketAlignment', 'skillsAnalysis', 'requiredSkills'],
                          []
                        ));
                        
                        if (skills.length === 0) return null;
                        
                        return (
                          <div>
                            <span className="text-white/70 block mb-2">Required Skills:</span>
                            <div className="flex flex-wrap gap-2">
                              {skills.map((skill: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-blue-500/10 rounded-full text-blue-400 text-sm">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })()}

                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Market Demand</span>
                        <span className="text-white">
                          {safeAccess<string>(result, ['jobPostingAnalysis', 'marketAlignment', 'skillsAnalysis', 'marketDemand'], 'Not available')}
                        </span>
                      </div>

                      {/* Unusual Requirements */}
                      {(() => {
                        const unusualReqs = safeArrayAccess(safeAccess<string[]>(
                          result,
                          ['jobPostingAnalysis', 'marketAlignment', 'skillsAnalysis', 'unusualRequirements'],
                          []
                        ));
                        
                        if (unusualReqs.length === 0) return null;
                        
                        return (
                          <div className="p-3 bg-yellow-500/10 rounded-lg">
                            <h6 className="text-yellow-400 text-sm font-medium mb-2">Unusual Requirements:</h6>
                            <ul className="list-disc list-inside space-y-1">
                              {unusualReqs.map((req: string, index: number) => (
                                <li key={index} className="text-white/70 text-sm">{req}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>

                {/* Cross-Platform Listings */}
                <div className="space-y-4">
                  <h5 className="font-medium text-white/90">Cross-Platform Listings</h5>
                  <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                    {result.jobPostingAnalysis.crossPlatformPresence.map((listing, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-white/90 font-medium">{listing.platform}</span>
                          <span className="text-white/60 text-sm">{formatDate(listing.postDate)}</span>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center text-sm">
                            <span className="text-white/70 mr-2">Salary:</span>
                            <span className="text-white">{listing.salary}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-white/70 mr-2">Application Method:</span>
                            <span className="text-white">{listing.applicationMethod}</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <span className="text-white/70 mr-2">Contact:</span>
                            <span className="text-white">{listing.contactInfo}</span>
                          </div>
                          <a
                            href={listing.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center mt-2"
                          >
                            View Listing
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Divider />

      {/* Community Insights */}
      <div className="glass p-6 rounded-2xl h-full shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Community Insights</h4>
          <button
            onClick={() => toggleSection('communityInsights')}
            className="text-white/60 hover:text-white transition-transform duration-200"
            aria-label="Toggle Community Insights"
          >
            <span className={expandedSections.communityInsights ? 'rotate-180 transition-transform' : 'transition-transform'}>
              {expandedSections.communityInsights ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
          </button>
        </div>
        {expandedSections.communityInsights && (
          <>
            {!result.communityInsights.overallSentiment.score ? (
              <FallbackMessage type="communityInsights" />
            ) : (
              <div className="space-y-6">
                {/* Overall Sentiment */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-medium text-white/90">Overall Sentiment</h5>
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${
                      result.communityInsights.overallSentiment.score >= 0.7
                        ? 'bg-green-500/20 text-green-400'
                        : result.communityInsights.overallSentiment.score >= 0.4
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {(result.communityInsights.overallSentiment.score * 100).toFixed(0)}%
                    </div>
                  </div>
                  <p className="text-white/70">{result.communityInsights.overallSentiment.summary}</p>
                </div>

                {/* Platform Feedback */}
                {result.communityInsights.platformFeedback.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="font-medium text-white/90">Platform Discussions</h5>
                    {result.communityInsights.platformFeedback.map((platform, index) => (
                      <div key={index} className="bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h6 className="text-white/80 font-medium">{platform.platform}</h6>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            platform.sentimentScore >= 0.7
                              ? 'bg-green-500/20 text-green-400'
                              : platform.sentimentScore >= 0.4
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {(platform.sentimentScore * 100).toFixed(0)}% Positive
                          </div>
                        </div>
                        <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                          {platform.recentDiscussions.map((discussion, idx) => (
                            <div key={idx} className="p-3 bg-white/5 rounded-lg border border-white/10">
                              <h6 className="text-white/90 text-sm font-medium mb-2">{discussion.title}</h6>
                              <p className="text-white/70 text-sm mb-2">{discussion.summary}</p>
                              {discussion.keyQuotes.length > 0 && (
                                <div className="space-y-2">
                                  {discussion.keyQuotes.map((quote, qIdx) => (
                                    <p key={qIdx} className="text-white/60 text-sm italic">"{quote}"</p>
                                  ))}
                                </div>
                              )}
                              <div className="flex justify-between items-center mt-2">
                                <a
                                  href={discussion.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  View Discussion
                                </a>
                                <span className="text-white/40 text-sm">{formatDate(discussion.date)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Employee Reviews */}
                {result.communityInsights.employeeReviews.totalReviews > 0 && (
                  <div className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <h5 className="font-medium text-white/90">Employee Reviews</h5>
                      <div className="flex items-center">
                        <span className="text-yellow-400 mr-1">★</span>
                        <span className="text-white font-medium">
                          {result.communityInsights.employeeReviews.aggregatedScore.toFixed(1)}
                        </span>
                        <span className="text-white/60 text-sm ml-2">
                          ({result.communityInsights.employeeReviews.totalReviews} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {result.communityInsights.employeeReviews.sources.map((source, index) => (
                        <div key={index} className="border-t border-white/10 pt-4 first:border-0 first:pt-0">
                          <div className="flex items-center justify-between mb-3">
                            <h6 className="text-white/80 font-medium">{source.platform}</h6>
                            <div className="flex items-center">
                              <span className="text-yellow-400 mr-1">★</span>
                              <span className="text-white">{source.rating.toFixed(1)}</span>
                              <span className="text-white/60 text-sm ml-2">({source.reviewCount})</span>
                            </div>
                          </div>
                          <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                            {source.recentReviews.map((review, idx) => (
                              <div key={idx} className="p-3 bg-white/5 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-white/80 text-sm">{review.position}</span>
                                  <span className="text-white/40 text-sm">{formatDate(review.date)}</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="text-green-400 text-sm">
                                    <span className="font-medium">Pros:</span> {review.pros}
                                  </div>
                                  <div className="text-red-400 text-sm">
                                    <span className="font-medium">Cons:</span> {review.cons}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Red Flags */}
                {result.communityInsights.redFlags.identified.length > 0 && (
                  <div className={`p-4 rounded-lg ${
                    result.communityInsights.redFlags.severity === 'high'
                      ? 'bg-red-500/10'
                      : result.communityInsights.redFlags.severity === 'medium'
                      ? 'bg-yellow-500/10'
                      : 'bg-orange-500/10'
                  }`}>
                    <h5 className="font-medium text-white/90 mb-3 flex items-center">
                      <AlertOctagon className="h-4 w-4 mr-2 text-red-400" />
                      Red Flags
                      <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                        result.communityInsights.redFlags.severity === 'high'
                          ? 'bg-red-500/20 text-red-400'
                          : result.communityInsights.redFlags.severity === 'medium'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {result.communityInsights.redFlags.severity.toUpperCase()} SEVERITY
                      </span>
                    </h5>
                    <p className="text-white/70 mb-3">{result.communityInsights.redFlags.explanation}</p>
                    <ul className="list-disc list-inside space-y-1">
                      {result.communityInsights.redFlags.identified.map((flag, index) => (
                        <li key={index} className="text-white/70 text-sm">{flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <Divider />

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
            {!safeAccess(result, ['repostingHistory', 'sources'], []).length ? (
              <FallbackMessage type="repostingHistory" />
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 font-medium">
                    {safeAccess(result, ['repostingHistory', 'summary'], 'No summary available')}
                  </p>
                  <p className="text-white/60 text-sm mt-2">
                    {safeAccess(result, ['repostingHistory', 'explanation'], '')}
                  </p>
                </div>
                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {safeArrayAccess(safeAccess(result, ['repostingHistory', 'sources'], [])).map((source: { url: string; title: string; platform: string; date: string }, index: number) => (
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

      <Divider />

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
            {!safeArrayAccess(safeAccess(result, ['communitySentiment', 'redditAnalysis'], [])).length && 
             !safeArrayAccess(safeAccess(result, ['communitySentiment', 'blindAnalysis'], [])).length && 
             !safeArrayAccess(safeAccess(result, ['communitySentiment', 'glassdoorAnalysis'], [])).length ? (
              <FallbackMessage type="communitySentiment" />
            ) : (
              <div className="space-y-4">
                <div className="bg-white/5 p-4 rounded-lg">
                  <p className="text-white/70 font-medium">
                    {safeAccess(result, ['communitySentiment', 'summary'], 'No community sentiment summary available')}
                  </p>
                </div>
                <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {/* Reddit Feedback */}
                  {(() => {
                    const redditAnalysis = safeArrayAccess(safeAccess(result, ['communitySentiment', 'redditAnalysis'], []));
                    if (!redditAnalysis.length) return null;
                    
                    return (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                          Reddit Feedback
                        </h5>
                        {redditAnalysis.map((analysis: { quote: string; url: string; date: string }, index: number) => (
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
                    );
                  })()}

                  {/* Blind Reviews */}
                  {(() => {
                    const blindAnalysis = safeArrayAccess(safeAccess(result, ['communitySentiment', 'blindAnalysis'], []));
                    if (!blindAnalysis.length) return null;
                    
                    return (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></span>
                          Blind Reviews
                        </h5>
                        {blindAnalysis.map((analysis: { quote: string; url: string; date: string }, index: number) => (
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
                    );
                  })()}

                  {/* Glassdoor Reviews */}
                  {(() => {
                    const glassdoorAnalysis = safeArrayAccess(safeAccess(result, ['communitySentiment', 'glassdoorAnalysis'], []));
                    if (!glassdoorAnalysis.length) return null;
                    
                    return (
                      <div className="space-y-3">
                        <h5 className="font-medium text-white/90 flex items-center">
                          <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                          Glassdoor Reviews
                        </h5>
                        {glassdoorAnalysis.map((analysis: { rating: number; review: string; url: string; date: string }, index: number) => (
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
                    );
                  })()}
                </div>
              </div>
            )}
          </>
        )}
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
            {!result.companyVerification.linkedInData.exists && 
             !result.companyVerification.domainAnalysis.hasCareerPage ? (
              <FallbackMessage type="companyVerification" />
            ) : (
              <>
                <div className="bg-white/5 p-4 rounded-lg mb-4">
                  <p className="text-white/70">{result.companyVerification.summary}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {/* LinkedIn Data */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white/90 mb-3 flex items-center">
                      <Building className="h-4 w-4 mr-2" />
                      LinkedIn Presence
                    </h5>
                    {result.companyVerification.linkedInData.exists ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Employees</span>
                          <span className="text-white">{result.companyVerification.linkedInData.employeeCount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Industry</span>
                          <span className="text-white">{result.companyVerification.linkedInData.industry}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Founded</span>
                          <span className="text-white">{result.companyVerification.linkedInData.foundedYear}</span>
                        </div>
                        <a
                          href={result.companyVerification.linkedInData.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm inline-flex items-center mt-2"
                        >
                          View Profile
                        </a>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">No LinkedIn presence found</p>
                    )}
                  </div>

                  {/* Crunchbase Data */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white/90 mb-3 flex items-center">
                      <Database className="h-4 w-4 mr-2" />
                      Crunchbase Data
                    </h5>
                    {result.companyVerification.crunchbaseData.exists ? (
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-white/70">Funding Status</span>
                          <span className="text-white">{result.companyVerification.crunchbaseData.fundingStatus}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Funding</span>
                          <span className="text-white">{result.companyVerification.crunchbaseData.totalFunding}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Last Funding</span>
                          <span className="text-white">{formatDate(result.companyVerification.crunchbaseData.lastFundingDate)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">No Crunchbase data found</p>
                    )}
                  </div>

                  {/* Domain Analysis */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white/90 mb-3 flex items-center">
                      <Globe className="h-4 w-4 mr-2" />
                      Domain Analysis
                    </h5>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Website Age</span>
                        <span className="text-white">{result.companyVerification.domainAnalysis.websiteAge}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Valid Email Domain</span>
                        {getIconForValue(result.companyVerification.domainAnalysis.emailDomainValid)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Secure Website</span>
                        {getIconForValue(result.companyVerification.domainAnalysis.hasSecureWebsite)}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-white/70">Career Page</span>
                        {getIconForValue(result.companyVerification.domainAnalysis.hasCareerPage)}
                      </div>
                    </div>
                  </div>

                  {/* Official Presence */}
                  <div className="bg-white/5 p-4 rounded-lg">
                    <h5 className="font-medium text-white/90 mb-3 flex items-center">
                      <Shield className="h-4 w-4 mr-2" />
                      Official Presence
                    </h5>
                    {result.companyVerification.officialPresence.platforms.length > 0 ? (
                      <div className="space-y-2">
                        {result.companyVerification.officialPresence.platforms.map((platform, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-white/70">{platform.name}</span>
                              {platform.verified && (
                                <Check className="h-3 w-3 text-green-400 ml-1" />
                              )}
                            </div>
                            <a
                              href={platform.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              View
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-white/60 text-sm">No official platforms found</p>
                    )}
                  </div>
                </div>
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
                      {result.jobDetails.crossPlatformComparison.map((comparison: { url: string; platform: string; date: string; title: string; salary?: string; requirements: string[] }, index: number) => (
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
                              {comparison.requirements.map((req: string, i: number) => (
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
                .sort((a, b) => b.relevance - a.relevance)
                .map((citation, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <span className={`text-sm ${citation.verified ? 'text-green-400' : 'text-white/60'}`}>
                      {citation.verified ? '✓' : '•'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <a
                        href={citation.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm block truncate"
                      >
                        {citation.title}
                      </a>
                      <div className="flex items-center mt-1">
                        <span className="text-white/40 text-xs">{citation.platform}</span>
                        <span className="text-white/20 mx-2">•</span>
                        <span className="text-white/40 text-xs">{formatDate(citation.date)}</span>
                        <span className="text-white/20 mx-2">•</span>
                        <span className="text-white/40 text-xs">
                          Relevance: {(citation.relevance * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      citation.type === 'company_profile'
                        ? 'bg-blue-500/20 text-blue-400'
                        : citation.type === 'job_board'
                        ? 'bg-green-500/20 text-green-400'
                        : citation.type === 'review_site'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : citation.type === 'community'
                        ? 'bg-purple-500/20 text-purple-400'
                        : citation.type === 'news'
                        ? 'bg-orange-500/20 text-orange-400'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {citation.type.replace('_', ' ').toUpperCase()}
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

      {/* Technical Validation */}
      <div className="glass p-6 rounded-2xl h-full shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h4 className="text-lg font-semibold text-white tracking-wide">Technical Validation</h4>
          <button
            onClick={() => toggleSection('technicalValidation')}
            className="text-white/60 hover:text-white transition-transform duration-200"
            aria-label="Toggle Technical Validation"
          >
            <span className={expandedSections.technicalValidation ? 'rotate-180 transition-transform' : 'transition-transform'}>
              {expandedSections.technicalValidation ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </span>
          </button>
        </div>
        {expandedSections.technicalValidation && (
          <>
            {!result.technicalValidation.domainAnalysis.websiteSSL ? (
              <FallbackMessage type="technicalValidation" />
            ) : (
              <div className="space-y-6">
                {/* Domain Analysis */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3 flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Domain Analysis
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Email Domain Age</span>
                      <span className="text-white">{result.technicalValidation.domainAnalysis.emailDomainAge}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">SPF Record</span>
                      {getIconForValue(result.technicalValidation.domainAnalysis.spfRecord)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">DKIM Valid</span>
                      {getIconForValue(result.technicalValidation.domainAnalysis.dkimValid)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">SSL Secure</span>
                      {getIconForValue(result.technicalValidation.domainAnalysis.websiteSSL)}
                    </div>
                  </div>
                </div>

                {/* Contact Validation */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3 flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    Contact Information
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Email Format</span>
                      <span className="text-white">{result.technicalValidation.contactValidation.emailFormat}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Phone Number</span>
                      {getIconForValue(result.technicalValidation.contactValidation.phoneNumberValid)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Physical Address</span>
                      <div className="flex items-center">
                        {getIconForValue(result.technicalValidation.contactValidation.physicalAddress.exists)}
                        {result.technicalValidation.contactValidation.physicalAddress.exists && (
                          <span className={`ml-2 text-sm ${
                            result.technicalValidation.contactValidation.physicalAddress.verified
                              ? 'text-green-400'
                              : 'text-yellow-400'
                          }`}>
                            {result.technicalValidation.contactValidation.physicalAddress.verified ? 'Verified' : 'Unverified'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Checks */}
                <div className="bg-white/5 p-4 rounded-lg">
                  <h5 className="font-medium text-white/90 mb-3 flex items-center">
                    <Lock className="h-4 w-4 mr-2" />
                    Security Analysis
                  </h5>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Malicious Link Check</span>
                      {getIconForValue(!result.technicalValidation.securityChecks.maliciousLinkCheck)}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-white/70">Phishing Risk</span>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        result.technicalValidation.securityChecks.phishingScore <= 0.3
                          ? 'bg-green-500/20 text-green-400'
                          : result.technicalValidation.securityChecks.phishingScore <= 0.7
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {(result.technicalValidation.securityChecks.phishingScore * 100).toFixed(0)}% Risk
                      </div>
                    </div>
                    {result.technicalValidation.securityChecks.suspiciousPatterns.length > 0 && (
                      <div className="mt-2">
                        <h6 className="text-red-400 text-sm font-medium mb-2">Suspicious Patterns Detected:</h6>
                        <ul className="list-disc list-inside space-y-1">
                          {result.technicalValidation.securityChecks.suspiciousPatterns.map((pattern, index) => (
                            <li key={index} className="text-white/70 text-sm">{pattern}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Divider />
    </div>
  );
};

export default JobAnalysisDetails; 