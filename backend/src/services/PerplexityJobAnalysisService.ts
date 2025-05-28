import { config } from '../config/index.js';
import { IJobAnalysisService, JobAnalysisResult } from './interfaces/IJobAnalysisService.js';
import { AppError } from '../middleware/errorHandler.js';

export class PerplexityJobAnalysisService implements IJobAnalysisService {
  private async queryPerplexity(prompt: string): Promise<any> {
    try {
      const response = await fetch(config.perplexity.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.perplexity.apiKey}`
        },
        body: JSON.stringify({
          model: config.perplexity.model,
          messages: [
            {
              role: 'system',
              content: `You are an advanced job verification expert with access to multiple data sources.
              Analyze job postings thoroughly across various platforms and provide comprehensive insights.
              Focus on detecting potential scams, verifying legitimacy, and cross-referencing data.
              Always respond with valid JSON and include detailed evidence for each conclusion.
              IMPORTANT: Return ONLY the raw JSON object without any markdown formatting or code blocks.`
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Perplexity API error:', error);
        throw new AppError(response.status, `Perplexity API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.choices?.[0]?.message?.content) {
        console.error('Invalid Perplexity API response structure:', data);
        throw new AppError(500, 'Invalid response structure from Perplexity API');
      }

      let content = data.choices[0].message.content;
      
      // Remove any markdown code block markers if present
      content = content.replace(/^```json\n?/, '').replace(/\n?```$/, '');
      
      try {
        // Try to parse the content as JSON
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Failed to parse Perplexity API response content:', content);
        throw new AppError(500, 'Failed to parse Perplexity API response content as JSON');
      }
    } catch (error) {
      if (error instanceof AppError) throw error;
      console.error('Unexpected error in queryPerplexity:', error);
      throw new AppError(500, 'Error analyzing job with Perplexity API');
    }
  }

  private generatePrompt(jobTitle: string, companyName: string, jobLink?: string, location?: string): string {
    return `Analyze this job posting:

Job: ${jobTitle}
Company: ${companyName}
${jobLink ? `Link: ${jobLink}` : ''}
${location ? `Location: ${location}` : ''}

Required JSON format:
{
  "trustScore": number (0.0 - 1.0),
  "reasoning": "Detailed explanation of trust score calculation",
  "companyVerification": {
    "summary": string,
    "linkedInData": {
      "exists": boolean,
      "url": string,
      "employeeCount": number,
      "industry": string,
      "foundedYear": string,
      "lastUpdated": string
    },
    "crunchbaseData": {
      "exists": boolean,
      "fundingStatus": string,
      "totalFunding": string,
      "lastFundingDate": string,
      "investors": string[]
    },
    "domainAnalysis": {
      "websiteAge": string,
      "emailDomainValid": boolean,
      "hasSecureWebsite": boolean,
      "hasCareerPage": boolean
    },
    "officialPresence": {
      "platforms": [
        {
          "name": string,
          "url": string,
          "verified": boolean,
          "followers": number,
          "lastActivity": string
        }
      ]
    }
  },
  "jobPostingAnalysis": {
    "crossPlatformPresence": [
      {
        "platform": string,
        "url": string,
        "postDate": string,
        "salary": string,
        "requirements": string[],
        "applicationMethod": string,
        "contactInfo": string
      }
    ],
    "consistencyAnalysis": {
      "requirementsConsistent": boolean,
      "salaryRangeConsistent": boolean,
      "contactMethodConsistent": boolean,
      "descriptionSimilarity": number,
      "inconsistencies": string[]
    },
    "repostingPatterns": {
      "frequency": string,
      "platforms": string[],
      "variations": string[],
      "suspiciousPatterns": string[]
    },
    "marketAlignment": {
      "salaryAnalysis": {
        "range": string,
        "marketComparison": string,
        "sources": [
          {
            "platform": string,
            "dataPoint": string,
            "date": string
          }
        ]
      },
      "skillsAnalysis": {
        "requiredSkills": string[],
        "marketDemand": string,
        "unusualRequirements": string[]
      }
    }
  },
  "communityInsights": {
    "overallSentiment": {
      "score": number,
      "summary": string
    },
    "platformFeedback": [
      {
        "platform": string,
        "sentimentScore": number,
        "recentDiscussions": [
          {
            "title": string,
            "url": string,
            "date": string,
            "summary": string,
            "keyQuotes": string[]
          }
        ]
      }
    ],
    "employeeReviews": {
      "aggregatedScore": number,
      "totalReviews": number,
      "sources": [
        {
          "platform": string,
          "rating": number,
          "reviewCount": number,
          "recentReviews": [
            {
              "date": string,
              "rating": number,
              "position": string,
              "pros": string,
              "cons": string
            }
          ]
        }
      ]
    },
    "redFlags": {
      "identified": string[],
      "explanation": string,
      "severity": "low" | "medium" | "high"
    }
  },
  "technicalValidation": {
    "domainAnalysis": {
      "emailDomainAge": string,
      "spfRecord": boolean,
      "dkimValid": boolean,
      "websiteSSL": boolean
    },
    "contactValidation": {
      "emailFormat": string,
      "phoneNumberValid": boolean,
      "physicalAddress": {
        "exists": boolean,
        "verified": boolean
      }
    },
    "securityChecks": {
      "maliciousLinkCheck": boolean,
      "phishingScore": number,
      "suspiciousPatterns": string[]
    }
  },
  "citations": [
    {
      "type": "company_profile" | "job_board" | "review_site" | "community" | "news" | "technical",
      "platform": string,
      "url": string,
      "title": string,
      "date": string,
      "relevance": number,
      "verified": boolean
    }
  ],
  "analysisMetadata": {
    "timestamp": string,
    "dataSourcesUsed": string[],
    "confidenceScore": number,
    "limitationsNote": string
  }
}

ANALYSIS REQUIREMENTS:
1. Company Verification:
   - Cross-reference company details across LinkedIn, Crunchbase, and official sources
   - Verify domain age and email validity
   - Check social media presence and activity

2. Job Posting Analysis:
   - Compare posting across multiple job boards
   - Analyze salary ranges against market data
   - Check for suspicious reposting patterns
   - Validate requirements against industry standards

3. Community Insights:
   - Aggregate reviews from Glassdoor, Indeed, and Blind
   - Analyze recent discussions on Reddit and other forums
   - Look for patterns in employee feedback
   - Identify potential red flags

4. Technical Validation:
   - Verify email domain legitimacy
   - Check for secure website and communication channels
   - Analyze for potential phishing or scam patterns

5. Evidence Collection:
   - Include direct quotes and citations
   - Provide timestamps for all data points
   - Note confidence levels for each conclusion
   - Document any limitations in the analysis

RESPONSE GUIDELINES:
- Prioritize recent data (within last 6 months)
- Include confidence scores for each data point
- Flag any inconsistencies or suspicious patterns
- Provide detailed reasoning for trust score
- Include specific evidence for all conclusions

IMPORTANT: Respond ONLY with the JSON object, no additional text.`;
  }

  async analyzeJob(
    jobTitle: string,
    companyName: string,
    jobLink?: string,
    location?: string
  ): Promise<JobAnalysisResult> {
    try {
      const prompt = this.generatePrompt(jobTitle, companyName, jobLink, location);
      const responseContent = await this.queryPerplexity(prompt);
      
      // Validate the response structure
      if (!this.isValidJobAnalysis(responseContent)) {
        console.error('Invalid job analysis response structure:', responseContent);
        throw new AppError(500, 'Invalid response format from Perplexity API');
      }

      // Enrich the analysis with confidence scores
      return this.enrichAnalysis(responseContent);
    } catch (error) {
      console.error('Error in analyzeJob:', error);
      if (error instanceof SyntaxError) {
        throw new AppError(500, 'Failed to parse Perplexity API response');
      }
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(500, 'Unexpected error during job analysis');
    }
  }

  private convertToPercentage(value: number): number {
    return Math.round(value * 100);
  }

  private enrichAnalysis(analysis: JobAnalysisResult): JobAnalysisResult {
    // Add fallback values for undefined fields
    analysis.trustScore = analysis.trustScore || 0;
    analysis.reasoning = analysis.reasoning || 'Analysis pending';
    
    // Ensure company verification data exists
    analysis.companyVerification = {
      summary: analysis.companyVerification?.summary || 'Company information pending verification',
      linkedInData: {
        exists: analysis.companyVerification?.linkedInData?.exists || false,
        url: analysis.companyVerification?.linkedInData?.url || '#',
        employeeCount: analysis.companyVerification?.linkedInData?.employeeCount || 0,
        industry: analysis.companyVerification?.linkedInData?.industry || 'Not specified',
        foundedYear: analysis.companyVerification?.linkedInData?.foundedYear || 'Not available',
        lastUpdated: analysis.companyVerification?.linkedInData?.lastUpdated || new Date().toISOString().split('T')[0]
      },
      crunchbaseData: {
        exists: analysis.companyVerification?.crunchbaseData?.exists || false,
        fundingStatus: analysis.companyVerification?.crunchbaseData?.fundingStatus || 'Not available',
        totalFunding: analysis.companyVerification?.crunchbaseData?.totalFunding || 'Not disclosed',
        lastFundingDate: analysis.companyVerification?.crunchbaseData?.lastFundingDate || 'Not available',
        investors: analysis.companyVerification?.crunchbaseData?.investors || []
      },
      domainAnalysis: {
        websiteAge: analysis.companyVerification?.domainAnalysis?.websiteAge || 'Not available',
        emailDomainValid: analysis.companyVerification?.domainAnalysis?.emailDomainValid || false,
        hasSecureWebsite: analysis.companyVerification?.domainAnalysis?.hasSecureWebsite || false,
        hasCareerPage: analysis.companyVerification?.domainAnalysis?.hasCareerPage || false
      },
      officialPresence: {
        platforms: analysis.companyVerification?.officialPresence?.platforms || []
      }
    };

    // Ensure job posting analysis data exists
    analysis.jobPostingAnalysis = {
      crossPlatformPresence: analysis.jobPostingAnalysis?.crossPlatformPresence || [],
      consistencyAnalysis: {
        requirementsConsistent: analysis.jobPostingAnalysis?.consistencyAnalysis?.requirementsConsistent || false,
        salaryRangeConsistent: analysis.jobPostingAnalysis?.consistencyAnalysis?.salaryRangeConsistent || false,
        contactMethodConsistent: analysis.jobPostingAnalysis?.consistencyAnalysis?.contactMethodConsistent || false,
        descriptionSimilarity: analysis.jobPostingAnalysis?.consistencyAnalysis?.descriptionSimilarity || 0,
        inconsistencies: analysis.jobPostingAnalysis?.consistencyAnalysis?.inconsistencies || []
      },
      repostingPatterns: {
        frequency: analysis.jobPostingAnalysis?.repostingPatterns?.frequency || 'Not analyzed',
        platforms: analysis.jobPostingAnalysis?.repostingPatterns?.platforms || [],
        variations: analysis.jobPostingAnalysis?.repostingPatterns?.variations || [],
        suspiciousPatterns: analysis.jobPostingAnalysis?.repostingPatterns?.suspiciousPatterns || []
      },
      marketAlignment: {
        salaryAnalysis: {
          range: analysis.jobPostingAnalysis?.marketAlignment?.salaryAnalysis?.range || 'Not provided',
          marketComparison: analysis.jobPostingAnalysis?.marketAlignment?.salaryAnalysis?.marketComparison || 'Not available',
          sources: analysis.jobPostingAnalysis?.marketAlignment?.salaryAnalysis?.sources || []
        },
        skillsAnalysis: {
          requiredSkills: analysis.jobPostingAnalysis?.marketAlignment?.skillsAnalysis?.requiredSkills || [],
          marketDemand: analysis.jobPostingAnalysis?.marketAlignment?.skillsAnalysis?.marketDemand || 'Not analyzed',
          unusualRequirements: analysis.jobPostingAnalysis?.marketAlignment?.skillsAnalysis?.unusualRequirements || []
        }
      }
    };

    // Add sources tracking for each data point
    analysis.dataSources = {
      companyInfo: this.getCompanyInfoSources(analysis),
      jobPostingInfo: this.getJobPostingInfoSources(analysis),
      marketData: this.getMarketDataSources(analysis),
      communityFeedback: this.getCommunityFeedbackSources(analysis)
    };

    // Convert scores to percentages
    analysis.trustScore = this.convertToPercentage(analysis.trustScore);
    analysis.communityInsights.overallSentiment.score = this.convertToPercentage(
      analysis.communityInsights?.overallSentiment?.score || 0
    );
    
    if (analysis.communityInsights?.platformFeedback) {
      analysis.communityInsights.platformFeedback.forEach(platform => {
        platform.sentimentScore = this.convertToPercentage(platform.sentimentScore || 0);
      });
    }

    // Calculate overall confidence based on data completeness
    const confidenceFactors = {
      companyVerification: this.calculateCompanyVerificationConfidence(analysis.companyVerification),
      jobPostingAnalysis: this.calculateJobPostingConfidence(analysis.jobPostingAnalysis),
      communityInsights: this.calculateCommunityInsightsConfidence(analysis.communityInsights),
      technicalValidation: this.calculateTechnicalValidationConfidence(analysis.technicalValidation)
    };

    // Update metadata with confidence calculations and convert to percentage
    analysis.analysisMetadata.confidenceScore = this.convertToPercentage(
      Object.values(confidenceFactors).reduce((sum, score) => sum + score, 0) / Object.keys(confidenceFactors).length
    );

    // Add reposting history
    analysis.repostingHistory = {
      summary: `Based on our analysis of ${analysis.jobPostingAnalysis.crossPlatformPresence.length} job boards`,
      explanation: analysis.jobPostingAnalysis.repostingPatterns.frequency,
      sources: analysis.jobPostingAnalysis.crossPlatformPresence.map(presence => ({
        platform: presence.platform,
        url: presence.url,
        title: `${analysis.jobTitle} at ${analysis.companyName}`,
        date: presence.postDate
      }))
    };

    // Add community sentiment
    analysis.communitySentiment = {
      summary: analysis.communityInsights.overallSentiment.summary,
      redditAnalysis: analysis.communityInsights.platformFeedback
        .filter(p => p.platform.toLowerCase() === 'reddit')
        .flatMap(p => p.recentDiscussions.map(d => ({
          sentiment: d.summary.includes('positive') ? 'positive' : 'neutral',
          quote: d.keyQuotes[0] || '',
          url: d.url,
          date: d.date
        }))),
      blindAnalysis: analysis.communityInsights.platformFeedback
        .filter(p => p.platform.toLowerCase() === 'blind')
        .flatMap(p => p.recentDiscussions.map(d => ({
          sentiment: d.summary.includes('positive') ? 'positive' : 'neutral',
          quote: d.keyQuotes[0] || '',
          url: d.url,
          date: d.date
        }))),
      glassdoorAnalysis: analysis.communityInsights.employeeReviews.sources
        .filter(s => s.platform.toLowerCase() === 'glassdoor')
        .flatMap(s => s.recentReviews.map(r => ({
          rating: r.rating,
          review: r.pros,
          url: '#',
          date: r.date
        })))
    };

    // Add job details
    analysis.jobDetails = {
      realisticRequirements: !analysis.jobPostingAnalysis.marketAlignment.skillsAnalysis.unusualRequirements.length,
      salaryProvided: analysis.jobPostingAnalysis.crossPlatformPresence.some(p => p.salary !== 'Not listed'),
      postingAge: this.calculatePostingAge(analysis.jobPostingAnalysis.crossPlatformPresence[0]?.postDate),
      repostedTimes: analysis.jobPostingAnalysis.crossPlatformPresence.length,
      consistencyAcrossSites: analysis.jobPostingAnalysis.consistencyAnalysis.requirementsConsistent,
      requirements: {
        analysis: `${analysis.jobPostingAnalysis.marketAlignment.skillsAnalysis.requiredSkills.length} required skills, market demand: ${analysis.jobPostingAnalysis.marketAlignment.skillsAnalysis.marketDemand}`
      },
      salary: {
        range: analysis.jobPostingAnalysis.marketAlignment.salaryAnalysis.range,
        currency: 'USD',
        source: analysis.jobPostingAnalysis.marketAlignment.salaryAnalysis.sources[0]?.platform || 'Market Analysis'
      },
      crossPlatformComparison: analysis.jobPostingAnalysis.crossPlatformPresence.map(presence => ({
        platform: presence.platform,
        url: presence.url,
        title: `${analysis.jobTitle} at ${analysis.companyName}`,
        requirements: presence.requirements,
        salary: presence.salary,
        date: presence.postDate
      })),
      explanation: analysis.jobPostingAnalysis.consistencyAnalysis.inconsistencies.join('. ')
    };

    return analysis;
  }

  private calculatePostingAge(postDate: string | undefined): string {
    if (!postDate) return 'Unknown';
    try {
      const posted = new Date(postDate);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays} days ago`;
      if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return 'Unknown';
    }
  }

  private calculateCompanyVerificationConfidence(data: any): number {
    // Implementation of confidence calculation for company verification
    let score = 0;
    let factors = 0;

    if (data.linkedInData.exists) {
      score += 0.3;
      factors++;
    }
    if (data.crunchbaseData.exists) {
      score += 0.2;
      factors++;
    }
    if (data.domainAnalysis.hasSecureWebsite) {
      score += 0.2;
      factors++;
    }
    if (data.officialPresence.platforms.length > 0) {
      score += 0.3;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  private calculateJobPostingConfidence(data: any): number {
    // Implementation of confidence calculation for job posting analysis
    let score = 0;

    if (data.consistencyAnalysis.requirementsConsistent) score += 0.25;
    if (data.consistencyAnalysis.salaryRangeConsistent) score += 0.25;
    if (data.crossPlatformPresence.length >= 2) score += 0.25;
    if (data.marketAlignment.salaryAnalysis.sources.length > 0) score += 0.25;

    return score;
  }

  private calculateCommunityInsightsConfidence(data: any): number {
    // Implementation of confidence calculation for community insights
    let score = 0;
    let factors = 0;

    if (data.employeeReviews.totalReviews > 0) {
      score += 0.4;
      factors++;
    }
    if (data.platformFeedback.length > 0) {
      score += 0.3;
      factors++;
    }
    if (data.redFlags.identified.length > 0) {
      score += 0.3;
      factors++;
    }

    return factors > 0 ? score / factors : 0;
  }

  private calculateTechnicalValidationConfidence(data: any): number {
    // Implementation of confidence calculation for technical validation
    let score = 0;

    if (data.domainAnalysis.spfRecord) score += 0.25;
    if (data.domainAnalysis.dkimValid) score += 0.25;
    if (data.domainAnalysis.websiteSSL) score += 0.25;
    if (data.contactValidation.emailFormat && data.contactValidation.phoneNumberValid) score += 0.25;

    return score;
  }

  private isValidJobAnalysis(data: any): data is JobAnalysisResult {
    return (
      typeof data === 'object' &&
      typeof data.trustScore === 'number' &&
      typeof data.reasoning === 'string' &&
      typeof data.companyVerification === 'object' &&
      typeof data.jobPostingAnalysis === 'object' &&
      typeof data.communityInsights === 'object' &&
      typeof data.technicalValidation === 'object' &&
      Array.isArray(data.citations) &&
      typeof data.analysisMetadata === 'object'
    );
  }

  private getCompanyInfoSources(analysis: JobAnalysisResult): Array<{source: string; url: string; lastUpdated: string}> {
    const sources = [];
    
    if (analysis.companyVerification?.linkedInData?.exists) {
      sources.push({
        source: 'LinkedIn',
        url: analysis.companyVerification.linkedInData.url,
        lastUpdated: analysis.companyVerification.linkedInData.lastUpdated
      });
    }

    if (analysis.companyVerification?.crunchbaseData?.exists) {
      sources.push({
        source: 'Crunchbase',
        url: '#',
        lastUpdated: analysis.companyVerification.crunchbaseData.lastFundingDate
      });
    }

    analysis.companyVerification?.officialPresence?.platforms?.forEach(platform => {
      sources.push({
        source: platform.name,
        url: platform.url,
        lastUpdated: platform.lastActivity
      });
    });

    return sources;
  }

  private getJobPostingInfoSources(analysis: JobAnalysisResult): Array<{platform: string; url: string; postDate: string}> {
    return analysis.jobPostingAnalysis?.crossPlatformPresence?.map(presence => ({
      platform: presence.platform,
      url: presence.url,
      postDate: presence.postDate
    })) || [];
  }

  private getMarketDataSources(analysis: JobAnalysisResult): Array<{source: string; dataPoint: string; date: string}> {
    return (analysis.jobPostingAnalysis?.marketAlignment?.salaryAnalysis?.sources || []).map(source => ({
      source: source.platform,
      dataPoint: source.dataPoint,
      date: source.date
    }));
  }

  private getCommunityFeedbackSources(analysis: JobAnalysisResult): Array<{platform: string; reviewCount: number; lastUpdated: string}> {
    const sources: Array<{platform: string; reviewCount: number; lastUpdated: string}> = [];
    
    analysis.communityInsights?.employeeReviews?.sources?.forEach(source => {
      sources.push({
        platform: source.platform,
        reviewCount: source.reviewCount,
        lastUpdated: source.recentReviews?.[0]?.date || 'Not available'
      });
    });

    return sources;
  }
} 