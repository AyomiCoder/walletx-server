import express from 'express';
import { register, login, addMoney, setPin } from '../controllers/authController';
import { getUserProfile } from '../controllers/authController';
import { validateAuth } from '../middlewares/validateAuth';

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

//get
router.get('/profile', validateAuth, getUserProfile);

// Add Money Route 
router.post('/fund', validateAuth, addMoney);

// Set PIN Route 
router.post('/set-pin', validateAuth, setPin);

export default router;
