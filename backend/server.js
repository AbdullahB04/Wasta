import express, { json } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';


// Setup
const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(json());

// API route
app.use('/', (await import('./src/routes/main.js')).default);

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Home route: http://localhost:${PORT}/`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
});
