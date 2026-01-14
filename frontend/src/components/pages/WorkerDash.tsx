import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { X, Plus, Save, ArrowLeft, User, Briefcase, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const WorkerDashboard = () => {
  const [formData, setFormData] = useState({
    firstName: "Ahmed",
    lastName: "Hassan",
    age: "32",
    phoneNumber: "+964 770 123 4567",
    location: "Erbil, Kurdistan Region",
    description: "Experienced plumber with over 10 years in the field.",
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
  const [isActive, setIsActive] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* 1. Glass Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/worker">
                <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-full">
                  <ArrowLeft className="h-5 w-5 text-slate-600" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-slate-900">My Dashboard</h1>
                <p className="text-sm text-slate-500">Manage your professional profile</p>
              </div>
            </div>
            
            {/* Status Badge in Header for quick visibility */}
            <div className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${isActive ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
               <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
               {isActive ? "Profile Active" : "Profile Hidden"}
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
                
                {/* 1. Floating Profile Icon (Overlapping) */}
                <div className="absolute -top-10 left-6">
                  <div className="w-20 h-20 bg-white rounded-2xl p-1.5 shadow-lg shadow-slate-200/50">
                    <div className="w-full h-full bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                      <User className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                {/* 2. User Info (Aligned to the right of the floating icon) */}
                <div className="pl-28 pt-3 mb-6">
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
                      Online Status
                    </Label>
                    <p className="text-xs text-slate-500 font-medium">
                      Visible to clients
                    </p>
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
                    <CardTitle className="text-lg font-bold text-slate-900">Personal Details</CardTitle>
                    <CardDescription>Update your basic contact information.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700">First Name</Label>
                    <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700">Last Name</Label>
                    <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="age" className="text-slate-700">Age</Label>
                    <Input id="age" name="age" type="number" value={formData.age} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-700">Phone Number</Label>
                    <Input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                  </div>
                </div>

                <label htmlFor="profilePicture">Profile Picture: </label>
                <input type="file" name="profilePicture" id="profilePicture" />

                <div className="space-y-2">
                  <Label htmlFor="location" className="text-slate-700">Location</Label>
                  <Input id="location" name="location" value={formData.location} onChange={handleInputChange} className="border-slate-200 focus-visible:ring-blue-500/20" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-slate-700">Description</Label>
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
                    <CardTitle className="text-lg font-bold text-slate-900">Languages</CardTitle>
                    <CardDescription>Select the languages you can speak fluently.</CardDescription>
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
                        onCheckedChange={() => {}} // Handled by parent div
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
                    <CardTitle className="text-lg font-bold text-slate-900">Professional Skills</CardTitle>
                    <CardDescription>Add skills to help clients find you.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex gap-3">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. Pipe Fitting"
                    className="flex-1 border-slate-200 focus-visible:ring-blue-500/20"
                  />
                  <Button onClick={addSkill} className="bg-slate-900 hover:bg-slate-800 text-white shrink-0">
                    <Plus className="h-4 w-4 mr-2" /> Add
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
                    <p className="text-sm text-slate-400 italic">No skills added yet. Add some above!</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
               <Button onClick={handleSave} size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 transition-all active:scale-95">
                 <Save className="h-4 w-4 mr-2" />
                 Save Changes
               </Button>
            </div>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default WorkerDashboard;