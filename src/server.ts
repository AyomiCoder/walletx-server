//src/server.ts

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // For parsing application/json

console.log('Mongo URI:', process.env.MONGO_URI)
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Routes
app.use('/api/auth', authRoutes);
app.get("/", (req, res) => {
  res.json({ data: "This is a fintech simulation web app that allows users to fund their accounts, send and receive money using usernames, and manage their profiles. The app secures user authentication with bcrypt and JWT. Users can also access detailed transaction histories, including credits, debits, and self-funding (E-funding).",
    link: "Access the link to test it here: https://documenter.getpostman.com/view/20451523/2sAXxY3oKB"
   });
});

// Start the server
const PORT = process.env.PORT; 
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
