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
router.get('/Browse', async (req,res) => {
    try {
        const workers = await prisma.worker.findMany({
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
                totalWorkers: workers.length
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