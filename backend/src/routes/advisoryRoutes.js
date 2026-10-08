import express from 'express';
import {
  createAdvisory,
  getAdvisories,
  getAdvisoryById,
  deleteAdvisory,
  getAdvisoryAgents,
} from '../controllers/advisoryController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';
import { advisorySchema } from '../validators/advisoryValidators.js';

const router = express.Router();

router.use(protect); // All advisory routes require authentication

router.post('/', validate(advisorySchema), createAdvisory);
router.get('/', getAdvisories);
router.get('/:id', getAdvisoryById);
router.delete('/:id', deleteAdvisory);
router.get('/:id/agents', getAdvisoryAgents);

export default router;
