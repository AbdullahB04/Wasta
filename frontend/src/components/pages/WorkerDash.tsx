import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { X, Plus, Save, ArrowLeft, User, Briefcase, Globe, MapPin, Camera, LogOut, Star, MessageSquare } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageTitle } from '../hooks/usePageTitle';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../config/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from "../hooks/use-toast";
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

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


const WorkerDashboard = () => {
  usePageTitle("Worker Dashboard");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { dbUser } = useAuth();

  const [formData, setFormData] = useState({
    firstName: dbUser?.firstName || "",
    lastName: dbUser?.lastName || "",
    age: dbUser?.age ? String(dbUser.age) : "",
    phoneNumber: dbUser?.phone || "",
    location: dbUser?.address || "",
    description: dbUser?.bio || "",
    profileImage: dbUser?.image || "",
    position: dbUser?.position || "",
  });

  const [languages, setLanguages] = useState({
    kurdish: true,
    english: true,
    arabic: false,
  });

  const [skills, setSkills] = useState([
    "Emergency Repairs",
    "Installation",
    "Maintenance",
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [isActive, setIsActive] = useState(dbUser?.isActive ?? true);
  const [feedbacks, setFeedbacks] = useState<FeedbackType[]>([]);

  const availableLocations = ["Erbil", "Duhok", "Sulaimani", "Kirkuk", "Halabja"];

  // ✅ Update formData, skills, and languages when dbUser changes
  useEffect(() => {
    if (dbUser) {
      setFormData(prev => ({
        ...prev,
        firstName: dbUser.firstName || "",
        lastName: dbUser.lastName || "",
        phoneNumber: dbUser.phone || "",
        location: dbUser.address || "",
        profileImage: dbUser.image || "",
        age: dbUser.age ? String(dbUser.age) : "",
        description: dbUser.bio || "",
        position: dbUser.position || "",
      }));

      // ✅ Load isActive from database
      setIsActive(dbUser.isActive ?? true);

      // ✅ Parse and load skills if they exist
      if (dbUser.skills) {
        try {
          const parsedSkills = JSON.parse(dbUser.skills);
          setSkills(parsedSkills);
        } catch (e) {
          console.error('Error parsing skills:', e);
        }
      }

      // ✅ Parse and load languages if they exist
      if (dbUser.languages) {
        try {
          const parsedLanguages = JSON.parse(dbUser.languages);
          setLanguages(parsedLanguages);
        } catch (e) {
          console.error('Error parsing languages:', e);
        }
      }

      // ✅ Fetch feedbacks for this worker
      const fetchFeedbacks = async () => {
        try {
          const response = await fetch(`http://localhost:3000/workers/${dbUser.id}/feedback`);
          const data = await response.json();
          setFeedbacks(data);
        } catch (error) {
          console.error('Error fetching feedbacks:', error);
        }
      };
      fetchFeedbacks();
    }
  }, [dbUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size must be less than 2MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLanguageChange = (language: keyof typeof languages) => {
    setLanguages((prev) => ({ ...prev, [language]: !prev[language as keyof typeof languages] }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prev) => [...prev, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills((prev) => prev.filter((skill) => skill !== skillToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  // ✅ Updated handleSave to include skills and languages
  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile.",
          variant: "destructive"
        });
        return;
      }

      const token = await user.getIdToken();
      
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phoneNumber,
        address: formData.location,
        age: parseInt(formData.age) || null,
        description: formData.description,
        position: formData.position, // ✅ Save position/profession
        skills: JSON.stringify(skills), // ✅ Save skills as JSON string
        languages: JSON.stringify(languages), // ✅ Save languages as JSON string
        isActive: isActive, // ✅ Add this line
        ...(formData.profileImage && { image: formData.profileImage })
      };

      console.log('Sending update:', payload);
      
      const response = await fetch('http://localhost:3000/api/auth/me', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        throw new Error(errorData.error || 'Failed to update profile');
      }

      const updatedUser = await response.json();
      console.log('Update successful:', updatedUser);
      
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });

      // Reload to refresh data
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error) {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save changes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Get initials from first and last name
  const getInitials = () => {
    return `${formData.firstName?.[0] || ''}${formData.lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div {...(i18n.language === 'ar' || i18n.language === 'ku' ? { dir: 'rtl' } : { dir: 'ltr' })} className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Glass Header */}
      <div dir="ltr" className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* <Link to="/"> */}
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full" onClick={() => navigate(-1)}>
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              {/* </Link> */}
              <div>
                <h1 className="text-xl font-bold text-slate-900">{t('My Dashboard')}</h1>
              </div>
            </div>
            
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
               <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
               {isActive ? t("Profile Active") : t("Profile Hidden")}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-10 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          
          {/* Left Column: Status & Quick Actions */}
          <div className="space-y-6">
            <Card className="border-slate-200 shadow-sm overflow-visible bg-white relative">
              
              {/* Blue Gradient Header */}
              <div className="h-28 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-t-xl" />

              <CardContent className="pt-0 relative pb-6">
                
                {/* 1. Floating Profile Icon with Camera Button */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-white rounded-full p-1.5 shadow-lg shadow-slate-200/50">
                      <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                        {formData.profileImage ? (
                          <img 
                            src={formData.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-3xl font-bold text-slate-400">
                            {getInitials()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Camera Button Overlay */}
                    <label 
                      htmlFor="profile-image-upload"
                      className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-lg cursor-pointer transition-all active:scale-95"
                    >
                      <Camera className="w-4 h-4" />
                    </label>
                    <input
                      id="profile-image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>

                {/* 2. User Info */}
                <div className="text-center pt-16 mb-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-tight">
                    {formData.firstName} {formData.lastName}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    {formData.location || "Erbil, Kurdistan"}
                  </p>
                </div>

                {/* Divider */}
                <div className="h-px bg-slate-100 w-full mb-5" />

                {/* 3. Online Status Toggle */}
                <div className="flex items-center justify-between px-1">
                  <div className="space-y-0.5">
                    <Label htmlFor="active-status" className="text-base font-semibold text-slate-700">
                      {t("Online Status")}
                    </Label>
                  </div>
                    <Switch
                      id="active-status"
                      checked={isActive}
                      onCheckedChange={setIsActive}
                      className={`
                        scale-110 transition-colors 
                        ${isActive ? "bg-green-500" : "bg-slate-200"}
                      `}
                    />
                </div>
              </CardContent>
            </Card>

            {/* Feedbacks Card */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{t("Client Feedbacks")}</CardTitle>
                    <CardDescription>{t("See what clients are saying about you")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {feedbacks.length > 0 ? (
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {feedbacks.map((feedback) => (
                      <div key={feedback.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-start gap-3 mb-3">
                          <Avatar
                            src={feedback.user.image || undefined}
                            alt={feedback.user.firstName}
                            sx={{ width: 40, height: 40 }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-900 text-sm">
                              {feedback.user.firstName} {feedback.user.lastName}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-3.5 h-3.5 ${
                                    i < feedback.rating
                                      ? 'fill-amber-400 text-amber-400'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-slate-500 ml-1">
                                {new Date(feedback.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        {feedback.comment && (
                          <p className="text-sm text-slate-600 leading-relaxed pl-0">
                            "{feedback.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">{t("No feedbacks yet")}</p>
                    <p className="text-slate-400 text-xs mt-1">{t("Client reviews will appear here")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: The Main Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Personal Information */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{t("Personal Details")}</CardTitle>
                    <CardDescription>{t("Update your basic contact information.")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700">{t("First Name")}</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700">{t("Last Name")}</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700">{t("Age")}</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-700">{t("Phone Number")}</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                {/* Location Select Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    {t("Location")}
                  </Label>
                  <select 
                    name="location" 
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white"
                  >
                    <option value="" disabled>{t("Select your location")}</option>
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Profession/Position Select Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-slate-700 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-slate-500" />
                    {t("Profession")}
                  </Label>
                  <select 
                    name="position" 
                    id="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white"
                  >
                    <option value="" disabled>{t("Select your profession")}</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Painter">Painter</option>
                    <option value="Cleaner">Cleaner</option>
                    <option value="Gardener">Gardener</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Mover">Mover</option>
                    <option value="Mechanic">Mechanic</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">{t("Description")}</Label>
                  <Input id="description" name="description" value={formData.description} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                </div>
                
              </CardContent>
            </Card>

            {/* Languages */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{t("Languages")}</CardTitle>
                    <CardDescription>{t("Select the languages you can speak fluently.")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-4">
                  {Object.entries(languages).map(([lang, isChecked]) => (
                    <div 
                        key={lang}
                        onClick={() => handleLanguageChange(lang as keyof typeof languages)}
                        className={`
                           cursor-pointer flex items-center gap-3 px-4 py-3 rounded-xl border transition-all select-none
                           ${isChecked ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-500/20' : 'bg-white border-slate-200 hover:border-slate-300'}
                        `}
                    >
                      <Checkbox 
                        id={lang} 
                        checked={isChecked} 
                        onCheckedChange={() => {}}
                        className="data-[state=checked]:bg-blue-600 border-slate-300"
                      />
                      <Label htmlFor={lang} className="capitalize cursor-pointer font-medium text-slate-700">{lang}</Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-50">
                 <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-900">{t("Professional Skills")}</CardTitle>
                    <CardDescription>{t("Add skills to help clients find you.")}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={t("e.g. Pipe Fitting")}
                    className="flex-1 border-slate-200 focus-visible:ring-blue-500/20"
                  />
                  <Button onClick={addSkill} className="bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> {t("Add")}
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1.5 text-sm font-medium bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors pl-4 pr-2 flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="p-0.5 hover:bg-red-100 hover:text-red-600 rounded-full transition-colors"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-slate-400 italic">{t("No skills added yet. Add some above!")}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
               <Button 
                 onClick={handleSave} 
                 size="lg" 
                 className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95"
               >
                 <Save className="h-4 w-4 mr-2" />
                 {t("Save Changes")}
               </Button>
               
               <Button 
                 onClick={handleSignOut}
                 size="lg"
                 variant="outline"
                 className="flex-1 sm:flex-initial border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all active:scale-95"
               >
                 <LogOut className="h-4 w-4 mr-2" />
                 {t("Sign Out")}
               </Button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;