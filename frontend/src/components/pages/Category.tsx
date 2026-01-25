import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ArrowRight, Wrench, Zap, PaintBucket, Truck, Home, Hammer, Scissors, Car, TreePine, User } from 'lucide-react'; // Using Lucide for consistency
import SpotlightCard from "../ui/SpotlightCard"; // Keeping your component
import { Link } from 'react-router-dom';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import Footer from '../ui/Footer';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';

interface CategoryType {
  id: string;
  name: string;
}

const Category = () => {
  usePageTitle('Categories');
  const { dbUser } = useAuth();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/category');
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Map category names to icons
  const getIconForCategory = (name: string) => {
    const iconMap: { [key: string]: JSX.Element } = {
      'plumbing': <Wrench className="w-10 h-10 text-blue-500" />,
      'electrical': <Zap className="w-10 h-10 text-blue-500" />,
      'painting': <PaintBucket className="w-10 h-10 text-blue-500" />,
      'moving': <Truck className="w-10 h-10 text-blue-500" />,
      'cleaning': <Home className="w-10 h-10 text-blue-500" />,
      'landscaping': <TreePine className="w-10 h-10 text-blue-500" />,
      'gardening': <TreePine className="w-10 h-10 text-blue-500" />,
      'carpenter': <Hammer className="w-10 h-10 text-blue-500" />,
      'carpentry': <Hammer className="w-10 h-10 text-blue-500" />,
      'mechanic': <Car className="w-10 h-10 text-blue-500" />,
      'other': <Search className="w-10 h-10 text-blue-500" />,
    };
    
    const key = name.toLowerCase();
    return iconMap[key] || <Scissors className="w-10 h-10 text-blue-500" />;
  };
    const navItems = [
    {
      name: 'Home',
      link: '/',
    },
    {
      name: 'Workers',
      link: '/worker'
    },
    {
      name: 'Categories',
      link: '/category'
    }
  ]

    const getDashboardLink = () => {
    if (!dbUser) return '/Login';
    return dbUser.role === 'WORKER' ? '/worker/dashboard' : '/user/dashboard';
  };

  return (
    <div dir='ltr' className=" font-[Vazirmatn] min-h-screen bg-white">
          <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Vazirmatn:wght@100..900&display=swap');
        .font-[Vazirmatn] { font-family: 'Vazirmatn', sans-serif; }
    `}</style>

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
      
      {/* 1. Page Header (Clean & Airy) */}
      <section className="relative py-20 lg:py-28 mb-2 overflow-hidden bg-blue-50/50 border-transparent border-slate-200">
        {/* Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
              Explore  <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                Services
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
              Find skilled professionals for any service you need. From quick home repairs 
              to major renovations, we've got you covered.
            </p>
          </motion.div>
        </div>
      </section>

      {/* 2. The Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-8 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-500 mt-4">Loading categories...</p>
          </div>
        ) : categories.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 } // This creates the "pop-pop-pop" effect
              }
            }}
          >
            {categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
              >
                <Link to={`/worker?category=${cat.name.toLowerCase()}`}>
                  <SpotlightCard 
                    className="h-full bg-white border-solid border-[1px] border-blue-200 rounded-3xl shadow-sm hover:shadow-xl transition-all group cursor-pointer" 
                    spotlightColor="rgba(59, 130, 246, 0.1)" // Soft Blue Spotlight
                  >
                    <div className="p-8 flex flex-col items-center text-center h-full justify-center">
                      <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                        {getIconForCategory(cat.name)}
                      </div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                      
                      <span className="text-blue-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                        View Professionals <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </SpotlightCard>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No categories available</p>
          </div>
        )}
      </section>

      {/* 3. Bottom Call to Action (Refined) */}
<section className="py-24 bg-gradient-to-b from-slate-50 to-blue-100/50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          
          {/* The Card is now solid White to pop against the colored background */}
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white p-12 lg:p-16 text-center relative overflow-hidden">
            
            {/* Optional: Very subtle inner decorative blob for texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                Can't find what you're looking for?
              </h2>
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto">
                Browse our complete directory of skilled professionals and filter by specific skills, location, or rating.
              </p>
              
              <Link to="/worker"><button className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
                Browse All Workers
              </button></Link>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Category;