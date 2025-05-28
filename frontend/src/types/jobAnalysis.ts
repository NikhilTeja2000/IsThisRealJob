export interface JobAnalysisResult {
  trustScore: number;
  reasoning: string;

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
      platforms: Array<{
        name: string;
        url: string;
        verified: boolean;
        followers: number;
        lastActivity: string;
      }>;
    };
  };

  jobPostingAnalysis: {
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
      suspiciousPatterns: string[];
    };
    marketAlignment: {
      salaryAnalysis: {
        range: string;
        marketComparison: string;
      };
      skillsAnalysis: {
        requiredSkills: string[];
        marketDemand: string;
        unusualRequirements: string[];
      };
    };
    crossPlatformPresence: Array<{
      platform: string;
      postDate: string;
      salary: string;
      applicationMethod: string;
      contactInfo: string;
      url: string;
    }>;
  };

  communityInsights: {
    overallSentiment: {
      score: number;
      summary: string;
    };
    platformFeedback: Array<{
      platform: string;
      sentimentScore: number;
      recentDiscussions: Array<{
        title: string;
        summary: string;
        keyQuotes: string[];
        url: string;
        date: string;
      }>;
    }>;
    employeeReviews: {
      totalReviews: number;
      aggregatedScore: number;
      sources: Array<{
        platform: string;
        rating: number;
        reviewCount: number;
        recentReviews: Array<{
          position: string;
          pros: string;
          cons: string;
          date: string;
        }>;
      }>;
    };
    redFlags: {
      severity: 'low' | 'medium' | 'high';
      explanation: string;
      identified: string[];
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

  // Adding missing properties for reposting history
  repostingHistory: {
    summary: string;
    explanation: string;
    sources: Array<{
      platform: string;
      url: string;
      title: string;
      date: string;
    }>;
  };

  // Adding missing properties for community sentiment
  communitySentiment: {
    summary: string;
    redditAnalysis: Array<{
      sentiment: string;
      quote: string;
      url: string;
      date: string;
    }>;
    blindAnalysis: Array<{
      sentiment: string;
      quote: string;
      url: string;
      date: string;
    }>;
    glassdoorAnalysis: Array<{
      rating: number;
      review: string;
      url: string;
      date: string;
    }>;
  };

  // Adding missing properties for job details
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
    crossPlatformComparison: Array<{
      platform: string;
      url: string;
      title: string;
      requirements: string[];
      salary?: string;
      date: string;
    }>;
    explanation: string;
  };

  citations: Array<{
    title: string;
    url: string;
    platform: string;
    date: string;
    type: 'company_profile' | 'job_board' | 'review_site' | 'community' | 'news' | 'other';
    verified: boolean;
    relevance: number;
  }>;
} 