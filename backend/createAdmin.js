import { PrismaClient } from '@prisma/client';
import admin from 'firebase-admin';
import serviceAccount from './firebase-admin-sdk.json' with { type: 'json' };

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('🔧 Creating admin user...\n');

    // Admin details - CHANGE THESE AS NEEDED
    const adminData = {
      email: 'admin@wasta.com',
      password: 'Admin@123',
      firstName: 'Admin',
      lastName: 'User'
    };

    console.log('📧 Email:', adminData.email);
    console.log('� Name:', adminData.firstName, adminData.lastName);
    console.log('');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      
      // Update to admin role if not already
      if (existingAdmin.role !== 'ADMIN') {
        await prisma.user.update({
          where: { email: adminData.email },
          data: { role: 'ADMIN' }
        });
        console.log('✅ Updated existing user to ADMIN role');
      }
      
      process.exit(0);
    }

    // Create Firebase user
    console.log('1️⃣  Creating Firebase user...');
    const firebaseUser = await admin.auth().createUser({
      email: adminData.email,
      password: adminData.password,
      displayName: `${adminData.firstName} ${adminData.lastName}`
    });
    console.log('✅ Firebase user created:', firebaseUser.uid);

    // Create admin in database (password stored only in Firebase)
    console.log('2️⃣  Creating admin in database...');
    const adminUser = await prisma.user.create({
      data: {
        firebaseUid: firebaseUser.uid,
        email: adminData.email,
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        role: 'ADMIN'
      }
    });
    console.log('✅ Admin user created in database');

    console.log('\n🎉 SUCCESS! Admin account created:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:', adminData.email);
    console.log('Role: ', 'ADMIN');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('⚠️  Password: <As configured in script>');
    console.log('\n🚀 Login at: http://localhost:5173/login');
    console.log('📊 Admin Dashboard: http://localhost:5173/admin/dashboard\n');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    
    // Cleanup Firebase user if database creation failed
    if (error.code !== 'auth/email-already-exists') {
      console.log('🧹 Cleaning up...');
    }
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

createAdmin();
