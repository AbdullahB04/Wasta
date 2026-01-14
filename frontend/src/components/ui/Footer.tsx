import { 
  Facebook, 
  Instagram, 
  Github,  
} from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo1.PNG'


const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section: Logo, Navigation, Socials */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
          
          {/* 1. Brand / Logo */}
          <div className="flex items-center gap-2.5">
              <img src={logo} alt="Logo" className="h-17 w-20 brightness-0 invert" />
          </div>

          {/* 2. Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-8 md:gap-12 text-sm font-medium text-slate-300">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <Link to="/worker" className="hover:text-white transition-colors">Workers</Link>
            <Link to="/category" className="hover:text-white transition-colors">Categories</Link>
            {/* <Link to="/about" className="hover:text-white transition-colors">About</Link> */}
          </nav>

          {/* 3. Social Icons */}
          <div className="flex items-center gap-4">
            <SocialLink href="#" icon={<Facebook size={18} />} />
            <SocialLink href="#" icon={<Instagram size={18} />} />
            <SocialLink href="#" icon={<Github size={18} />} />
          </div>

        </div>

        {/* Divider Line */}
        <div className="border-t border-slate-800/60 my-10"></div>

        {/* Bottom Section: Copyright */}
        <div className="text-center">
          <p className="font-bold text-sm">
            &copy; Copyright 2026, All Rights Reserved 
          </p>
        </div>

      </div>
    </footer>
  );
};

// Helper component for Social Buttons to keep code clean
const SocialLink = ({ href, icon }) => {
  return (
    <a 
      href={href}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all duration-300"
    >
      {icon}
    </a>
  );
};

export default Footer;