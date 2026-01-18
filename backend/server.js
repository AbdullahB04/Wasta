import express, { json } from 'express';
import cors from 'cors';
import 'dotenv/config';
import admin from 'firebase-admin';
import serviceAccount from './firebase-admin-sdk.json' with { type: 'json' };
import prisma from './src/db/prisma.js'; // Import shared instance

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Setup
const app = express();
const PORT = process.env.PORT || 3000;

// Basic middleware
app.use(cors());
app.use(json());

// API routes
app.use('/', (await import('./src/routes/main.js')).default);
app.use('/api/auth', (await import('./src/routes/auth.js')).default);

// Start server
app.listen(PORT, async () => {
  try {
    await prisma.$connect();
    console.log('✅ Database connected');
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🏠 Home route: http://localhost:${PORT}/`);
    console.log(`🔐 Auth route: http://localhost:${PORT}/api/auth`);
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
});