import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// 1. GET ALL SERVICES (For the dropdown menu)
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      select: {
        id: true,
        name: true
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
        // age: true,
        WorkerService: {
          include: {
            service: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('✅ Fetched workers:', workers.length);
    res.json(workers);
  } catch (error) {
    console.error('❌ Workers route error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
});

router.get('/workers/:id', async (req, res) => {
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
                bio: true,
                WorkerService: {
                    include: {
                        service: true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        })
        res.json(workers);
    } catch (error) {
        console.error('❌ Workers route error:', error);
        res.status(500).json({ error: 'Failed to fetch workers' });
    }
})

// 3. HOME PAGE STATS
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