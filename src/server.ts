import dotenv from 'dotenv';
import app from './app';
import connectDB from './config/db';

dotenv.config();

const PORT = process.env.PORT || 8080;

// Connect to the database
connectDB();

// Start the server
app.listen(PORT, () => { 
  console.log(`Server running on port http://localhost:${PORT}`);
});
