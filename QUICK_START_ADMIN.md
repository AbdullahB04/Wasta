# 🎯 Quick Start: Admin Dashboard

## ✅ What Was Created

### 1. **Backend Admin Routes** (`backend/src/routes/admin.js`)
   - Dashboard statistics
   - User management (view, delete)
   - Worker management (view, activate/deactivate, delete)
   - Service category management (CRUD operations)
   - Feedback moderation (view, delete)

### 2. **Frontend Admin Dashboard** (`frontend/src/components/pages/AdminDash.tsx`)
   - Modern, responsive dashboard
   - 5 tabs: Overview, Users, Workers, Services, Feedback
   - Search and filtering
   - Real-time statistics

### 3. **Admin Creation Script** (`backend/createAdmin.js`)
   - Automated admin account creation
   - Firebase + Database integration

---

## 🚀 How to Create Your Admin Account

### Step 1: Navigate to Backend
```bash
cd backend
```

### Step 2: Run Admin Creation Script
```bash
npm run create-admin
```

**Default Credentials:**
- **Email:** `admin@wasta.com`
- **Password:** `Admin@123`

### Step 3: Login & Access Dashboard
1. Go to: `http://localhost:5173/login`
2. Login with admin credentials
3. Access dashboard: `http://localhost:5173/admin/dashboard`

---

## 🔐 Customizing Admin Credentials

Edit `backend/createAdmin.js` before running:

```javascript
const adminData = {
  email: 'your-email@company.com',  // ← Change this
  password: 'YourSecurePassword',    // ← Change this
  firstName: 'Your Name',            // ← Change this
  lastName: 'Your Surname'           // ← Change this
};
```

Then run: `npm run create-admin`

---

## 📊 What Can Admin Do?

### 1️⃣ **Dashboard Overview**
- See total users, workers, services
- View active/inactive worker counts
- Check average platform rating
- Monitor new user registrations

### 2️⃣ **User Management**
- View all registered users
- Search users by name/email
- See user feedback count
- Delete problematic users

### 3️⃣ **Worker Management**
- View all workers with ratings
- Search by name, position, location
- Activate/deactivate worker accounts
- Delete workers
- Monitor worker performance

### 4️⃣ **Service Categories**
- Add new service categories
- Edit category names
- Delete unused categories
- See how many workers use each service

### 5️⃣ **Feedback Moderation**
- View all platform reviews
- Search feedback
- Delete inappropriate reviews
- Monitor rating trends

---

## 🛡️ Security Features

✅ **Role-Based Access**: Only `ADMIN` role can access dashboard  
✅ **Auto-Redirect**: Non-admins are redirected if they try to access admin pages  
✅ **Protected Backend Routes**: Server-side role verification  
✅ **Firebase Authentication**: Secure authentication layer  

---

## 📁 Files Modified/Created

### Backend:
- ✅ `backend/src/routes/admin.js` (new)
- ✅ `backend/createAdmin.js` (new)
- ✅ `backend/server.js` (updated - added admin routes)
- ✅ `backend/package.json` (updated - added script)
- ✅ `backend/prisma/schema.prisma` (updated - role comment)

### Frontend:
- ✅ `frontend/src/components/pages/AdminDash.tsx` (new)
- ✅ `frontend/src/App.tsx` (updated - added route)
- ✅ `frontend/src/contexts/AuthContext.tsx` (updated - added role support)
- ✅ `frontend/src/components/pages/Login.tsx` (updated - redirect logic)

### Documentation:
- ✅ `ADMIN_SETUP.md` (detailed guide)
- ✅ `QUICK_START_ADMIN.md` (this file)

---

## 🎨 Admin Dashboard Features

| Feature | Description |
|---------|-------------|
| **Statistics Cards** | Real-time platform metrics |
| **User Table** | Searchable user list with actions |
| **Worker Management** | Activate/deactivate & delete workers |
| **Service CRUD** | Add, edit, delete categories |
| **Feedback View** | Monitor and moderate reviews |
| **Responsive Design** | Works on desktop & mobile |
| **Search & Filter** | Quick data lookup |

---

## 🔧 Troubleshooting

### "Access Denied" when accessing admin dashboard
➡️ **Solution:** Make sure you're logged in with an admin account (role = ADMIN)

### Admin creation script fails
➡️ **Solution:** 
- Check if backend server is running
- Verify Firebase Admin SDK is configured
- Check database connection

### Admin already exists
➡️ **Solution:** The script will update the existing user's role to ADMIN

---

## 💡 Next Steps

1. ✅ Create your admin account
2. ✅ Login and explore the dashboard
3. ✅ Customize admin credentials for production
4. ✅ Set up additional admin accounts if needed
5. ✅ Start managing your platform!

---

## 📞 Need Help?

Check the detailed guide: [ADMIN_SETUP.md](ADMIN_SETUP.md)

---

**🎉 That's it! You now have a fully functional admin dashboard.**
