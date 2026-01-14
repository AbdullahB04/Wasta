import React from 'react';
import { MapPin, Clock, Star, ShieldCheck, MessageCircle, User } from 'lucide-react'; // Added User icon import

const WorkerProfileModal = () => {
  return (
    // Main Container with scrolling fix
    <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto px-2 pb-2 scrollbar-hide">
      
      <div className="p-4 sm:p-6">
        
        {/* 1. Header: Avatar & Name */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
            
            {/* ---- CHANGED: Blank Profile Picture placeholder ---- */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-50 shadow-sm bg-slate-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-300" />
                </div>
            </div>
            {/* -------------------------------------------------- */}

            {/* Name & Rating Info */}
            <div className="flex-1 space-y-2 pt-2 text-center sm:text-left">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">Kamal</h2>
                    <p className="text-lg text-blue-600 font-medium">Plumber</p>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-3">
                    <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700 text-sm">4.9</span>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Key Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm shrink-0">
                    <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Location</p>
                    <p className="text-sm font-semibold text-slate-700 truncate">Erbil, Kurdistan</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm shrink-0">
                    <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Availability</p>
                    <p className="text-sm font-semibold text-green-600 truncate">Available Today</p>
                </div>
            </div>
        </div>

        {/* 3. Bio Text */}
        <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">About</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
                Specializing in residential and commercial plumbing with over 10 years of experience. 
                I handle emergency repairs, new installations, and routine maintenance with a focus on quality.
            </p>
        </div>

        {/* 4. Skills & Languages */}
        <div className="space-y-4 mb-8 border-t border-slate-100 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Skills:</span>
                <div className="flex flex-wrap gap-2">
                    {['Pipe Repair', 'Installation', 'Leak Detection', 'Maintenance'].map(skill => (
                    <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {skill}
                    </span>
                    ))}
                </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Languages:</span>
                <div className="flex flex-wrap gap-2">
                    {['English', 'Kurdish', 'Arabic'].map(lang => (
                    <span key={lang} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                        {lang}
                    </span>
                    ))}
                </div>
            </div>
        </div>

        {/* 5. Bottom Action Button (WhatsApp Only) */}
        <div className="mt-auto">
            <button className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-95">
                <MessageCircle className="w-6 h-6" />
                Contact via WhatsApp
            </button>
        </div>

      </div>
    </div>
  );
};

export default WorkerProfileModal;