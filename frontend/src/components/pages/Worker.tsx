import { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, ArrowLeft, User } from 'lucide-react';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar'; 
import { Link, useSearchParams } from 'react-router-dom';
import Footer from '../ui/Footer';
import BasicModal from '../ui/Animated-modal';
import Avatar from '@mui/material/Avatar';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';

interface WorkerType {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  image?: string;
  phone: string;
  address: string;
  averageRating?: number | null;
  totalFeedbacks?: number;
  isActive?: boolean;
}

const Worker = () => {
  usePageTitle('Workers');
  const { dbUser } = useAuth();
  const [searchParams] = useSearchParams();

  // Format phone number to 964 750 xxx xxxx
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length >= 12) {
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 9)} ${cleaned.slice(9)}`;
    } else if (cleaned.length >= 9) {
      // Format shorter numbers as best as possible
      return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    }
    return phone;
  };

  const [workers, setWorkers] = useState<WorkerType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(() => {
    // Get category from URL query parameter
    const categoryParam = searchParams.get('category');
    return categoryParam || "all";
  });
  const [selectedCity, setSelectedCity] = useState("all");

  // Check if coming from category page
  const isFromCategory = searchParams.has('category');

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
    { value: 'electrical', label: 'Electrician' },
    { value: 'carpenter', label: 'Carpenter' },
    { value: 'painting', label: 'Painter' },
    { value: 'cleaning', label: 'Cleaner' },
    { value: 'gardening', label: 'Gardener' },
    { value: 'moving', label: 'Mover' },
    { value: 'mechanic', label: 'Mechanic' },
    { value: 'other', label: 'Other' },
  ];

  // Get unique cities from workers
  const availableCities = ['all', ...Array.from(new Set(workers.map(w => w.address).filter(Boolean)))];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || 
                           worker.position?.toLowerCase() === selectedCategory.toLowerCase();
    
    const matchesCity = selectedCity === "all" || worker.address === selectedCity;
    
    return matchesSearch && matchesCategory && matchesCity;
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

  // If coming from category page, show simplified view
  if (isFromCategory) {
    return (
      <div dir='ltr' className="min-h-screen bg-slate-50/50">
        {/* Simple Header with Back Button */}
        <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/category" className="flex items-center gap-2 text-slate-700 hover:text-blue-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Categories</span>
            </Link>
            <h1 className="text-xl font-bold text-slate-900 capitalize">
              {selectedCategory} Professionals
            </h1>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Workers Grid Only */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          {filteredWorkers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredWorkers.map((worker) => (
                <div key={worker.id} className="group bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <Avatar 
                        alt={worker.firstName || 'Worker Avatar'} 
                        src={worker.image} 
                        sx={{ width: 64, height: 64, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {worker.firstName} {worker.lastName}
                      </h3>
                      <div className="flex flex-col gap-2 mt-1">
                        {worker.averageRating !== null && worker.averageRating !== undefined ? (
                          <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span className="text-slate-700">{worker.averageRating}</span>
                            <span className="text-slate-400">({worker.totalFeedbacks})</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full w-fit">
                            <Star className="w-3 h-3" />
                            <span>No ratings</span>
                          </div>
                        )}
                        
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold w-fit ${worker.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${worker.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                          {worker.isActive ? 'Available' : 'Not Available'}
                        </div>
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
                      <span className="text-sm text-slate-700">{formatPhone(worker.phone)}</span>
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate max-w-[100px]">{worker.address}</span>
                    </div>
                    
                    <div className="shrink-0">
                      <BasicModal workerId={worker.id}>
                        <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">
                          View Profile
                        </button>
                      </BasicModal>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <p className="text-slate-500 text-xl">No {selectedCategory} professionals found</p>
              <Link to="/category" className="inline-block mt-6 text-blue-600 hover:text-blue-700 font-semibold">
                ← Back to Categories
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  }

  return (
    <div dir='ltr' className="min-h-screen bg-slate-50/50">

      {/* Navbar Wrapper */}
      <div className="bg-white border-b border-slate-100">
    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {dbUser ? (
              <Link to={getDashboardLink()} className="relative group">
                {dbUser.image ? (
                  <img 
                    src={dbUser.image} 
                    alt={`${dbUser.firstName}'s profile`}
                    className="w-10 h-10 rounded-full object-cover border-2 border-blue-500 hover:border-cyan-500 transition-all cursor-pointer"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center border-2 border-blue-500 hover:border-cyan-500 transition-all cursor-pointer">
                    <User size={20} className="text-white" />
                  </div>
                )}
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
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl text-slate-700 text-sm font-semibold focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="all">All Cities</option>
                  {availableCities.filter(city => city !== 'all').map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
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
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {worker.firstName} {worker.lastName}
                  </h3>
                  <div className="flex flex-col gap-2 mt-1">
                    {worker.averageRating !== null && worker.averageRating !== undefined ? (
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span className="text-slate-700">{worker.averageRating}</span>
                        <span className="text-slate-400">({worker.totalFeedbacks})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-50 px-2 py-0.5 rounded-full w-fit">
                        <Star className="w-3 h-3" />
                        <span>No ratings</span>
                      </div>
                    )}
                    
                    {/* Active Status Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold w-fit ${worker.isActive ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${worker.isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
                      {worker.isActive ? 'Available' : 'Not Available'}
                    </div>
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
                  <span className="text-sm text-slate-700">{formatPhone(worker.phone)}</span>
                </div>
              </div>

              {/* Footer: Location & Action */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">{worker.address}</span>
                </div>
                
                <div className="shrink-0">
                  <BasicModal workerId={worker.id}>
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