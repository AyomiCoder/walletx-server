import express from 'express';
import { register, login } from '../controllers/authController';
import { getUserProfile } from '../controllers/authController';
import { validateAuth } from '../middlewares/validateAuth';

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

//get
router.get('/profile', validateAuth, getUserProfile);

export default router;
