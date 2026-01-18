import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  // Connection is now read from prisma.config.ts automatically
})

export default prisma