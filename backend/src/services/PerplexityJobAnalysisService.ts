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
    "explanation": string
  },
  "communitySentiment": {
    "summary": string,
    "redditAnalysis": string,
    "blindAnalysis": string
  },
  "companySignal": {
    "summary": string,
    "linkedInPresence": boolean,
    "careerPageActive": boolean,
    "explanation": string
  },
  "citations": [string],
  "jobDetails": {
    "realisticRequirements": boolean,
    "salaryProvided": boolean,
    "postingAge": string,
    "repostedTimes": number,
    "consistencyAcrossSites": boolean,
    "explanation": string
  }
}

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
      Array.isArray(data.citations) &&
      typeof data.jobDetails === 'object'
    );
  }
} 