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
      //const result = await jobAnalysisService.analyzeJob(jobTitle, companyName, jobLink);
      const result = {
        "trustScore": 0.6,
        "reasoning": "ODW Logistics appears to be a legitimate logistics company that has been in business since 1971. However, there are significant concerns about workplace culture, management, and employee satisfaction based on reviews. While the company exists and operates in the logistics sector, there is insufficient information specifically about the Software Engineer (Boomi Developer) position, and the negative employee reviews raise caution flags for potential applicants.",
        "repostingHistory": {
          "summary": "Limited information about job posting history",
          "explanation": "The search results don't provide specific information about the Software Engineer (Boomi Developer) role. However, they show that ODW Logistics regularly posts various positions across their locations.",
          "sources": [
            {
              "platform": "Indeed",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
              "date": "February 11, 2025",
              "title": "Various job listings including Operations Lead and Director positions"
            }
          ]
        },
        "communitySentiment": {
          "summary": "Generally negative employee sentiment with concerns about management, pay, and work environment",
          "redditAnalysis": [],
          "blindAnalysis": [],
          "glassdoorAnalysis": [
            {
              "rating": 2.8,
              "review": "The benefits are NOT good, all around I don't suggest making a Carrer there Seniority means nothing and there is no raise base on your performance there is a raise every year, but it is also the same amount for people that walk into work even if you have been there for years.",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
              "date": "February 11, 2025"
            },
            {
              "rating": 2.5,
              "review": "Management has no clue how to run ODW Waukesha. No working team effort. The pay is so behind the economy they hide it with cookies and pizzas.",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/faq/what-is-the-work-environment-and-culture-like-at-the-company?quid=1aqtc9ep2b85oa3h",
              "date": "August 23, 2016"
            },
            {
              "rating": 2.9,
              "review": "Bad culture. Slave driver management with bad pay.",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/faq/what-is-the-work-environment-and-culture-like-at-the-company?quid=1aqtc9ep2b85oa3h",
              "date": "August 23, 2016"
            }
          ]
        },
        "companySignal": {
          "summary": "ODW Logistics is an established logistics company with 53 years in business, but has concerning employee reviews",
          "linkedInPresence": {
            "exists": true,
            "url": "Not provided in search results",
            "employeeCount": 0,
            "industry": "Logistics & Transportation Management"
          },
          "careerPageActive": {
            "exists": true,
            "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
            "lastUpdated": "February 11, 2025"
          },
          "officialSources": [
            {
              "type": "indeed",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
              "title": "Working at ODW Logistics, Inc: 329 Reviews",
              "date": "February 11, 2025"
            },
            {
              "type": "other",
              "url": "https://www.bbb.org/us/oh/columbus/profile/logistics/odw-logistics-inc-0302-70087524",
              "title": "ODW Logistics, Inc. | BBB Business Profile",
              "date": "May 28, 2025"
            },
            {
              "type": "other",
              "url": "https://www.zippia.com/odw-logistics-careers-33512/",
              "title": "Working At ODW Logistics: Company Overview and Culture",
              "date": "May 28, 2025"
            }
          ],
          "explanation": "ODW Logistics is a legitimate company founded in 1971 and incorporated in December 1971. It has a physical headquarters in Columbus, OH and provides third-party logistics services across various industries. The company has profiles on major job platforms and the Better Business Bureau, though it is not BBB accredited. However, employee reviews trend negative, with consistent concerns about management and compensation."
        },
        "jobDetails": {
          "realisticRequirements": false,
          "salaryProvided": true,
          "postingAge": "Unknown for specific Software Engineer position",
          "repostedTimes": 0,
          "consistencyAcrossSites": false,
          "requirements": {
            "original": [],
            "analysis": "No specific requirements for the Software Engineer (Boomi Developer) position were found in the search results."
          },
          "salary": {
            "range": "$130,000 - $195,000 a year",
            "currency": "USD",
            "source": "Indeed listing for Director - Operations position (not the Software Engineer role)"
          },
          "crossPlatformComparison": [
            {
              "platform": "Indeed",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
              "title": "Director - Operations",
              "requirements": [],
              "salary": "$130,000 - $195,000 a year",
              "date": "6 days ago from February 11, 2025"
            },
            {
              "platform": "Indeed",
              "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
              "title": "Customer Service Representative",
              "requirements": [],
              "salary": "$19.75 an hour",
              "date": "3 days ago from February 11, 2025"
            }
          ],
          "explanation": "There is no specific information available about the Software Engineer (Boomi Developer) role in the search results. The salary provided is for a Director - Operations position, which would likely be significantly higher than for a Software Engineer role. Without specific details about the Software Engineer position, it's difficult to assess the legitimacy of the job requirements or compensation."
        },
        "citations": [
          {
            "type": "other",
            "url": "https://www.bbb.org/us/oh/columbus/profile/logistics/odw-logistics-inc-0302-70087524",
            "title": "ODW Logistics, Inc. | BBB Business Profile",
            "date": "May 28, 2025",
            "isOfficial": true
          },
          {
            "type": "indeed",
            "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/reviews",
            "title": "Working at ODW Logistics, Inc: 329 Reviews",
            "date": "February 11, 2025",
            "isOfficial": false
          },
          {
            "type": "indeed",
            "url": "https://www.indeed.com/cmp/Odw-Logistics,-Inc/faq/what-is-the-work-environment-and-culture-like-at-the-company?quid=1aqtc9ep2b85oa3h",
            "title": "What is the work environment and culture like at the company?",
            "date": "August 23, 2016",
            "isOfficial": false
          },
          {
            "type": "other",
            "url": "https://www.zippia.com/odw-logistics-careers-33512/",
            "title": "Working At ODW Logistics: Company Overview and Culture",
            "date": "May 28, 2025",
            "isOfficial": false
          },
          {
            "type": "other",
            "url": "https://www.inhersight.com/company/odw-logistics/ratings",
            "title": "ODW Logistics Reviews from Women",
            "date": "May 28, 2025",
            "isOfficial": false
          }
        ]
      }
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}; 