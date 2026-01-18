import express from 'express';
const router = express.Router();
import admin from 'firebase-admin';
import prisma from '../db/prisma.js';

// Middleware to verify Firebase token
const verifyFirebaseToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Registration should NOT require authentication
router.post('/register', async (req, res) => {
  console.log("1. Starting Registration...");
  console.log("2. Payload Received:", req.body);

  try {
    const { position, role, email, firstName, lastName, phone, address, password } = req.body;

    // Create Firebase user first
    console.log("3. Creating Firebase user...");
    const firebaseUser = await admin.auth().createUser({
      email,
      password,
      displayName: `${firstName} ${lastName}`
    });

    const firebaseUid = firebaseUser.uid;
    console.log("4. Firebase user created:", firebaseUid);

    // SAFETY CHECK: Verify the service exists before creating the worker
    if (role === 'WORKER') {
      if (!position) {
        return res.status(400).json({ error: "Position/Service ID is required for workers" });
      }

      const serviceExists = await prisma.service.findUnique({
        where: { id: position }
      });
      
      if (!serviceExists) {
        // Delete Firebase user if service validation fails
        await admin.auth().deleteUser(firebaseUid);
        return res.status(400).json({ error: "Invalid Service ID selected" });
      }
      
      console.log("5. Service ID validated:", serviceExists.name);
      
      // Create worker
      console.log("6. Creating worker in database...");
      const worker = await prisma.worker.create({
        data: {
          firebaseUid,
          email,
          firstName,
          lastName,
          phone,
          address,
          password,
          position: serviceExists.name,
          WorkerService: {
            create: {
              serviceId: position
            }
          }
        },
        include: {
          WorkerService: {
            include: {
              service: true
            }
          }
        }
      });
      
      console.log("7. Worker created successfully:", worker.id);
      return res.status(201).json(worker);
    }
    
    // Create regular user
    console.log("5. Creating user in database...");
    const user = await prisma.user.create({
      data: {
        firebaseUid,
        email,
        firstName,
        lastName,
        phone,
        address,
        password
      }
    });
    
    console.log("6. User created successfully:", user.id);
    res.status(201).json(user);
    
  } catch (error) {
    console.error("--------------------------------");
    console.error("!!! REGISTRATION ERROR !!!");
    console.error(error);
    console.error("--------------------------------");
    
    // Handle Firebase errors specifically
    if (error.code === 'auth/email-already-exists') {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    res.status(500).json({ error: error.message });
  }
});

// Get current user data
router.get('/me', verifyFirebaseToken, async (req, res) => {
  try {
    const firebaseUid = req.user.uid;

    // Try to find user in User table first
    let user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    // If not found, try Worker table
    if (!user) {
      user = await prisma.worker.findUnique({
        where: { firebaseUid },
        // Optional: Include services when fetching the profile
        include: {
            WorkerService: {
                include: { service: true }
            }
        }
      });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
});

export default router;