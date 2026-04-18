import express from 'express';
const router = express.Router();
import {
  verifyFirebaseToken,
  register,
  getCurrentUser,
  updateCurrentUser
} from '../controller/authController.js';

router.post('/register', register);
router.get('/me', verifyFirebaseToken, getCurrentUser);
router.put('/me', verifyFirebaseToken, updateCurrentUser);

export default router;