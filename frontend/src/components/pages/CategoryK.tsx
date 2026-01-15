import { motion } from 'framer-motion';
import { Search, ArrowRight, Wrench, Zap, PaintBucket, Truck, Home } from 'lucide-react';
import SpotlightCard from "../ui/SpotlightCard";
import { Link } from 'react-router-dom';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import FooterK from '../ui/FooterK';
import { usePageTitle } from '../hooks/usePageTitle';


const Category = () => {
  usePageTitle('بەشەکان');
  
  const categories = [
    { name: "بۆڕیچی", icon: <Wrench className="w-10 h-10 text-blue-500" />, },
    { name: "کارەباچی", icon: <Zap className="w-10 h-10 text-blue-500" />, },
    { name: "بۆیەچی", icon: <PaintBucket className="w-10 h-10 text-blue-500" />, },
    { name: "گواستنەوە", icon: <Truck className="w-10 h-10 text-blue-500" />, },
    { name: "پاککرەوە", icon: <Home className="w-10 h-10 text-blue-500" /> },
    { name: "باخەوانی", icon: <Search className="w-10 h-10 text-blue-500" /> },
  ];

  const navItems = [
    {
        name: 'سەرەکی',
        link: '/K',
    },
    {
        name: 'وەستاکان',
        link: '/workerK'
    },
    {
        name: 'بەشەکان',
        link: '/categoryK'
    }
  ]

  return (
  <div dir='rtl' className="min-h-screen bg-white" style={{ fontFamily: 'nrt, sans-serif' }}>
    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <Link to="/LoginK"><NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>چوونە ژوورەوە</NavbarButton></Link>
          </div>
    </NavBody>
      
      {/* 1. Page Header (Clean & Airy) */}
      <section className="relative py-20 lg:py-28 mb-2 overflow-hidden bg-blue-50/50 border-transparent border-slate-200 ">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-50/50 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-relaxed font-nrt">
              گەڕان بە دوای  <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                 خزمەتگوزارییەکان 
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-nrt">
              بۆ هەر خزمەتگوزارییەک کە پێویستت پێیانە، کەسانی پسپۆڕی لێهاتوو بدۆزەرەوە.
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
              transition: { staggerChildren: 0.1 }
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
                spotlightColor="rgba(59, 130, 246, 0.1)"
              >
                <div className="p-8 flex flex-col items-center text-center h-full justify-center">
                  <div className="mb-6 p-4 bg-slate-50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                    {cat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-nrt">{cat.name}</h3>
                  
                  <span className="text-blue-600 font-semibold text-sm flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 font-nrt">
                    بینینی وەستاکان <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 3. Bottom Call to Action */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-blue-100/50 border-t border-slate-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-white p-12 lg:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
            
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4 font-nrt">
                    ئەوەی پێویستتە نەتدۆزیەوە ؟
              </h2>
              <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto font-nrt">
                بەدوای تەواوی وەستا لێهاتووەکانماندا بگەڕێ و بەپێی کارامەیی، شوێن، یان هەڵسەنگاندنی تایبەت گەڕان بکە
              </p>
              
              <Link to="/workerK"><button className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95 font-nrt">
                بینینی هەموو وەستاکان
              </button></Link>
            </div>
          </div>
        </div>
      </section>
      <FooterK />
    </div>
  );
};

export default Category;