import express from 'express';
import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware to verify Firebase token and check admin role
const verifyAdmin = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const token = req.headers.authorization?.split('Bearer ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    // Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;

    // Get user from database using firebaseUid
    const user = await prisma.user.findUnique({
      where: { firebaseUid }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }

    // Attach user to request for use in routes
    req.user = user;
    req.firebaseUser = decodedToken;
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid authentication token' });
  }
};

// ==================== DASHBOARD STATISTICS ====================

router.get('/stats', verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalWorkers, totalServices, totalFeedback, activeWorkers, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.worker.count(),
      prisma.service.count(),
      prisma.feedback.count(),
      prisma.worker.count({ where: { isActive: true } }),
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30))
          }
        }
      })
    ]);

    // Get feedback stats
    const feedbacks = await prisma.feedback.findMany({
      select: { rating: true }
    });

    const avgRating = feedbacks.length > 0 
      ? feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length 
      : 0;

    res.json({
      totalUsers,
      totalWorkers,
      totalServices,
      totalFeedback,
      activeWorkers,
      inactiveWorkers: totalWorkers - activeWorkers,
      recentUsers,
      avgRating: avgRating.toFixed(1)
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// ==================== USER MANAGEMENT ====================

router.get('/users', verifyAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firebaseUid: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            feedbacks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.delete('/users/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ==================== WORKER MANAGEMENT ====================

router.get('/workers', verifyAdmin, async (req, res) => {
  try {
    const workers = await prisma.worker.findMany({
      include: {
        WorkerService: {
          include: {
            service: true
          }
        },
        _count: {
          select: {
            feedbacks: true
          }
        },
        feedbacks: {
          select: {
            rating: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average rating for each worker
    const workersWithAvgRating = workers.map(worker => {
      const avgRating = worker.feedbacks.length > 0
        ? worker.feedbacks.reduce((sum, f) => sum + f.rating, 0) / worker.feedbacks.length
        : 0;

      return {
        ...worker,
        avgRating: avgRating.toFixed(1)
      };
    });

    res.json(workersWithAvgRating);
  } catch (error) {
    console.error('Get workers error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

router.patch('/workers/:id/toggle-active', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const worker = await prisma.worker.findUnique({
      where: { id },
      select: { isActive: true }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    const updatedWorker = await prisma.worker.update({
      where: { id },
      data: { isActive: !worker.isActive }
    });

    res.json(updatedWorker);
  } catch (error) {
    console.error('Toggle worker status error:', error);
    res.status(500).json({ error: 'Failed to update worker status' });
  }
});

router.delete('/workers/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete WorkerService relationships first
    await prisma.workerService.deleteMany({
      where: { workerId: id }
    });

    // Then delete the worker
    await prisma.worker.delete({
      where: { id }
    });

    res.json({ message: 'Worker deleted successfully' });
  } catch (error) {
    console.error('Delete worker error:', error);
    res.status(500).json({ error: 'Failed to delete worker' });
  }
});

// ==================== SERVICE/CATEGORY MANAGEMENT ====================

router.get('/services', verifyAdmin, async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        _count: {
          select: {
            WorkerService: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    res.json(services);
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

router.post('/services', verifyAdmin, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const service = await prisma.service.create({
      data: { name: name.trim() }
    });

    res.status(201).json(service);
  } catch (error) {
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

router.patch('/services/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Service name is required' });
    }

    const service = await prisma.service.update({
      where: { id },
      data: { name: name.trim() }
    });

    res.json(service);
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

router.delete('/services/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if service has workers
    const workerCount = await prisma.workerService.count({
      where: { serviceId: id }
    });

    if (workerCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete service. ${workerCount} worker(s) are using this service.` 
      });
    }

    await prisma.service.delete({
      where: { id }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

// ==================== FEEDBACK MANAGEMENT ====================

router.get('/feedbacks', verifyAdmin, async (req, res) => {
  try {
    const feedbacks = await prisma.feedback.findMany({
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true
          }
        },
        worker: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            position: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(feedbacks);
  } catch (error) {
    console.error('Get feedbacks error:', error);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

router.delete('/feedbacks/:id', verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.feedback.delete({
      where: { id }
    });

    res.json({ message: 'Feedback deleted successfully' });
  } catch (error) {
    console.error('Delete feedback error:', error);
    res.status(500).json({ error: 'Failed to delete feedback' });
  }
});

export default router;
