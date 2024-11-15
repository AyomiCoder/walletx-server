//src/middlewares/validateAuth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET!;

interface CustomRequest extends Request {
  user?: { userId: string }; // Define the user property
}

// Middleware to validate JWT
export const validateAuth = (req: CustomRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'No token, authorization denied' });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.user = decoded; // Now TypeScript recognizes this
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
