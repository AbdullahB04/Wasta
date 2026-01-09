import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

const Hero: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const images: string[] = [
    "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <section id='hero' className="relative w-full bg-white flex items-center py-12 lg:py-16 overflow-hidden border-b border-slate-50">
      {/* Background blurs - smaller and more subtle */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* Left Side Content */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="space-y-3">
               <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Find trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  local workers
                </span>
                <span className="text-slate-900"> near you</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md leading-relaxed">
                Connect with vetted professionals for home and business needs. 
                Reliable help, just a click away.
              </p>
            </div>

            {/* Compact Search Bar */}
            <div className="relative max-w-lg">
              <div className="flex items-center bg-white rounded-xl p-1 shadow-lg shadow-blue-900/5 border border-slate-100 focus-within:ring-2 ring-blue-500/20 transition-all">
                <Search className="ml-3 w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Electrician, Plumber..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-3 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all active:scale-95">
                  Search
                </button>
              </div>
            </div>

            {/* Clean Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all text-sm shadow-md">
                Register as User
              </button>
              <button className="px-6 py-3 text-slate-600 rounded-xl font-semibold border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all text-sm">
                Register as Worker
              </button>
            </div>
          </motion.div>

          {/* Right Side Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Aspect ratio control keeps height from exploding */}
            <div className="relative z-10 rounded-[2rem] overflow-hidden aspect-[16/11] lg:aspect-[16/10] shadow-2xl border-4 border-white">
              <AnimatePresence mode="wait">
                <motion.img
                  key={index}
                  src={images[index]}
                  alt="Worker"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6 }}
                />
              </AnimatePresence>
            </div>
            
            {/* Subtle background detail */}
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-50 rounded-3xl -z-10 rotate-12" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;