export interface JobAnalysisResult {
  trustScore: number;
  reasoning: string;
  jobTitle: string;
  companyName: string;
  companyVerification: {
    summary: string;
    linkedInData: {
      exists: boolean;
      url: string;
      employeeCount: number;
      industry: string;
      foundedYear: string;
      lastUpdated: string;
    };
    crunchbaseData: {
      exists: boolean;
      fundingStatus: string;
      totalFunding: string;
      lastFundingDate: string;
      investors: string[];
    };
    domainAnalysis: {
      websiteAge: string;
      emailDomainValid: boolean;
      hasSecureWebsite: boolean;
      hasCareerPage: boolean;
    };
    officialPresence: {
      platforms: {
        name: string;
        url: string;
        verified: boolean;
        followers: number;
        lastActivity: string;
      }[];
    };
  };
  jobPostingAnalysis: {
    crossPlatformPresence: {
      platform: string;
      url: string;
      postDate: string;
      salary: string;
      requirements: string[];
      applicationMethod: string;
      contactInfo: string;
    }[];
    consistencyAnalysis: {
      requirementsConsistent: boolean;
      salaryRangeConsistent: boolean;
      contactMethodConsistent: boolean;
      descriptionSimilarity: number;
      inconsistencies: string[];
    };
    repostingPatterns: {
      frequency: string;
      platforms: string[];
      variations: string[];
      suspiciousPatterns: string[];
    };
    marketAlignment: {
      salaryAnalysis: {
        range: string;
        marketComparison: string;
        sources: {
          platform: string;
          dataPoint: string;
          date: string;
        }[];
      };
      skillsAnalysis: {
        requiredSkills: string[];
        marketDemand: string;
        unusualRequirements: string[];
      };
    };
  };
  communityInsights: {
    overallSentiment: {
      score: number;
      summary: string;
    };
    platformFeedback: {
      platform: string;
      sentimentScore: number;
      recentDiscussions: {
        title: string;
        url: string;
        date: string;
        summary: string;
        keyQuotes: string[];
      }[];
    }[];
    employeeReviews: {
      aggregatedScore: number;
      totalReviews: number;
      sources: {
        platform: string;
        rating: number;
        reviewCount: number;
        recentReviews: {
          date: string;
          rating: number;
          position: string;
          pros: string;
          cons: string;
        }[];
      }[];
    };
    redFlags: {
      identified: string[];
      explanation: string;
      severity: 'low' | 'medium' | 'high';
    };
  };
  technicalValidation: {
    domainAnalysis: {
      emailDomainAge: string;
      spfRecord: boolean;
      dkimValid: boolean;
      websiteSSL: boolean;
    };
    contactValidation: {
      emailFormat: string;
      phoneNumberValid: boolean;
      physicalAddress: {
        exists: boolean;
        verified: boolean;
      };
    };
    securityChecks: {
      maliciousLinkCheck: boolean;
      phishingScore: number;
      suspiciousPatterns: string[];
    };
  };
  citations: {
    type: 'company_profile' | 'job_board' | 'review_site' | 'community' | 'news' | 'technical';
    platform: string;
    url: string;
    title: string;
    date: string;
    relevance: number;
    verified: boolean;
  }[];
  analysisMetadata: {
    timestamp: string;
    dataSourcesUsed: string[];
    confidenceScore: number;
    limitationsNote: string;
  };
  repostingHistory: {
    summary: string;
    explanation: string;
    sources: {
      platform: string;
      url: string;
      title: string;
      date: string;
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
  jobDetails: {
    realisticRequirements: boolean;
    salaryProvided: boolean;
    postingAge: string;
    repostedTimes: number;
    consistencyAcrossSites: boolean;
    requirements: {
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
  dataSources: {
    companyInfo: Array<{
      source: string;
      url: string;
      lastUpdated: string;
    }>;
    jobPostingInfo: Array<{
      platform: string;
      url: string;
      postDate: string;
    }>;
    marketData: Array<{
      source: string;
      dataPoint: string;
      date: string;
    }>;
    communityFeedback: Array<{
      platform: string;
      reviewCount: number;
      lastUpdated: string;
    }>;
  };
}

export interface IJobAnalysisService {
  analyzeJob(jobTitle: string, companyName: string, jobLink?: string, location?: string): Promise<JobAnalysisResult>;
} 