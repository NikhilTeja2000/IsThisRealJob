import { Request, Response, NextFunction } from 'express';
import { PerplexityJobAnalysisService } from '../services/PerplexityJobAnalysisService.js';
import { AppError } from '../middleware/errorHandler.js';

const jobAnalysisService = new PerplexityJobAnalysisService();

export const jobController = {
  async factCheckJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { jobTitle, companyName, jobLink } = req.body;
      
      // Input validation
      if (!jobTitle || !companyName) {
        throw new AppError(400, 'Job title and company name are required');
      }

      // Get analysis from Perplexity API
      const result = await jobAnalysisService.analyzeJob(jobTitle, companyName, jobLink);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}; 