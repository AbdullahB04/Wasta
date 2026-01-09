import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const CallToAction = () => {
  return (
    <section id='call-to-action' className="bg-white py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-[2.5rem] overflow-hidden bg-white border border-slate-200 shadow-2xl px-8 py-16 lg:px-20 lg:py-24 text-center"
        >
          
          {/* Soft Background Gradients (Light & Airy) */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] opacity-60" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-50 rounded-full blur-[100px] opacity-60" />
          </div>

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            
            {/* Badge - Now Slate/Blue style */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold mb-8"
            >
              <Sparkles className="w-4 h-4 text-blue-500 fill-blue-500" />
              <span>Trusted by 10,000+ users</span>
            </motion.div>

            {/* Heading - Dark Text for Contrast */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
              Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Get Started?</span>
            </h2>

            {/* Description - Slate-600 for readability */}
            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
              Join thousands of satisfied users and skilled professionals. 
              Sign up today to experience seamless service connections.
            </p>

            {/* Buttons - Matches Hero Style */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              
              {/* Primary: Solid Blue */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
              >
                Start Hiring Today
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Secondary: White with Border */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 bg-white border-2 border-slate-100 text-slate-600 font-bold rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all"
              >
                Become a Service Provider
              </motion.button>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToAction;