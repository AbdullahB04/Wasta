import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET ALL SERVICES (For the dropdown menu)
export const getCategories = async (req, res) => {
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
};

// GET ALL WORKERS WITH PAGINATION
export const getWorkers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    // Fetch paginated workers with only essential data
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
        feedbacks: {
          select: { rating: true }
        }
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.worker.count();

    // Calculate ratings in-memory (cleaner than before)
    const workersWithRating = workers.map(worker => {
      const ratings = worker.feedbacks.map(f => f.rating);
      const avgRating = ratings.length > 0
        ? parseFloat((ratings.reduce((a, r) => a + r, 0) / ratings.length).toFixed(1))
        : null;

      return {
        id: worker.id,
        firstName: worker.firstName,
        lastName: worker.lastName,
        phone: worker.phone,
        address: worker.address,
        image: worker.image,
        position: worker.position,
        isActive: worker.isActive,
        averageRating: avgRating,
        totalFeedbacks: ratings.length
      };
    });

    console.log(`✅ Fetched workers: page ${page}, items ${workersWithRating.length}/${total}`);
    res.json({
      data: workersWithRating,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page < Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('❌ Workers route error:', error);
    res.status(500).json({ error: 'Failed to fetch workers' });
  }
};

// GET WORKER BY ID
export const getWorkerById = async (req, res) => {
  try {
    const worker = await prisma.worker.findUnique({
      where: { id: req.params.id },
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
        feedbacks: {
          select: { rating: true }
        }
      }
    });

    if (!worker) {
      return res.status(404).json({ error: 'Worker not found' });
    }

    // Calculate average rating
    const ratings = worker.feedbacks.map(f => f.rating);
    const avgRating = ratings.length > 0
      ? parseFloat((ratings.reduce((a, r) => a + r, 0) / ratings.length).toFixed(1))
      : null;

    const result = {
      id: worker.id,
      firstName: worker.firstName,
      lastName: worker.lastName,
      phone: worker.phone,
      address: worker.address,
      image: worker.image,
      position: worker.position,
      bio: worker.bio,
      skills: worker.skills,
      languages: worker.languages,
      isActive: worker.isActive,
      averageRating: avgRating,
      totalFeedbacks: ratings.length
    };

    console.log('✅ Fetched worker:', result.id);
    res.json(result);
  } catch (error) {
    console.error('❌ Worker by ID route error:', error);
    res.status(500).json({ error: 'Failed to fetch worker' });
  }
};

// CREATE FEEDBACK
export const createFeedback = async (req, res) => {
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
};

// GET FEEDBACKS FOR A WORKER
export const getFeedbacks = async (req, res) => {
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
};

// HOME PAGE STATS
export const getStats = async (req, res) => {
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
};
