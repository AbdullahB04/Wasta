import { lazy, Suspense } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

// Lazy load all pages - only fetched when route is visited
const Home = lazy(() => import('./components/pages/Home'));
const HomeK = lazy(() => import('./components/pages/HomeK'));
const Worker = lazy(() => import('./components/pages/Worker'));
const WorkerK = lazy(() => import('./components/pages/workerK'));
const Category = lazy(() => import('./components/pages/Category'));
const CategoryK = lazy(() => import('./components/pages/CategoryK'));
const WorkerPro = lazy(() => import('./components/pages/WorkerPro'));
const Register = lazy(() => import('./components/pages/Register'));
const RegisterK = lazy(() => import('./components/pages/RegisterK'));
const Login = lazy(() => import('./components/pages/Login'));
const LoginK = lazy(() => import('./components/pages/LoginK'));
const WorkerDashboard = lazy(() => import('./components/pages/WorkerDash'));
const WorkerDashboardK = lazy(() => import('./components/pages/WorkerDashK'));
const UserDashboard = lazy(() => import('./components/pages/UserDash'));
const UserDashboardK = lazy(() => import('./components/pages/UserDashK'));
const AdminDashboard = lazy(() => import('./components/pages/AdminDash'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/K" element={<HomeK />} />

          <Route path="/worker" element={<Worker />} />
          <Route path="/workerK" element={<WorkerK />} />
          <Route path="/worker/:id" element={<WorkerPro />} />

          <Route path="/category" element={<Category />} />
          <Route path="/categoryK" element={<CategoryK />} />

          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/dashboardK" element={<UserDashboardK />} />

          <Route path="/worker/dashboard" element={<WorkerDashboard />} />
          <Route path="/worker/dashboardK" element={<WorkerDashboardK />} />

          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/login" element={<Login />} />
          <Route path="/LoginK" element={<LoginK />} />

          <Route path='/register' element={<Register />} />
          <Route path='/registerK' element={<RegisterK />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}