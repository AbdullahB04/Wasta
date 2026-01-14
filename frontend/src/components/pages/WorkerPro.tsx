import { useState } from 'react';
import { MapPin, Clock, Star, MessageCircle, User, MessageSquare, X } from 'lucide-react';
import { LiaTelegramPlane } from "react-icons/lia";


const WorkerProfileModal = () => {
  
  // State for feedback modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmitFeedback = () => {
    // Handle feedback submission logic here
    console.log({ rating: feedbackRating, comment });
    // Reset and close
    setIsFeedbackOpen(false);
    setFeedbackRating(0);
    setComment('');
  };

  return (
    // Main Container with scrolling fix
    <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto px-2 pb-2 scrollbar-hide">
      
      <div className="p-4 sm:p-6">
        
        {/* 1. Header: Avatar & Name */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
            
            {/* Blank Profile Picture placeholder */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-50 shadow-sm bg-slate-100 flex items-center justify-center">
                    <User className="w-12 h-12 text-slate-300" />
                </div>
            </div>

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
        <div className="space-y-4 mb-6 border-t border-slate-100 pt-6">
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
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Phone NO:</span>
                {/* <span> retrieve from DB</span> */}
            </div>
        </div>


        {/* 6. Bottom Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
            {/* Feedback Button */}
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-slate-300 transition-all active:scale-95"
            >
              <MessageSquare className="w-6 h-6" />
              Leave Feedback
            </button>

            {/* WhatsApp & Telegram Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-green-200 transition-all active:scale-95">
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white py-3.5 rounded-xl font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <LiaTelegramPlane className="w-7 h-7" />
                  Telegram
              </button>
            </div>
        </div>

      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Leave Your Feedback</h2>

            {/* Rating Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-3">Your Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95 p-1"
                    onClick={() => setFeedbackRating(star)}
                    onMouseEnter={() => setFeedbackHover(star)}
                    onMouseLeave={() => setFeedbackHover(0)}
                  >
                    <Star
                      className={`w-10 h-10 transition-all duration-200 ${
                        star <= (feedbackHover || feedbackRating)
                          ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                          : "text-slate-300 fill-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {feedbackRating > 0 && (
                <p className="text-sm text-amber-600 font-medium mt-2">{feedbackRating} out of 5 stars</p>
              )}
            </div>

            {/* Comment Section */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full h-32 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={feedbackRating === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95"
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfileModal;