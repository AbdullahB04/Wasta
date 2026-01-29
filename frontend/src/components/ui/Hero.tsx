import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {Link} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import img from '../../assets/jeriden-villegas-VLPUm5wP5Z0-unsplash.jpg';
import img1 from '../../assets/eric-wang-umD2Bj4FmMU-unsplash.jpg';
import img2 from '../../assets/rafael-juarez-hTUdXgbhd3o-unsplash.jpg';
import img3 from '../../assets/benjamin-wedemeyer-bzzSg8hTKKY-unsplash.jpg';

const Hero: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const { i18n } = useTranslation();

  const images: string[] = [
    "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    img,
    img1,
    img2,
    img3,
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
                {i18n.t('findTrusted')} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  {i18n.t('localWorkers')}
                </span>
                <span className="text-slate-900"> {i18n.t('nearYou')}</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md leading-relaxed">
                {i18n.t('connectWithProfessionals')}
              </p>
            </div>

            {/* Compact Search Bar */}

            {/* Clean Buttons */}
            <div className="flex items-center gap-4 pt-2">
              <Link to="/register" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all text-sm shadow-md">
                {i18n.t('registerAsUser')}
              </Link>
              <Link to="/register?role=worker" className="px-6 py-3 text-slate-600 rounded-xl font-semibold border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all text-sm">
                {i18n.t('registerAsWorker')}
              </Link>
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