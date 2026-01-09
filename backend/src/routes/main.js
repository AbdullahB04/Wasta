import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

// HOME PAGE ROUTE - Get stats for landing page
router.get('/', async (req, res) => {
    try {
        // Get counts from database
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

// BROWSE WORKERS ROUTE - List all workers with basic info
router.get('/browse', async (req,res) => {
    const { search, address } = req.query
    const category = req.query.category || null;
    const where = {}
    if (search && search.length > 0 && search.trim() !== '') {
        where.OR = [
            {  firstName: { contains: search.trim(), mode: 'insensitive' } },
            {  lastName: { contains: search.trim(), mode: 'insensitive' } },
        ]
    }
    if (address && address.length > 0 && address.trim() !== '') {
        where.address = { contains: address.trim(), mode: 'insensitive' }
    }
    if (category && category.length > 0 && category.trim() !== '') {
        where.services = {
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

// WORKER DETAIL ROUTE - Get detailed info for a specific worker
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

                services: {
                    include: {
                        service: {
                            select: {
                                id: true,
                                name: true,
                                description: true
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
            data: {
                worker
            }
        });

    } catch (error) {
        console.error('Worker detail route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to load worker details'
        });
    }
})

// CATEGORIES ROUTE - List all service categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await prisma.service.findMany({
            select: {
                id: true,
                name: true,
                description: true
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

router.get('/how-it-works', (req, res) => {
    res.json('This route will explain how the service works.');
})

export default router;