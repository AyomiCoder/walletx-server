import express from 'express';
import { register, login, addMoney, setPin, sendMoney, editProfile, getTransactionHistory } from '../controllers/authController';
import { getUserProfile } from '../controllers/authController';
import { validateAuth } from '../middlewares/validateAuth';
import { upload } from '../middlewares/upload';

const router = express.Router();

// Register Route
router.post('/register', register);

// Login Route
router.post('/login', login);

// Get user profile route
router.get('/profile', validateAuth, getUserProfile);

// Add Money Route
router.post('/fund', validateAuth, addMoney);

// Set PIN Route
router.post('/set-pin', validateAuth, setPin);

// Send Money Route
router.post('/send-money', validateAuth, sendMoney);

// Edit Profile Route
router.put('/edit-profile', validateAuth, upload.single('profilePicture'), editProfile);

// Get Transaction History Route
router.get('/transaction-history', validateAuth, getTransactionHistory);
export default router;
