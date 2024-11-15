//src/controllers/authController.ts

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import dotenv from 'dotenv';
import Transaction from '../models/Transactions'; // Import the Transaction model

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

// Type for your request
type CustomRequest = Request & { user?: { userId: string } };

// Sign Up
export const register = async (req: Request, res: Response): Promise<void> => {
  const { fullName, username, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    // Generate a JWT token
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    // Return the token
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get User Profile
export const getUserProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized: No user found' });
      return;
    }

    const userId = req.user.userId;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// addMoney function
export const addMoney = async (req: CustomRequest, res: Response): Promise<void> => {
  const { amount } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.balance += amount;
    await user.save();

    // Create a transaction record
    // await Transaction.create({
    //   userId,
    //   type: 'credit',
    //   amount,
    //   createdAt: new Date(),
    // });
    await Transaction.create({
      userId: user._id,
      type: 'credit',
      amount: amount,
      description: 'E-funding',
      createdAt: new Date(),
    });

    res.status(200).json({ newBalance: user.balance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

//  sendMoney function
export const sendMoney = async (req: CustomRequest, res: Response): Promise<void> => {
  const { recipientUsername, pin, amount } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  try {
    const sender = await User.findById(userId);
    if (!sender) {
      res.status(404).json({ message: 'Sender not found' });
      return;
    }

    if (sender.pin !== pin) {
      res.status(400).json({ message: 'Invalid PIN' });
      return;
    }

    if (sender.balance < amount) {
      res.status(400).json({ message: 'Insufficient balance' });
      return;
    }

    const recipient = await User.findOne({ username: recipientUsername });
    if (!recipient) {
      res.status(404).json({ message: 'Recipient not found' });
      return;
    }

    // Deduct amount from sender and add to recipient
sender.balance -= amount;
recipient.balance += amount;

// Create transaction records for both sender and recipient
await Transaction.create({
  userId: sender._id,
  type: 'debit',
  amount: amount,
  description: `Sent to ${recipient.username}`
});

await Transaction.create({
  userId: recipient._id,
  type: 'credit',
  amount: amount,
  description: `from ${sender.username}`
});

// Save both sender and recipient
await sender.save();
await recipient.save();

    res.status(200).json({
      message: `Successfully sent ${amount} to ${recipientUsername}`,
      newBalance: sender.balance,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Set PIN
export const setPin = async (req: CustomRequest, res: Response): Promise<void> => {
  const { pin } = req.body;

  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    user.pin = pin; // Store the PIN
    await user.save();

    res.status(200).json({ message: 'PIN set successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit Profile
export const editProfile = async (req: CustomRequest, res: Response): Promise<void> => {
  const { fullName, profilePicture } = req.body; 
  const userId = req.user?.userId;

  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const updateData: any = { fullName };

    // Check if a file is uploaded via Cloudinary or if a profilePicture URL is provided
    if (req.file) {
      updateData.profilePicture = req.file.path; // Save Cloudinary URL
    } else if (profilePicture) {
      updateData.profilePicture = profilePicture; // Save directly from the request body
    }

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-balance -pin -password');;

    if (!user) {
       res.status(404).json({ message: 'User not found' });
       return;
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


export const getTransactionHistory = async (req: CustomRequest, res: Response): Promise<void> => {
  const userId = req.user?.userId;

  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const transactions = await Transaction.find({ userId }).sort({ date: -1 });

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
