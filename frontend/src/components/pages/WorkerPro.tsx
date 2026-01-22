import { useState, useEffect } from 'react';
import { MapPin, Clock, Star, MessageCircle, User, MessageSquare, X } from 'lucide-react';
import { LiaTelegramPlane } from "react-icons/lia";
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';

interface WorkerType {
  id: string;
  firstName: string;
  lastName: string;
  position?: string;
  image?: string;
  phone: string;
  address: string;
  bio?: string;
  skills?: string; 
  languages?: string; 
  isActive: boolean;
  averageRating?: number | null;
  totalFeedbacks?: number;
}

interface FeedbackType {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    image: string | null;
  };
}

interface WorkerProfileModalProps {
  workerId: string;
}

const WorkerProfileModal = ({ workerId }: WorkerProfileModalProps) => {
  usePageTitle('Worker Profile');
  const { dbUser } = useAuth();
  const [worker, setWorker] = useState<WorkerType | null>(null);
  const [loading, setLoading] = useState(true);

  // State for feedback modal
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackHover, setFeedbackHover] = useState(0);
  const [comment, setComment] = useState('');
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Parse skills and languages from worker data
  const [skills, setSkills] = useState<string[]>([]);
  const [languages, setLanguages] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    const fetchWorker = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching worker with ID:', workerId);
        const response = await fetch(`http://localhost:3000/workers/${workerId}`);
        console.log('📡 Response status:', response.status);
        const data = await response.json();
        console.log('📦 Received data:', data);
        setWorker(data);

        // Parse skills
        if (data.skills) {
          try {
            const parsedSkills = JSON.parse(data.skills);
            setSkills(parsedSkills);
          } catch (e) {
            console.error('Error parsing skills:', e);
            setSkills([]);
          }
        }

        // Parse languages
        if (data.languages) {
          try {
            const parsedLanguages = JSON.parse(data.languages);
            setLanguages(parsedLanguages);
          } catch (e) {
            console.error('Error parsing languages:', e);
            setLanguages({});
          }
        }

        // Fetch feedbacks
        const feedbackResponse = await fetch(`http://localhost:3000/workers/${workerId}/feedback`);
        const feedbackData = await feedbackResponse.json();
        setFeedbacks(feedbackData);
        console.log('📝 Fetched feedbacks:', feedbackData.length);
      } catch (error) {
        console.error('❌ Error fetching worker:', error);
      } finally {
        setLoading(false);
      }
    };

    if (workerId) {
      fetchWorker();
    }
  }, [workerId]);

  // Get array of enabled languages
  const enabledLanguages = Object.entries(languages)
    .filter(([, isEnabled]) => isEnabled)
    .map(([lang]) => lang.charAt(0).toUpperCase() + lang.slice(1)); // Capitalize first letter

  const handleSubmitFeedback = async () => {
    if (!dbUser || feedbackRating === 0) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(`http://localhost:3000/workers/${workerId}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: dbUser.id,
          rating: feedbackRating,
          comment: comment || null
        })
      });

      if (response.ok) {
        const newFeedback = await response.json();
        setFeedbacks([newFeedback, ...feedbacks]);
        // Reset and close
        setIsFeedbackOpen(false);
        setFeedbackRating(0);
        setComment('');
        console.log('✅ Feedback submitted successfully');        
      } else {
        console.error('❌ Failed to submit feedback');
      }
    } catch (error) {
      console.error('❌ Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Loading worker data...</div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-500">Worker not found</div>
      </div>
    );
  }

  return (
    // Main Container with scrolling fix
    <div dir='ltr' className="flex flex-col h-full max-h-[80vh] overflow-y-auto px-2 pb-2 scrollbar-hide">
      
      <div className="p-4 sm:p-6">
        
        {/* 1. Header: Avatar & Name */}
        <div className="flex flex-col sm:flex-row gap-6 items-start mb-6">
            
            {/* Profile Picture */}
            <div className="relative shrink-0 mx-auto sm:mx-0">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-slate-50 shadow-sm bg-slate-100 flex items-center justify-center overflow-hidden">
                    {worker?.image ? (
                      <img 
                        src={worker.image} 
                        alt={`${worker.firstName} ${worker.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-300" />
                    )}
                </div>
            </div>

            {/* Name & Rating Info */}
            <div className="flex-1 space-y-2 pt-2 text-center sm:text-left">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{worker?.firstName} {worker?.lastName}</h2>
                    <p className="text-lg text-blue-600 font-medium">{worker?.position}</p>
                </div>
                
                <div className="flex items-center justify-center sm:justify-start gap-3">
                    {worker?.averageRating !== null && worker?.averageRating !== undefined ? (
                      <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700 text-sm">{worker.averageRating}</span>
                        <span className="text-xs text-slate-500">({worker.totalFeedbacks} reviews)</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                        <Star className="w-4 h-4 text-slate-400" />
                        <span className="font-medium text-slate-500 text-sm">No ratings yet</span>
                      </div>
                    )}
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
                    <p className="text-sm font-semibold text-slate-700 truncate">{worker?.address}</p>
                </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="p-2 bg-white rounded-lg text-slate-400 shadow-sm shrink-0">
                    <Clock className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Availability</p>
                    <p className={`text-sm font-semibold truncate ${worker?.isActive ? 'text-green-600' : 'text-slate-400'}`}>
                      {worker?.isActive ? 'Available Today' : 'Not Available'}
                    </p>
                </div>
            </div>
        </div>

        {/* 3. Bio Text */}
        <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wide">About</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
                {worker?.bio || "No description available."}
            </p>
        </div>

        {/* 4. Skills & Languages - ✅ Now from Database */}
        <div className="space-y-4 mb-6 border-t border-slate-100 pt-6">
            {/* Skills */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Skills:</span>
                <div className="flex flex-wrap gap-2">
                    {skills.length > 0 ? (
                      skills.map(skill => (
                        <span key={skill} className="px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">No skills listed</span>
                    )}
                </div>
            </div>

            {/* Languages */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Languages:</span>
                <div className="flex flex-wrap gap-2">
                    {enabledLanguages.length > 0 ? (
                      enabledLanguages.map(lang => (
                        <span key={lang} className="px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600">
                            {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-400 italic">No languages listed</span>
                    )}
                </div>
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase w-20 shrink-0 mt-1">Phone :</span>
                <span className="text-sm text-slate-700 font-medium">{worker?.phone}</span>
            </div>
        </div>


        {/* 6. Bottom Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
            {/* Feedback Button */}
            <button 
              onClick={() => setIsFeedbackOpen(true)}
              disabled={!dbUser || dbUser.role === 'WORKER'}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all ${
                !dbUser || dbUser.role === 'WORKER'
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-700 hover:bg-slate-800 text-white shadow-slate-300 active:scale-95'
              }`}
              title={!dbUser ? 'Please log in to leave feedback' : dbUser.role === 'WORKER' ? 'Workers cannot leave feedback' : ''}
            >
              <MessageSquare className="w-6 h-6" />
              Leave Feedback
            </button>

            {/* WhatsApp & Telegram Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                disabled={!worker?.isActive}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  worker?.isActive
                    ? 'bg-green-500 hover:bg-green-600 text-white shadow-green-200 active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title={!worker?.isActive ? 'Worker is not available' : ''}
              >
                  <MessageCircle className="w-6 h-6" />
                  WhatsApp
              </button>
              <button 
                disabled={!worker?.isActive}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-lg shadow-lg transition-all ${
                  worker?.isActive
                    ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200 active:scale-95'
                    : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                }`}
                title={!worker?.isActive ? 'Worker is not available' : ''}
              >
                  <LiaTelegramPlane className="w-7 h-7" />
                  Telegram
              </button>
            </div>
        </div>

      </div>

      {/* Feedback Modal */}
      {isFeedbackOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsFeedbackOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <h2 className="text-xl font-bold text-slate-900 mb-4">Leave Your Feedback</h2>

            {/* Rating Section */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Rating</label>
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
                      className={`w-8 h-8 transition-all duration-200 ${
                        star <= (feedbackHover || feedbackRating)
                          ? "text-amber-400 fill-amber-400 drop-shadow-sm"
                          : "text-slate-300 fill-transparent"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {feedbackRating > 0 && (
                <p className="text-xs text-amber-600 font-medium mt-1">{feedbackRating} out of 5 stars</p>
              )}
            </div>

            {/* Comment Section */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Additional Comments (Optional)</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                className="w-full h-24 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmitFeedback}
              disabled={feedbackRating === 0 || isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold text-base shadow-lg transition-all active:scale-95 mb-4"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </button>

            {/* Previous Feedbacks */}
            {feedbacks.length > 0 && (
              <div className="border-t border-slate-200 pt-3">
                <h3 className="text-base font-bold text-slate-900 mb-3">Previous Feedbacks ({feedbacks.length})</h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {feedbacks.map((fb) => (
                    <div key={fb.id} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="flex items-start gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                          {fb.user.image ? (
                            <img src={fb.user.image} alt={fb.user.firstName} className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-semibold text-slate-900 text-sm">{fb.user.firstName} {fb.user.lastName}</p>
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3 h-3 ${
                                    i < fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {fb.comment && (
                            <p className="text-xs text-slate-600 leading-relaxed">{fb.comment}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-1">
                            {new Date(fb.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkerProfileModal;