// backend/test-db.js
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database!');
    
    // Test query
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Database query works!');
    
    // Check if tables exist
    const users = await prisma.user.findMany();
    const workers = await prisma.worker.findMany();
    
    console.log(`📊 Found ${users.length} users and ${workers.length} workers`);
    
    await prisma.$disconnect();
    console.log('✅ Database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();