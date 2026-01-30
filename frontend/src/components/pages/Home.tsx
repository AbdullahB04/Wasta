import  Hero from '../ui/Hero'
import { StickyScroll } from '../ui/Sticky-scroll-reveal'
import CTA from '../ui/CTA'
import { GrMapLocation } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { NavbarButton, NavbarLogo, NavBody, NavItems, LanguageToggle } from '../ui/Navbar';
import {Link} from 'react-router-dom';
import Footer from '../ui/Footer';
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';


const Home = () => {
  usePageTitle('Home')
  const { dbUser, loading } = useAuth();
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  

  const content = [
    {
      title: t('searchByLocation'),
      description: t('searchByLocationDesc'),
      content: (
        <div>
          <GrMapLocation size={150} className="text-sky-400 mx-auto mt-6" />
        </div>
      ),
    },
    { 
      title: t('viewProfiles'),
      description: t('viewProfilesDesc'),
      content: (
        <div>
          <ImProfile size={180} className="text-sky-400 mx-auto mt-6" />
        </div>
      ),
    },
    {
      title: t('communicateAndHire'),
      description: t('communicateAndHireDesc'),
      content: (
        <div>
          <IoChatbubbleEllipsesSharp size={180} className="text-sky-400 mx-auto mt-6" />
        </div>
      )
    },
  ]

  const navItems = [
    {
      name: t('home'),
      link: '/',
    },
    {
      name: t('workers'),
      link: '/worker'
    },
    {
      name: t('categories'),
      link: '/category'
    }
  ]

  const getDashboardLink = () => {
    if (!dbUser) return '/Login';
    return dbUser.role === 'WORKER' ? '/worker/dashboard' : '/user/dashboard';
  };

  return (
  <div {...(i18n.language === 'ar' || i18n.language === 'ku' ? { dir: 'rtl' } : { dir: 'ltr' })} >
    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <LanguageToggle />
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
                  {t('signIn')}
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