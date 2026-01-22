import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// 1. GET ALL SERVICES (For the dropdown menu)
router.get('/category', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true
      },
      orderBy: {
        id: 'asc'
      }
    });
    res.json(services);
  } catch (error) {
    console.error('Services route error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// 2. GET ALL WORKERS
router.get('/workers', async (req, res) => {
  try {
    const workers = await prisma.worker.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        phone: true,
        address: true,
        image: true,
        position: true,
        isActive: true,
        WorkerService: {
          include: {
            service: true
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
    const workersWithRating = workers.map(worker => {
      const ratings = worker.feedbacks.map(f => f.rating);
      const averageRating = ratings.length > 0 
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
        : null;
      
      const { feedbacks, ...workerData } = worker;
      return {
        ...workerData,
        averageRating: averageRating ? parseFloat(averageRating) : null,
        totalFeedbacks: ratings.length
      };
    });

    console.log('✅ Fetched workers:', workersWithRating.length);
    res.json(workersWithRating);
  } catch (error) {
    console.error('❌ Workers route error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

router.get('/workers/:id', async (req, res) => {
    try {
        const worker = await prisma.worker.findUnique({
            where: {
                id: req.params.id
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                image: true,
                position: true,
                bio: true,
                skills: true,
                languages: true,
                isActive: true,
                WorkerService: {
                    include: {
                        service: true
                    }
                },
                feedbacks: {
                    select: {
                        rating: true
                    }
                }
            }
        });

        if (!worker) {
            return res.status(404).json({ error: 'Worker not found' });
        }

        // Calculate average rating
        const ratings = worker.feedbacks.map(f => f.rating);
        const averageRating = ratings.length > 0 
            ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)
            : null;
        
        const { feedbacks, ...workerData } = worker;
        const workerWithRating = {
            ...workerData,
            averageRating: averageRating ? parseFloat(averageRating) : null,
            totalFeedbacks: ratings.length
        };

        console.log('✅ Fetched worker:', workerWithRating.id);
        res.json(workerWithRating);
    } catch (error) {
        console.error('❌ Worker by ID route error:', error);
        res.status(500).json({ error: 'Failed to fetch worker' });
    }
})

// 4. CREATE FEEDBACK
router.post('/workers/:workerId/feedback', async (req, res) => {
    try {
        const { workerId } = req.params;
        const { userId, rating, comment } = req.body;

        if (!userId || !rating) {
            return res.status(400).json({ error: 'userId and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Rating must be between 1 and 5' });
        }

        const feedback = await prisma.feedback.create({
            data: {
                workerId,
                userId,
                rating,
                comment: comment || null
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        image: true
                    }
                }
            }
        });

        console.log('✅ Created feedback:', feedback.id);
        res.json(feedback);
    } catch (error) {
        console.error('❌ Create feedback error:', error);
        res.status(500).json({ error: 'Failed to create feedback' });
    }
});

// 5. GET FEEDBACKS FOR A WORKER
router.get('/workers/:workerId/feedback', async (req, res) => {
    try {
        const { workerId } = req.params;

        const feedbacks = await prisma.feedback.findMany({
            where: {
                workerId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('✅ Fetched feedbacks for worker:', workerId, '- Count:', feedbacks.length);
        res.json(feedbacks);
    } catch (error) {
        console.error('❌ Get feedbacks error:', error);
        res.status(500).json({ error: 'Failed to fetch feedbacks' });
    }
});

// 6. HOME PAGE STATS
router.get('/', async (req, res) => {
  try {
    const totalWorkers = await prisma.worker.count();
    const totalUsers = await prisma.user.count();
    
    res.json({
      success: true,
      data: {
        totalWorkers,
        totalUsers
      }
    });
  } catch (error) {
    console.error('Home route error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;