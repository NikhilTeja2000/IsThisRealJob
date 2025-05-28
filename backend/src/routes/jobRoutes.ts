import express from 'express';
import { jobController } from '../controllers/jobController.js';

const router = express.Router();

// POST /api/jobs/fact-check
router.post('/fact-check', jobController.factCheckJob);

export { router as jobRoutes }; 