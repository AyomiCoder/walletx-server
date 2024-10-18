// types/express.d.ts

import { JwtPayload } from 'jsonwebtoken';
import { Request } from 'express';

// Extend the Request interface
declare module 'express-serve-static-core' {
  interface Request {
    user?: JwtPayload & { userId: string }; // Add user property with userId
  }
}
