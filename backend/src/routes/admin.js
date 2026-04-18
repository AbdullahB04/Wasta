import express from 'express';
import {
  verifyAdmin,
  getStats,
  getUsers,
  deleteUser,
  getWorkers,
  toggleWorkerActive,
  deleteWorker,
  getServices,
  createService,
  updateService,
  deleteService,
  getFeedbacks,
  deleteFeedback
} from '../controller/adminController.js';

const router = express.Router();

// Dashboard statistics
router.get('/stats', verifyAdmin, getStats);

// User management
router.get('/users', verifyAdmin, getUsers);
router.delete('/users/:id', verifyAdmin, deleteUser);

// Worker management
router.get('/workers', verifyAdmin, getWorkers);
router.patch('/workers/:id/toggle-active', verifyAdmin, toggleWorkerActive);
router.delete('/workers/:id', verifyAdmin, deleteWorker);

// Service/category management
router.get('/services', verifyAdmin, getServices);
router.post('/services', verifyAdmin, createService);
router.patch('/services/:id', verifyAdmin, updateService);
router.delete('/services/:id', verifyAdmin, deleteService);

// Feedback management
router.get('/feedbacks', verifyAdmin, getFeedbacks);
router.delete('/feedbacks/:id', verifyAdmin, deleteFeedback);

export default router;
