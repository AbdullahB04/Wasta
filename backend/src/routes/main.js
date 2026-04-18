import express from 'express';
import { 
  getCategories, 
  getWorkers, 
  getWorkerById, 
  createFeedback, 
  getFeedbacks, 
  getStats 
} from '../controller/mainController.js';

const router = express.Router();

// Services/Categories
router.get('/category', getCategories);

// Workers
router.get('/workers', getWorkers);
router.get('/workers/:id', getWorkerById);

// Feedbacks
router.post('/workers/:workerId/feedback', createFeedback);
router.get('/workers/:workerId/feedback', getFeedbacks);

// Stats
router.get('/', getStats);

export default router;