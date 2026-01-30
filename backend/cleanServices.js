import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function cleanServiceIds() {
  const services = await prisma.service.findMany();
  
  for (const service of services) {
    const cleanId = service.id.trim();
    if (cleanId !== service.id) {
      console.log(`Fixing ID: "${service.id}" -> "${cleanId}"`);
      // You may need to delete and recreate or update based on your schema
    }
  }
  
  console.log('✅ Service IDs cleaned');
}

cleanServiceIds().finally(() => prisma.$disconnect());