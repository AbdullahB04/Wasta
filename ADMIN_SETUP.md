# Admin Dashboard Setup Guide

## 🎯 Overview
The admin dashboard allows administrators to manage the entire Wasta platform, including users, workers, services, and feedback.

## 🔑 Admin Features

### Dashboard Overview
- **Statistics**: Total users, workers, services, feedback count
- **Quick Stats**: Active/inactive workers, recent users, average rating

### User Management
- View all registered users
- Search users by name or email
- View user feedback count
- Delete users

### Worker Management
- View all workers with ratings
- Search workers by name, email, or position
- Activate/deactivate worker accounts
- Delete workers
- View worker statistics

### Service Category Management
- Add new service categories
- Edit existing categories
- Delete unused categories
- View worker count per category

### Feedback Moderation
- View all platform feedback/reviews
- Search feedback by user or worker
- Delete inappropriate reviews
- Monitor ratings and comments

---

## 📋 Setup Instructions

### Step 1: Create Admin Account

Run the admin creation script from the backend directory:

```bash
cd backend
node createAdmin.js
```

**Default Admin Credentials:**
- Email: `admin@wasta.com`
- Password: `Admin@123`

**⚠️ IMPORTANT**: Change these credentials in `createAdmin.js` before running in production!

### Step 2: Customize Admin Credentials (Optional)

Edit `backend/createAdmin.js` and modify the admin data:

```javascript
const adminData = {
  email: 'your-admin@email.com',    // Change this
  password: 'YourSecurePassword',    // Change this
  firstName: 'Your First Name',      // Change this
  lastName: 'Your Last Name'         // Change this
};
```

### Step 3: Access Admin Dashboard

1. Start your backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Login at: `http://localhost:5173/login`
   - Use the admin email and password

4. Navigate to: `http://localhost:5173/admin/dashboard`

---

## 🛡️ Security Features

- **Role-Based Access**: Only users with `ADMIN` role can access the dashboard
- **Auto-Redirect**: Non-admin users are redirected if they try to access admin routes
- **Firebase Authentication**: Secure authentication layer
- **Protected Routes**: Backend routes check admin status

---

## 🚀 Usage Guide

### Managing Users
1. Go to "Users" tab
2. Use search to find specific users
3. Click trash icon to delete a user
4. View user statistics (feedback count, join date)

### Managing Workers
1. Go to "Workers" tab
2. Search by name, email, or position
3. Toggle worker status (Active/Inactive) using power button
4. Delete workers using trash icon
5. View ratings and feedback count

### Managing Services
1. Go to "Services" tab
2. Add new category: Type name → Click "Add"
3. Edit category: Click edit icon → Modify → Click checkmark
4. Delete category: Click trash icon (only if no workers use it)

### Moderating Feedback
1. Go to "Feedback" tab
2. Search reviews by user/worker name or comment
3. Delete inappropriate reviews using trash icon
4. Monitor rating distribution

---

## 📊 Admin Dashboard Routes

### Backend Routes (`/admin/*`)
- `GET /admin/stats` - Platform statistics
- `GET /admin/users` - All users
- `DELETE /admin/users/:id` - Delete user
- `GET /admin/workers` - All workers
- `PATCH /admin/workers/:id/toggle-active` - Toggle worker status
- `DELETE /admin/workers/:id` - Delete worker
- `GET /admin/services` - All services
- `POST /admin/services` - Create service
- `PATCH /admin/services/:id` - Update service
- `DELETE /admin/services/:id` - Delete service
- `GET /admin/feedbacks` - All feedback
- `DELETE /admin/feedbacks/:id` - Delete feedback

### Frontend Route
- `/admin/dashboard` - Admin dashboard page

---

## 🔧 Troubleshooting

### "Access Denied" Error
- Ensure the user role is set to `ADMIN` in the database
- Check if you're logged in with the correct account
- Verify backend admin routes are properly connected

### Admin Script Fails
- Check if Firebase Admin SDK is properly configured
- Ensure database connection is working
- Check if admin email already exists

### Can't Create Admin
- Verify `firebase-admin-sdk.json` exists
- Check database connection in `.env`
- Ensure bcrypt is installed: `npm install bcrypt`

---

## 💡 Best Practices

1. **Change Default Password**: Always change the default admin password
2. **Limit Admin Accounts**: Create admin accounts only for trusted staff
3. **Regular Monitoring**: Check feedback and user activity regularly
4. **Backup Before Deleting**: Deletions are permanent
5. **Service Management**: Don't delete services with active workers

---

## 🔐 Creating Additional Admins

To create more admin accounts:

1. **Option 1: Using the Script**
   - Modify `createAdmin.js` with new credentials
   - Run: `node createAdmin.js`

2. **Option 2: Manual Database Update**
   ```sql
   UPDATE users 
   SET role = 'ADMIN' 
   WHERE email = 'user@example.com';
   ```

---

## 📝 Future Enhancements

Potential features to add:
- [ ] Admin activity logs
- [ ] Bulk actions (delete multiple users)
- [ ] Export data to CSV
- [ ] Email notifications
- [ ] Worker approval workflow
- [ ] Analytics charts
- [ ] Commission/payment management
- [ ] Platform settings management

---

## ⚙️ Environment Variables

Ensure these are set in `backend/.env`:
```env
DATABASE_URL="your-database-url"
FIREBASE_PROJECT_ID="your-project-id"
```

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review backend console logs
3. Check browser console for frontend errors
4. Verify all dependencies are installed

---

**🎉 You're all set! Enjoy managing your platform with the admin dashboard.**
