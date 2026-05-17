import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { 
  User, 
  Mail, 
  Shield, 
  Camera, 
  Calendar
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);



  const handleAvatarClick = () => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
      toast.success('Avatar feature coming soon!');
    }, 1500);
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your personal information and preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-navy-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-navy-800 shadow-sm text-center">
            <div className="relative inline-block group">
              <div className="h-32 w-32 rounded-[2rem] bg-accent-blue p-0.5 shadow-xl shadow-accent-blue/20">
                <div className="h-full w-full rounded-[1.8rem] bg-white dark:bg-navy-900 flex items-center justify-center text-4xl font-black text-accent-blue uppercase">
                  {user.name.charAt(0)}
                </div>
              </div>
              <button 
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute -bottom-2 -right-2 p-3 bg-white dark:bg-navy-800 border border-gray-100 dark:border-navy-700 rounded-2xl shadow-lg text-gray-500 hover:text-accent-blue hover:scale-110 transition-all disabled:opacity-50"
              >
                <Camera size={18} className={isUploading ? 'animate-bounce' : ''} />
              </button>
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span className="status-pill bg-blue-50 dark:bg-blue-900/20 text-accent-blue border border-blue-100 dark:border-blue-900/30">
                {user.role}
              </span>
            </div>

            <div className="mt-10 space-y-4 text-left">
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <div className="p-2 bg-gray-50 dark:bg-navy-800 rounded-xl">
                  <Mail size={16} />
                </div>
                <span className="text-sm font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-500 dark:text-gray-400">
                <div className="p-2 bg-gray-50 dark:bg-navy-800 rounded-xl">
                  <Shield size={16} />
                </div>
                <span className="text-sm font-semibold">Verified Account</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - User Details & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-navy-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-navy-800 shadow-sm">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest mb-8 flex items-center">
              <div className="w-1.5 h-6 bg-accent-blue rounded-full mr-4"></div>
              Account Details
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Full Name</label>
                <div className="flex items-center space-x-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-accent-blue rounded-lg">
                    <User size={18} />
                  </div>
                  <span className="font-bold">{user.name}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center space-x-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-lg">
                    <Mail size={18} />
                  </div>
                  <span className="font-bold">{user.email}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Access Level</label>
                <div className="flex items-center space-x-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-lg">
                    <Shield size={18} />
                  </div>
                  <span className="font-bold">{user.role}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Joined On</label>
                <div className="flex items-center space-x-3 text-gray-900 dark:text-white">
                  <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 text-accent-indigo rounded-lg">
                    <Calendar size={18} />
                  </div>
                  <span className="font-bold">May 16, 2026</span>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-50 dark:border-navy-800">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center md:text-left">
                     <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">124</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Leads Managed</p>
                  </div>
                  <div className="text-center md:text-left">
                     <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">85%</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Conversion Rate</p>
                  </div>
                  <div className="text-center md:text-left">
                     <p className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">24h</p>
                     <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Avg. Response</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
