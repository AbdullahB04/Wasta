import { useState } from 'react';
import { Search, MapPin, Star, Filter, SlidersHorizontal } from 'lucide-react';
import { NavbarButton, NavbarLogo, NavBody, NavItems } from '../ui/Navbar'; 
import { Link } from 'react-router-dom';
import BasicModal from '../ui/Animated-modalK';
import Avatar from '@mui/material/Avatar';
import FooterK from '../ui/FooterK';
import { usePageTitle } from '../hooks/usePageTitle';



const Worker = () => {
  usePageTitle('وەستاکان');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");

  const workers = [
    { id: 1, name: "Ahmed Hassan", location: "Erbil, Kurdistan", rating: 4.8, reviews: 124, tags: ["Plumbing", "Repair"], image: "https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&q=80&w=200"},
    { id: 2, name: "Sarah Jameel", location: "Sulaymaniyah", rating: 5.0, reviews: 89, tags: ["Design", "Decor"], image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200"},
    { id: 3, name: "Karim Ali", location: "Duhok", rating: 4.5, reviews: 56, tags: ["Wiring", "Install"], image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200"},
    { id: 4, name: "John Doe", location: "Erbil", rating: 4.2, reviews: 30, tags: ["Repair", "Maintenance"], image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200"},
  ];

  const categories = [
    { value: "all", label: "هەموو بەشەکان" },
    { value: "plumber", label: "بۆڕیچی" },
    { value: "electrician", label: "کارەباچی" },
    { value: "carpenter", label: "فەرششۆر" },
    { value: "cleaner", label: "پاککەرەوە" },
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
    <div dir='rtl' className="font-nrt min-h-screen bg-slate-50/50">

    <NavBody>
      <NavbarLogo />
        <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            {/* <NavbarButton variant="secondary">Login</NavbarButton> */}
            <Link to="/LoginK"><NavbarButton className='bg-gradient-to-r from-blue-600 to-cyan-500 text-white'>چوونە ژوورەوە</NavbarButton></Link>
          </div>
    </NavBody>

      {/* Page Header & Search Section */}
      <section className="relative pt-16 pb-12 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-64 bg-blue-100/50 blur-[100px] -z-10 rounded-full" />
        
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">وەستاکەت</span> بدۆزەوە
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
              بەدوای باشترین وەستاکانی ناوچەکەتدا بگەڕێ کە بەپێی پێداویستییەکانت.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col md:flex-row gap-2 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="گەڕان بە پێی ناو و لێهاتوویی ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-transparent rounded-xl focus:bg-slate-50 focus:outline-none text-slate-900 placeholder:text-slate-400 transition-colors"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative min-w-[160px]">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl text-slate-700 text-sm font-semibold focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="relative min-w-[160px]">
                <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full pl-10 pr-8 py-3.5 bg-slate-50 hover:bg-slate-100 border border-transparent rounded-xl text-slate-700 text-sm font-semibold focus:outline-none appearance-none cursor-pointer transition-colors"
                >
                  <option value="rating">باشترین هەڵسەنگاندن</option>
                  <option value="distance">نزیكترین</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workers Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {workers.map((worker) => (
            <div key={worker.id} className="group bg-white rounded-[1.5rem] border border-slate-100 p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              
              {/* Header: MUI Avatar & Info */}
              <div className="flex items-start gap-4 mb-4">
                <div className="relative shrink-0">
                  {/* --- MUI AVATAR USED HERE --- */}
                  <Avatar 
                    alt={worker.name} 
                    src={worker.image} 
                    sx={{ width: 64, height: 64, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} 
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                    {worker.name}
                  </h3>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full w-fit">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span>{worker.rating}</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {worker.tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                    {tag}
                  </span>
                ))}
                </div>
                  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                  <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mb-4">مۆبایل :</span>
                  {/* <span> retrieve from DB</span> */}
                </div>

              {/* Footer: Location & Action */}
              <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-[100px]">{worker.location}</span>
                </div>
                
                <div className="shrink-0">
                  <BasicModal buttonText="بینینی پڕۆفایل" />
                </div>
              </div>

            </div>
          ))}
        </div>

      </section>
      
      <FooterK />
    </div>
  );
};

export default Worker;