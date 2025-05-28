export interface JobAnalysisResult {
  trustScore: number;
  reasoning: string;
  repostingHistory: {
    summary: string;
    explanation: string;
  };
  communitySentiment: {
    summary: string;
    redditAnalysis: string;
    blindAnalysis: string;
  };
  companySignal: {
    summary: string;
    linkedInPresence: boolean;
    careerPageActive: boolean;
    explanation: string;
  };
  citations: string[];
  jobDetails: {
    realisticRequirements: boolean;
    salaryProvided: boolean;
    postingAge: string;
    repostedTimes: number;
    consistencyAcrossSites: boolean;
    explanation: string;
  };
} 