import  Hero from '../ui/Hero'
import { StickyScroll } from '../ui/Sticky-scroll-reveal'
import CTA from '../ui/CTA'
import { GrMapLocation } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import {Link} from 'react-router-dom';
import Footer from '../ui/Footer';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';

const content = [
  {
    title: 'Search by Location',
    description: 'Easily find skilled professionals in your area for any job, big or small.',
    content: (
      <div>
        <GrMapLocation size={150} className="text-sky-400 mx-auto mt-6" />
      </div>
    ),
  },
  { 
    title: 'View Profiles',
    description: 'Connect with workers who have a track record of excellence.',
    content: (
      <div>
        <ImProfile size={180} className="text-sky-400 mx-auto mt-6" />
      </div>
    ),
  },
  {
    title: 'Communicate & Hire',
    description: 'Communicate directly with workers to discuss your needs and hire with confidence.',
    content: (
      <div>
        <IoChatbubbleEllipsesSharp size={180} className="text-sky-400 mx-auto mt-6" />
      </div>
    )
  },
]




const Home = () => {
  usePageTitle('Home')
  const { dbUser, loading } = useAuth();

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
  <div dir='ltr'>
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
    <section id='hero'>
      <Hero />
    </section>
    <section id='how-it-works'>
      <StickyScroll content={content} />
    </section>
    <section id='call-to-action'>
      <CTA />
    </section>
    <Footer />
  </div>
  )
}

export default Home