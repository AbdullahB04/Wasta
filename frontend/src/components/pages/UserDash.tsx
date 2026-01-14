import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ArrowLeft, Camera, Save, User, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import { motion } from "framer-motion"; 

const UserDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "+964 750 123 4567",
    profileImage: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-100/50 blur-[120px] -z-10 rounded-full pointer-events-none" />

      {/* 1. Glass Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900">My Profile</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your account details</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 flex justify-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-xl"
        >
          <Card className="border-slate-200 shadow-xl shadow-slate-200/50 bg-white rounded-[2rem] overflow-hidden">
            
            {/* Header Background Strip */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500 relative">
                <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-30" />
            </div>

            <CardContent className="relative px-8 pb-10">
                
              {/* 2. Floating Avatar Section */}
              <div className="flex flex-col items-center -mt-16 mb-8">
                <div className="relative group">
                  <div className="p-1.5 bg-white rounded-full shadow-lg">
                      <Avatar className="h-32 w-32 border-4 border-slate-50">
                        <AvatarImage src={formData.profileImage} alt={`${formData.firstName}`} className="object-cover" />
                        <AvatarFallback className="text-4xl font-bold bg-slate-100 text-slate-400">
                          {formData.firstName[0]}{formData.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                  </div>
                  
                  {/* Floating Camera Button */}
                  <label 
                    htmlFor="image-upload" 
                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2.5 rounded-full cursor-pointer shadow-lg shadow-blue-600/30 hover:bg-blue-700 hover:scale-110 transition-all duration-200"
                  >
                    <Camera className="h-5 w-5" />
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="mt-4 text-center">
                    <h2 className="text-2xl font-bold text-slate-900">{formData.firstName} {formData.lastName}</h2>
                    <p className="text-slate-500 text-sm">Update your photo and personal details</p>
                </div>
              </div>

              {/* 3. The Form */}
              <div className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-semibold">First Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="pl-10 h-12 border-slate-200 focus-visible:ring-blue-500/20 rounded-xl bg-slate-50/50 focus:bg-white transition-colors"
                        placeholder="John"
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-semibold">Last Name</Label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="pl-10 h-12 border-slate-200 focus-visible:ring-blue-500/20 rounded-xl bg-slate-50/50 focus:bg-white transition-colors"
                        placeholder="Doe"
                        />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-semibold">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      id="phone"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                      className="pl-10 h-12 border-slate-200 focus-visible:ring-blue-500/20 rounded-xl bg-slate-50/50 focus:bg-white transition-colors"
                      placeholder="+964..."
                    />
                  </div>
                </div>

                {/* 4. Action Button */}
                <div className="pt-4">
                    <Button 
                        onClick={handleSave} 
                        className="w-full h-12 text-base gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 active:scale-95 transition-all"
                    >
                    <Save className="h-5 w-5" />
                    Save Changes
                    </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default UserDashboard;