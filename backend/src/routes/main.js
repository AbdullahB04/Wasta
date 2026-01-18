import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// 1. GET ALL SERVICES (For the dropdown menu)
router.get('/services', async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true
      }
    });
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
});

// 2. HOME PAGE STATS
router.get('/', async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const totalWorkers = await prisma.worker.count();
            
        res.json({
            success: true,
            data: {
                totalClients: totalUsers,
                totalWorkers: totalWorkers,
                message: 'Welcome to our service platform!'
            }
        })
    } catch (error) {
        console.error('Home route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load home page data'
        });
    }
})

// 3. BROWSE WORKERS (With correct filtering)
router.get('/browse', async (req,res) => {
    const { search, address } = req.query
    const category = req.query.category || null;
    
    const where = {}
    
    // Search by Name
    if (search && search.trim() !== '') {
        where.OR = [
            { firstName: { contains: search.trim(), mode: 'insensitive' } },
            { lastName: { contains: search.trim(), mode: 'insensitive' } },
        ]
    }
    
    // Search by Address
    if (address && address.trim() !== '') {
        where.address = { contains: address.trim(), mode: 'insensitive' }
    }

    // Search by Category (FIXED: Uses WorkerService)
    if (category && category.trim() !== '') {
        where.WorkerService = {
            some: {
                service: {
                    name: { contains: category, mode: 'insensitive' }
                }
            }
        };
    }

    try {
        const workers = await prisma.worker.findMany({
            where,
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                phone: true,
                address: true,
                bio: true,
                // Include the service names in the list so you can display tags like "Plumber"
                WorkerService: {
                    select: {
                        service: {
                            select: { name: true }
                        }
                    }
                }
            }
        })

        res.json({
            success: true,
            data: {
                workers: workers,
                totalWorkers: workers.length,
                filters: { search, address, category }
            }
        })
    } catch (error) {
        console.error('Browse route error:', error);
        res.status(500).json({  
            success: false,
            error: 'Failed to load workers data'
        });
    }
})

// 4. WORKER DETAIL (With correct relationship inclusion)
router.get("/worker/:id", async (req,res) => {
    const { id } = req.params;

    try {
        const worker = await prisma.worker.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                phone: true,
                address: true,
                bio: true,
                
                // FIXED: Uses WorkerService
                WorkerService: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                name: true,
                                // description: true // Uncomment if your schema has this
                            }
                        }
                    }
                }
            }
        });

        if(!worker) {
            return res.status(404).json({
                success: false,
                error: 'Worker not found'
            });
        }

        res.json({
            success: true,
            data: { worker }
        });

    } catch (error) {
        console.error('Worker detail route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load worker details'
        });
    }
})

// 5. CATEGORIES LIST
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.service.findMany({
            select: {
                id: true,
                name: true,
                // description: true
            }
        });

        res.json({
            success: true,
            data: {
                categories: categories,
                totalCategories: categories.length
            }
        });
    } catch (error) {
        console.error('Categories route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load categories data'
        });
    }
})

export default router;