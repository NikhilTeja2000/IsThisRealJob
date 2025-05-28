export interface JobAnalysisResult {
  trustScore: number;
  reasoning: string;
  repostingHistory: {
    summary: string;
    explanation: string;
    sources: {
      platform: string;
      url: string;
      date: string;
      title: string;
    }[];
  };
  communitySentiment: {
    summary: string;
    redditAnalysis: {
      sentiment: string;
      quote: string;
      url: string;
      date: string;
    }[];
    blindAnalysis: {
      sentiment: string;
      quote: string;
      url: string;
      date: string;
    }[];
    glassdoorAnalysis: {
      rating: number;
      review: string;
      url: string;
      date: string;
    }[];
  };
  companySignal: {
    summary: string;
    linkedInPresence: {
      exists: boolean;
      url: string;
      employeeCount?: number;
      industry?: string;
    };
    careerPageActive: {
      exists: boolean;
      url: string;
      lastUpdated?: string;
    };
    officialSources: {
      type: 'career' | 'linkedin' | 'indeed' | 'glassdoor' | 'other';
      url: string;
      title: string;
      date: string;
    }[];
    explanation: string;
  };
  jobDetails: {
    realisticRequirements: boolean;
    salaryProvided: boolean;
    postingAge: string;
    repostedTimes: number;
    consistencyAcrossSites: boolean;
    requirements: {
      original: string[];
      analysis: string;
    };
    salary: {
      range?: string;
      currency?: string;
      source?: string;
    };
    crossPlatformComparison: {
      platform: string;
      url: string;
      title: string;
      requirements: string[];
      salary?: string;
      date: string;
    }[];
    explanation: string;
  };
  citations: {
    type: 'career' | 'linkedin' | 'indeed' | 'glassdoor' | 'reddit' | 'blind' | 'other';
    url: string;
    title: string;
    date: string;
    isOfficial: boolean;
  }[];
}

export interface IJobAnalysisService {
  analyzeJob(jobTitle: string, companyName: string, jobLink?: string): Promise<JobAnalysisResult>;
} 