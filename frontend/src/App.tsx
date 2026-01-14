import Home from './components/pages/Home'
import Category from './components/pages/Category'
import Worker from './components/pages/Worker'
// import WorkerPro from './components/pages/WorkerPro'
import Register from './components/pages/Register';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Login from './components/pages/Login';
import WorkerDashboard from './components/pages/WorkerDash';
import UserDashboard from './components/pages/UserDash';

export default function App() {
  return (
    
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/worker" element={<Worker />} />
        <Route path="/worker/dashboard" element={<WorkerDashboard />} />
        <Route path="/category" element={<Category />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}