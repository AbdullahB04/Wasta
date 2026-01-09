import React, { useRef } from "react";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import { cn } from "../../lib/utils";

export const StickyScroll = ({
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

  // Soft, subtle background transitions instead of harsh dark mode colors
  const backgroundColors = [
    "#ffffff", // White
    "#f8fafc", // Slate-50
    "#f0f9ff", // Sky-50
  ];

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      transition={{ duration: 0.5 }}
      className="h-[40rem] overflow-y-auto flex justify-center relative space-x-10 rounded-3xl p-10 shadow-inner border border-slate-100 scrollbar-hide"
      ref={ref}
    >
      <div className="div relative flex items-start px-4 w-full lg:w-1/2">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-24 lg:my-32">
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
                className="text-lg text-slate-500 max-w-sm mt-6 leading-relaxed"
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      
      {/* The Sticky Right Side - Now a "Glass Card" */}
      <div
        className={cn(
          "hidden lg:block sticky top-20 h-80 w-80 rounded-3xl bg-white overflow-hidden",
          "shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-slate-100", // Glassy shadow effect
          contentClassName
        )}
      >
        <div className="h-full w-full flex items-center justify-center relative">
            {/* Animated background blob for visual interest */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 blur-2xl z-0" 
            />
            
            {/* Content Transition */}
            <div className="relative z-10 w-full h-full p-4">
               {content[activeCard].content ?? null}
            </div>
        </div>
      </div>
    </motion.div>
  );
};