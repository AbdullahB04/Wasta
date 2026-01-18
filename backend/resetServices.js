import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function resetServices() {
  await prisma.service.deleteMany({});
  
  const services = ['plumbing', 'mechanic', 'painting', 'electrical', 'carpentry'];
  
  for (const name of services) {
    await prisma.service.create({ data: { name } });
  }
  
  console.log('✅ Services reset successfully');
}

resetServices().finally(() => prisma.$disconnect());