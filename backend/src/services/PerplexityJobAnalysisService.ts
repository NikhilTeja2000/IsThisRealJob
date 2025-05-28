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
              content: 'You are a job verification expert. Analyze the job posting and provide detailed insights with explanations. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new AppError(response.status, `Perplexity API error: ${error.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError(500, 'Error analyzing job with Perplexity API');
    }
  }

  private generatePrompt(jobTitle: string, companyName: string, jobLink?: string): string {
    return `
Analyze this job posting and return a detailed breakdown in this exact JSON format:

Job Title: ${jobTitle}
Company: ${companyName}
${jobLink ? `Link: ${jobLink}` : ''}

Required JSON format:
{
  "trustScore": number (0.0 - 1.0),
  "reasoning": "Overall summary of the job's legitimacy.",
  "repostingHistory": {
    "summary": string,
    "explanation": string,
    "sources": [
      {
        "platform": string,
        "url": string,
        "date": string,
        "title": string
      }
    ]
  },
  "communitySentiment": {
    "summary": string,
    "redditAnalysis": [
      {
        "sentiment": string,
        "quote": string,
        "url": string,
        "date": string
      }
    ],
    "blindAnalysis": [
      {
        "sentiment": string,
        "quote": string,
        "url": string,
        "date": string
      }
    ],
    "glassdoorAnalysis": [
      {
        "rating": number,
        "review": string,
        "url": string,
        "date": string
      }
    ]
  },
  "companySignal": {
    "summary": string,
    "linkedInPresence": {
      "exists": boolean,
      "url": string,
      "employeeCount": number,
      "industry": string
    },
    "careerPageActive": {
      "exists": boolean,
      "url": string,
      "lastUpdated": string
    },
    "officialSources": [
      {
        "type": "career" | "linkedin" | "indeed" | "glassdoor" | "other",
        "url": string,
        "title": string,
        "date": string
      }
    ],
    "explanation": string
  },
  "jobDetails": {
    "realisticRequirements": boolean,
    "salaryProvided": boolean,
    "postingAge": string,
    "repostedTimes": number,
    "consistencyAcrossSites": boolean,
    "requirements": {
      "original": string[],
      "analysis": string
    },
    "salary": {
      "range": string,
      "currency": string,
      "source": string
    },
    "crossPlatformComparison": [
      {
        "platform": string,
        "url": string,
        "title": string,
        "requirements": string[],
        "salary": string,
        "date": string
      }
    ],
    "explanation": string
  },
  "citations": [
    {
      "type": "career" | "linkedin" | "indeed" | "glassdoor" | "reddit" | "blind" | "other",
      "url": string,
      "title": string,
      "date": string,
      "isOfficial": boolean
    }
  ]
}

IMPORTANT INSTRUCTIONS:
1. Always prioritize official sources (company career page, LinkedIn company page)
2. Include at least 3 different sources for each metric
3. For community sentiment, include actual quotes with dates
4. For job details, compare requirements and salary across platforms
5. Sort citations with official sources first
6. Include specific dates for all sources
7. Provide detailed explanations for each metric
8. Include actual URLs for all sources
9. For salary information, specify the source and date
10. For requirements, list the original requirements and analyze their realism

Focus on providing detailed explanations that help users understand why a job posting is considered legitimate or suspicious.
Include specific details about:
- How long the job has been posted
- Whether it's been reposted and why
- What the community is saying about it
- Whether the company's online presence is consistent
- If the job requirements and salary information seem realistic

IMPORTANT: Respond ONLY with the JSON object, no additional text.`;
  }

  async analyzeJob(jobTitle: string, companyName: string, jobLink?: string): Promise<JobAnalysisResult> {
    try {
      const prompt = this.generatePrompt(jobTitle, companyName, jobLink);
      const responseContent = await this.queryPerplexity(prompt);
      
      // Parse the JSON response from Perplexity
      const analysis = JSON.parse(responseContent);
      
      // Validate the response structure
      if (!this.isValidJobAnalysis(analysis)) {
        throw new AppError(500, 'Invalid response format from Perplexity API');
      }

      return analysis;
    } catch (error) {
      if (error instanceof SyntaxError) {
        throw new AppError(500, 'Failed to parse Perplexity API response');
      }
      throw error;
    }
  }

  private isValidJobAnalysis(data: any): data is JobAnalysisResult {
    return (
      typeof data === 'object' &&
      typeof data.trustScore === 'number' &&
      typeof data.reasoning === 'string' &&
      typeof data.repostingHistory === 'object' &&
      typeof data.communitySentiment === 'object' &&
      typeof data.companySignal === 'object' &&
      typeof data.jobDetails === 'object' &&
      Array.isArray(data.citations)
    );
  }
} 