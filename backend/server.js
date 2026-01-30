import express from 'express';
import cors from 'cors';
import mainRoutes from './src/routes/main.js';
import authRoutes from './src/routes/auth.js';
import admin from 'firebase-admin';
import serviceAccount from './firebase-admin-sdk.json' with { type: 'json' };
// import prisma from './src/db/prisma.js'; // Import shared instance

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.use('/', mainRoutes); // This handles /workers
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});