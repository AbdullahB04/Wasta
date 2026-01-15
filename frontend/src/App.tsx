import Home from './components/pages/Home'
import HomeK from './components/pages/HomeK';
import Worker from './components/pages/Worker'
import WorkerK from './components/pages/workerK'
import Category from './components/pages/Category'
import CategoryK from './components/pages/CategoryK'
import WorkerPro from './components/pages/WorkerPro'
import Register from './components/pages/Register';
import RegisterK from './components/pages/RegisterK';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import LoginK from './components/pages/LoginK';
import WorkerDashboard from './components/pages/WorkerDash';
import WorkerDashboardK from './components/pages/WorkerDashK';
import UserDashboard from './components/pages/UserDash';
import UserDashboardK from './components/pages/UserDashK';


export default function App() {
  return (
    
    <BrowserRouter>
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

        <Route path="/login" element={<Login />} />
        <Route path="/LoginK" element={<LoginK />} />

        <Route path='/register' element={<Register />} />
        <Route path='/registerK' element={<RegisterK />} />
      </Routes>
    </BrowserRouter>
  )
}