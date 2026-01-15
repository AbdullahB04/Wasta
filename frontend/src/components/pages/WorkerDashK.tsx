import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { X, Plus, Save, ArrowLeft, User, Briefcase, Globe, MapPin, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePageTitle } from '../hooks/usePageTitle';


const WorkerDashboardK = () => {
  usePageTitle("پڕۆفایلی وەستا");
  const [formData, setFormData] = useState({
    firstName: "Ahmed",
    lastName: "Hassan",
    age: "32",
    phoneNumber: "+964 770 123 4567",
    location: "Erbil",
    description: "Experienced plumber with over 10 years in the field.",
    profileImage: "", // Store the uploaded image URL
  });

  const [languages, setLanguages] = useState({
    کوردی: true,
    ئینگلیزی: true,
    عەرەبی: false,
  });

  const [skills, setSkills] = useState([
    "Emergency Repairs",
    "Installation",
    "Maintenance",
  ]);

  const [newSkill, setNewSkill] = useState("");
  const [isActive, setIsActive] = useState(true);

  const availableLocations = ["هەولێر", "دهۆک", "سلێمانی", "کەرکوک", "هەڵەبجە"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleSave = () => {
    console.log("Saving profile:", { formData, languages, skills, isActive });
  };

  // Get initials from first and last name
  const getInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Glass Header */}
      <div dir="ltr" className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/workerK">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">پڕۆفایلەکەم</h1>
              </div>
            </div>
            
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
               <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
               {isActive ? "چاڵاك" : "ناچاڵاك"}
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
                      دۆخی کار
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
                    <CardTitle className="text-lg font-bold text-slate-900">زانیاری کەسی</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700">ناوی یەکەم</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700">ناوی دووەم</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700">تەمەن</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-700">ژمارەی مۆبایل</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                {/* Location Select Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-slate-500" />
                    شوێن
                  </Label>
                  <select 
                    name="location" 
                    id="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-700 bg-white"
                  >
                    <option value="" disabled>شوێنەکەت هەڵبژێرە</option>
                    {availableLocations.map((loc) => (
                      <option key={loc} value={loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">دەربارە</Label>
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
                    <CardTitle className="text-lg font-bold text-slate-900">زمانەکان</CardTitle>
                    <CardDescription>زمانەکان هەڵبژێرە کە دەتوانیت قسەی پێ بکەیت.</CardDescription>
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
                    <CardTitle className="text-lg font-bold text-slate-900">لێهاتوویی و شارەزاییەکان</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="بۆنمونە: بۆڕیچی،کارەباچی..."
                    className="flex-1 border-slate-200 focus-visible:ring-blue-500/20"
                  />
                  <Button onClick={addSkill} className="bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> زیادکردن
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
                    <p className="text-sm text-slate-400 italic">هیچ توانایەک نەزیادکراوە تاکو ئێستا. لەسەرەوە هەوڵبدە زیاد بکە!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
               <Button onClick={handleSave} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95">
                 <Save className="h-4 w-4 mr-2" />
                 هەڵگرتن
               </Button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboardK;