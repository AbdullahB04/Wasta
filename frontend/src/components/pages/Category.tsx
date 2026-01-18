import { motion } from 'framer-motion';
import { Search, ArrowRight, Wrench, Zap, PaintBucket, Truck, Home } from 'lucide-react'; // Using Lucide for consistency
import SpotlightCard from "../ui/SpotlightCard"; // Keeping your component
import { Link } from 'react-router-dom';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import Footer from '../ui/Footer';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';



const Category = () => {
  usePageTitle('Categories');
  const { dbUser } = useAuth();
  
  // Example data to make the grid look real
  const categories = [
    { name: "Plumbing", icon: <Wrench className="w-10 h-10 text-blue-500" />,  },
    { name: "Electrical", icon: <Zap className="w-10 h-10 text-blue-500" />,  },
    { name: "Painting", icon: <PaintBucket className="w-10 h-10 text-blue-500" />,  },
    { name: "Moving", icon: <Truck className="w-10 h-10 text-blue-500" />,  },
    { name: "Cleaning", icon: <Home className="w-10 h-10 text-blue-500" />,  },
    { name: "Landscaping", icon: <Search className="w-10 h-10 text-blue-500" />,  },
  ];
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
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <SpotlightCard 
                className="h-full bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all group cursor-pointer" 
                spotlightColor="rgba(59, 130, 246, 0.1)" // Soft Blue Spotlight
              >
                <div className="p-8 flex flex-col items-center text-center h-full justify-center">
                  <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{cat.name}</h3>
                  {/* <p className="text-slate-400 font-medium mb-6">{cat.count}</p> */}
                  
                  <span className="text-blue-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                    View Professionals <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
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