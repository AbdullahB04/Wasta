import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, SlidersHorizontal } from 'lucide-react';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar'; 
import { Link } from 'react-router-dom';
import Footer from '../ui/Footer';
import BasicModal from '../ui/Animated-modal';
import Avatar from '@mui/material/Avatar';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';

interface WorkerType {
  id: number;
  firstName: string;
  lastName: string;
  position?: string;
  image?: string;
  phone: string;
  address: string;
}

const Worker = () => {
  usePageTitle('Workers');
    const { dbUser } = useAuth();

  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch('http://localhost:3000/workers'); // Changed from /api/workers
        const data = await response.json();
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    
    fetchWorkers();
  }, []);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'plumbing', label: 'Plumber' },
    { value: 'electrician', label: 'Electrician' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'painting', label: 'Painter' },
    { value: 'cleaning', label: 'Cleaner' },
    { value: 'gardening', label: 'Gardener' },
    { value: 'moving', label: 'Mover' },
    { value: 'mechanic', label: 'Mechanic' },
    { value: 'other', label: 'Other' },
  ];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           worker.position?.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  const navItems = [
    { name: 'Home', link: '/' },
    { name: 'Workers', link: '/worker' },
    { name: 'Categories', link: '/category' }
  ];

    const getDashboardLink = () => {
    if (!dbUser) return '/Login';
    return dbUser.role === 'WORKER' ? '/worker/dashboard' : '/user/dashboard';
  };

  return (
    <div dir='ltr' className="min-h-screen bg-slate-50/50">

      {/* Navbar Wrapper */}
      <div className="bg-white border-b border-slate-100">
    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {dbUser ? (
              <Link to={getDashboardLink()}>
                <NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>
                  {dbUser.role === 'WORKER' ? (
                    `${dbUser.firstName}'s Worker Dashboard`
                  ) : (
                    `${dbUser.firstName}'s Dashboard`
                  )}
                </NavbarButton>
              </Link>
            ) : (
              <Link to="/Login">
                <NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>
                  Sign in
                </NavbarButton>
              </Link>
            )}
          </div>
    </NavBody>
      </div>

      {/* Page Header & Search Section */}
      <section className="relative pt-16 pb-12 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-100/50 blur-[100px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Expert</span>
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              Browse top-rated professionals in your area tailored to your specific needs.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, skill, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl focus:bg-slate-50 focus:outline-none text-slate-900 placeholder:text-slate-400 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl text-slate-700 text-sm font-semibold focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-[160px]">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl text-slate-700 text-sm font-semibold focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="distance">Nearest First</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workers Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkers.map((worker) => (
            <div key={worker.id} className="group bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              {/* Header: MUI Avatar & Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative shrink-0">
                  {/* --- MUI AVATAR USED HERE --- */}
                  <Avatar 
                    alt={worker.firstName || 'Worker Avatar'} 
                    src={worker.image} 
                    sx={{ width: 64, height: 64, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {worker.firstName} {worker.lastName}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                    <Star className="w-3 h-3 fill-amber-400" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Profession:</span>
                  <span className="text-sm text-slate-700 font-medium">{worker.position || 'N/A'}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-400 uppercase shrink-0">Phone:</span>
                  <span className="text-sm text-slate-700">{worker.phone}</span>
                </div>
              </div>

              {/* Footer: Location & Action */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">{worker.address}</span>
                </div>
                
                <div className="shrink-0">
                  <BasicModal>
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                      View Profile
                    </button>
                  </BasicModal>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>
      
      <Footer />
    </div>
  );
};

export default Worker;