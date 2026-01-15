import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GrMapLocation } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import FooterK from '../ui/FooterK';
import { usePageTitle } from '../hooks/usePageTitle';


// --- Component: Hero ---
const Hero: React.FC = () => {
  const [index, setIndex] = useState<number>(0);

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
    <section className="relative w-full bg-white flex items-center py-12 lg:py-16 overflow-hidden border-b border-slate-50">
      {/* Background blurs */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-50/50 rounded-full blur-[100px] -z-10" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          
          {/* Right Side Content (Because RTL, this appears first logically) */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 text-right"
          >
            <div className="space-y-3">
               <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                دۆزینەوەی باشترین <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
                  وەستا و کرێکاری ناوەخۆیی
                </span>
                <span className="text-slate-900"> لە نزیک تۆ</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-md leading-relaxed ml-auto">
                پەیوەندی بکە بە وەستا شارەزاکان بۆ هەموو پێداویستییەکانی ماڵ و کار.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-start gap-4 pt-2">
              <Link to="/registerK" className="px-6 py-3 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 transition-all text-sm shadow-md">
                خۆ تۆمارکردن وەک بەکارهێنەر
              </Link>
              <Link to="/registerK?role=worker" className="px-6 py-3 text-slate-600 rounded-xl font-semibold border border-slate-200 hover:border-blue-500 hover:text-blue-600 transition-all text-sm">
                 خۆ تۆمارکردن وەک وەستا
              </Link>
            </div>
          </motion.div>

          {/* Left Side Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
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
            
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-50 rounded-3xl -z-10 -rotate-12" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

// --- Component: StickyScroll ---
const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<any>(null);
  
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end center"],
  });
  
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = [
    "#ffffff", 
    "#f8fafc", 
    "#f0f9ff", 
  ];

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      transition={{ duration: 0.5 }}
      className="h-[40rem] overflow-y-auto flex justify-center relative space-x-10 space-x-reverse rounded-3xl p-10 shadow-inner border border-slate-100 scrollbar-hide"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-24 lg:my-32 text-right">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-3xl lg:text-4xl font-bold text-slate-900"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="text-lg text-slate-500 max-w-sm mt-6 leading-relaxed ml-auto"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      
      {/* The Sticky Side */}
      <div
        className={cn(
          "hidden lg:block sticky top-20 h-80 w-80 rounded-3xl bg-white overflow-hidden",
          "shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-slate-100",
          contentClassName
        )}
      >
        <div className="h-full w-full flex items-center justify-center relative">
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 blur-2xl z-0" 
            />
            
            <div className="relative z-10 w-full h-full p-4">
               {content[activeCard].content ?? null}
            </div>
        </div>
      </div>
    </motion.div>
  );
};

// --- Component: CallToAction (CTA) ---
const CallToAction = () => {
  return (
    <section className="bg-white py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 shadow-2xl px-8 py-16 lg:px-20 lg:py-24 text-center"
        >
          
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-50 rounded-full blur-[100px] opacity-60" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              ئامادەیت بۆ <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">دەستپێکردن؟</span>
            </h2>

            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              بچۆرە ڕیزی هەزاران بەکارهێنەر و وەستای شارەزا. ئەمڕۆ خۆت تۆمار بکە بۆ بەدەستخستنی خزمەتگوزاری بێ کێشە.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              {/* Secondary Button */}
              <Link to="/registerK?role=worker">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                خۆت تۆماربکە
              </motion.button>
              </Link>

              {/* Primary Button */}
              <Link to="/workerK">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                وەستاکان ببینە
                {/* ArrowLeft is used for RTL "Forward" motion */}
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </motion.button>
              </Link>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// --- Component: Main Home ---
const content = [
  {
    title: 'گەڕان بەپێی شوێن',
    description: 'بە ئاسانی وەستا شارەزاکان لە ناوچەکەت بدۆزەرەوە بۆ هەر کارێک، گەورە یان بچووک.',
    content: (
      <div>
        <GrMapLocation size={150} className="text-sky-400 mx-auto mt-6" />
      </div>
    ),
  },
  { 
    title: 'بینینی پڕۆفایلەکان',
    description: 'پەیوەندی بەو وەستایانەوە بکە کە خاوەنی ئەزموون و پێشینەی کارکردنی نایابن.',
    content: (
      <div>
        <ImProfile size={180} className="text-sky-400 mx-auto mt-6" />
      </div>
    ),
  },
  {
    title: 'ڕێککەوتن و بەکرێگرتن',
    description: 'ڕاستەوخۆ قسە لەگەڵ وەستاکان بکە بۆ باسکردنی پێداویستییەکانت و بە متمانەوە دایانبمەزرێنە.',
    content: (
      <div>
        <IoChatbubbleEllipsesSharp size={180} className="text-sky-400 mx-auto mt-6" />
      </div>
    )
  },
]

const Home = () => {
    usePageTitle('سەرەکی')
  

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
  <div dir="rtl" className="font-nrt bg-white min-h-screen text-slate-900"> 

    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton variant="secondary">Login</NavbarButton> */}
            <Link to="/LoginK"><NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>چوونە ژوورەوە</NavbarButton></Link>
          </div>
    </NavBody>
    <section id='hero'>
      <Hero />
    </section>
    <section id='how-it-works'>
      <StickyScroll content={content} />
    </section>
    <section id='call-to-action'>
      <CallToAction />
    </section>
    <FooterK />
  </div>
  )
}

export default Home