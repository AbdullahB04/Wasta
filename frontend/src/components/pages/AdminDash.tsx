import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, 
  Briefcase, 
  Star, 
  MessageSquare, 
  TrendingUp, 
  Shield,
  Search,
  Trash2,
  Plus,
  Edit,
  Check,
  X,
  Power,
  PowerOff,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { useToast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';

interface Stats {
  totalUsers: number;
  totalWorkers: number;
  totalServices: number;
  totalFeedback: number;
  activeWorkers: number;
  inactiveWorkers: number;
  recentUsers: number;
  avgRating: string;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  image: string;
  role: string;
  createdAt: string;
  _count: {
    feedbacks: number;
  };
}

interface Worker {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  position: string;
  image: string;
  isActive: boolean;
  createdAt: string;
  avgRating: string;
  _count: {
    feedbacks: number;
  };
}

interface Service {
  id: string;
  name: string;
  createdAt: string;
  _count: {
    WorkerService: number;
  };
}

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    image: string;
  };
  worker: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
  };
}

const AdminDashboard = () => {
  usePageTitle('Admin Dashboard');
  const { dbUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'workers' | 'services' | 'feedback'>('overview');
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [newServiceName, setNewServiceName] = useState('');
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editServiceName, setEditServiceName] = useState('');

  // Check if user is admin
  useEffect(() => {
    if (!dbUser) {
      navigate('/login');
      return;
    }
    
    if (dbUser.role !== 'ADMIN') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [dbUser, navigate]);

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'overview') {
          const res = await fetch('http://localhost:3000/admin/stats');
          const data = await res.json();
          setStats(data);
        } else if (activeTab === 'users') {
          const res = await fetch('http://localhost:3000/admin/users');
          const data = await res.json();
          setUsers(data);
        } else if (activeTab === 'workers') {
          const res = await fetch('http://localhost:3000/admin/workers');
          const data = await res.json();
          setWorkers(data);
        } else if (activeTab === 'services') {
          const res = await fetch('http://localhost:3000/admin/services');
          const data = await res.json();
          setServices(data);
        } else if (activeTab === 'feedback') {
          const res = await fetch('http://localhost:3000/admin/feedbacks');
          const data = await res.json();
          setFeedbacks(data);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        toast({
          title: "Error",
          description: "Failed to load data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleToggleWorkerStatus = async (workerId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/admin/workers/${workerId}/toggle-active`, {
        method: 'PATCH',
      });

      if (res.ok) {
        const updatedWorker = await res.json();
        setWorkers(workers.map(w => w.id === workerId ? { ...w, isActive: updatedWorker.isActive } : w));
        toast({
          title: "Success",
          description: `Worker ${updatedWorker.isActive ? 'activated' : 'deactivated'} successfully`,
        });
      }
    } catch (error) {
      console.error('Toggle error:', error);
      toast({
        title: "Error",
        description: "Failed to update worker status",
        variant: "destructive",
      });
    }
  };

  const handleDeleteWorker = async (workerId: string) => {
    if (!confirm('Are you sure you want to delete this worker?')) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/workers/${workerId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setWorkers(workers.filter(w => w.id !== workerId));
        toast({
          title: "Success",
          description: "Worker deleted successfully",
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete worker",
        variant: "destructive",
      });
    }
  };

  const handleAddService = async () => {
    if (!newServiceName.trim()) return;

    try {
      const res = await fetch('http://localhost:3000/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newServiceName }),
      });

      if (res.ok) {
        const newService = await res.json();
        setServices([...services, { ...newService, _count: { WorkerService: 0 } }]);
        setNewServiceName('');
        toast({
          title: "Success",
          description: "Service added successfully",
        });
      }
    } catch (error) {
      console.error('Add service error:', error);
      toast({
        title: "Error",
        description: "Failed to add service",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async (serviceId: string) => {
    if (!editServiceName.trim()) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/services/${serviceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editServiceName }),
      });

      if (res.ok) {
        const updatedService = await res.json();
        setServices(services.map(s => s.id === serviceId ? { ...s, name: updatedService.name } : s));
        setEditingService(null);
        setEditServiceName('');
        toast({
          title: "Success",
          description: "Service updated successfully",
        });
      }
    } catch (error) {
      console.error('Update service error:', error);
      toast({
        title: "Error",
        description: "Failed to update service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/services/${serviceId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setServices(services.filter(s => s.id !== serviceId));
        toast({
          title: "Success",
          description: "Service deleted successfully",
        });
      } else {
        const error = await res.json();
        toast({
          title: "Error",
          description: error.error || "Failed to delete service",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Delete service error:', error);
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;

    try {
      const res = await fetch(`http://localhost:3000/admin/feedbacks/${feedbackId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFeedbacks(feedbacks.filter(f => f.id !== feedbackId));
        toast({
          title: "Success",
          description: "Feedback deleted successfully",
        });
      }
    } catch (error) {
      console.error('Delete feedback error:', error);
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredWorkers = workers.filter(w =>
    w.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFeedbacks = feedbacks.filter(f =>
    f.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.worker.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.comment && f.comment.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                </div>
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="gap-2">
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'users', 'workers', 'services', 'feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 font-semibold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-blue-600 border-blue-600'
                    : 'text-slate-500 border-transparent hover:text-slate-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Total Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-slate-900">{stats.totalUsers}</div>
                      <Users className="w-8 h-8 text-blue-600" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      +{stats.recentUsers} in last 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Total Workers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-slate-900">{stats.totalWorkers}</div>
                      <Briefcase className="w-8 h-8 text-green-600" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      {stats.activeWorkers} active, {stats.inactiveWorkers} inactive
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Services</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-slate-900">{stats.totalServices}</div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Active categories
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-500">Avg Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl font-bold text-slate-900">{stats.avgRating}</div>
                      <Star className="w-8 h-8 text-amber-500 fill-amber-500" />
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      From {stats.totalFeedback} reviews
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Users ({filteredUsers.length})</CardTitle>
                    <CardDescription>Manage platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={user.image || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}`}
                              alt={user.firstName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-slate-500">{user.email}</p>
                              <p className="text-xs text-slate-400">
                                {user._count.feedbacks} reviews • Joined {new Date(user.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Button
                            onClick={() => handleDeleteUser(user.id)}
                            variant="destructive"
                            size="sm"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Workers Tab */}
            {activeTab === 'workers' && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search workers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Workers ({filteredWorkers.length})</CardTitle>
                    <CardDescription>Manage platform workers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredWorkers.map((worker) => (
                        <div
                          key={worker.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <img
                              src={worker.image || `https://ui-avatars.com/api/?name=${worker.firstName}+${worker.lastName}`}
                              alt={worker.firstName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900">
                                  {worker.firstName} {worker.lastName}
                                </h3>
                                <Badge variant={worker.isActive ? "default" : "secondary"}>
                                  {worker.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                              <p className="text-sm text-slate-600">{worker.position}</p>
                              <p className="text-xs text-slate-400">
                                ⭐ {worker.avgRating} • {worker._count.feedbacks} reviews
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleToggleWorkerStatus(worker.id)}
                              variant="outline"
                              size="sm"
                            >
                              {worker.isActive ? (
                                <PowerOff className="w-4 h-4" />
                              ) : (
                                <Power className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              onClick={() => handleDeleteWorker(worker.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Services Tab */}
            {activeTab === 'services' && (
              <div>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle>Add New Service</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Service name..."
                        value={newServiceName}
                        onChange={(e) => setNewServiceName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAddService()}
                      />
                      <Button onClick={handleAddService}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>All Services ({services.length})</CardTitle>
                    <CardDescription>Manage service categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {services.map((service) => (
                        <div
                          key={service.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                        >
                          {editingService === service.id ? (
                            <>
                              <Input
                                type="text"
                                value={editServiceName}
                                onChange={(e) => setEditServiceName(e.target.value)}
                                className="flex-1 mr-2"
                              />
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handleUpdateService(service.id)}
                                  size="sm"
                                  variant="default"
                                >
                                  <Check className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => {
                                    setEditingService(null);
                                    setEditServiceName('');
                                  }}
                                  size="sm"
                                  variant="outline"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <h3 className="font-semibold text-slate-900 capitalize">
                                  {service.name}
                                </h3>
                                <p className="text-xs text-slate-500">
                                  {service._count.WorkerService} workers using this service
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => {
                                    setEditingService(service.id);
                                    setEditServiceName(service.name);
                                  }}
                                  size="sm"
                                  variant="outline"
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  onClick={() => handleDeleteService(service.id)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Feedback Tab */}
            {activeTab === 'feedback' && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      type="text"
                      placeholder="Search feedback..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>All Feedback ({filteredFeedbacks.length})</CardTitle>
                    <CardDescription>Moderate user reviews</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {filteredFeedbacks.map((feedback) => (
                        <div
                          key={feedback.id}
                          className="p-4 bg-slate-50 rounded-lg"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <img
                                src={feedback.user.image || `https://ui-avatars.com/api/?name=${feedback.user.firstName}`}
                                alt={feedback.user.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <h4 className="font-semibold text-slate-900">
                                  {feedback.user.firstName} {feedback.user.lastName}
                                </h4>
                                <p className="text-xs text-slate-500">
                                  Review for {feedback.worker.firstName} {feedback.worker.lastName} ({feedback.worker.position})
                                </p>
                              </div>
                            </div>
                            <Button
                              onClick={() => handleDeleteFeedback(feedback.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < feedback.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-slate-300'
                                }`}
                              />
                            ))}
                          </div>
                          {feedback.comment && (
                            <p className="text-sm text-slate-700">{feedback.comment}</p>
                          )}
                          <p className="text-xs text-slate-400 mt-2">
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
