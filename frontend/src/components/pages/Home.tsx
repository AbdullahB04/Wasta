import  Hero from '../ui/Hero'
import { StickyScroll } from '../ui/Sticky-scroll-reveal'
import CTA from '../ui/CTA'
import { GrMapLocation } from "react-icons/gr";
import { ImProfile } from "react-icons/im";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar';
import Footer from '../ui/Footer';
import {Link} from 'react-router-dom';
// import img1 from '../../assets/4.jpg'
// import img2 from '../../assets/5.jpg'
// import img3 from '../../assets/6.jpg'

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
    title: 'Chat & Hire',
    description: 'Communicate directly with workers to discuss your needs and hire with confidence.',
    content: (
      <div>
        <IoChatbubbleEllipsesSharp size={180} className="text-sky-400 mx-auto mt-6" />
      </div>
    )
  },
]

// const images = [
//   img1,
//   img2,
//   img3,
// ]


const Home = () => {
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

  return (
  <div>
    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <NavbarButton variant="secondary">Login</NavbarButton>
            <Link to="/Login"><NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>Sign in</NavbarButton></Link>
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