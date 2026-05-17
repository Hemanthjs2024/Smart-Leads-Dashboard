import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Target, 
  DollarSign, 
  Zap, 
  Calendar,
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip,
} from 'recharts';
import { dashboardApi } from '../api/dashboard.api';
import type { DashboardStats } from '../api/dashboard.api';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useThemeStore } from '../store/useThemeStore';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1'];

const Dashboard: React.FC = () => {
  const { theme } = useThemeStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardApi.getStats();
        setStats(response.data);
      } catch {
        toast.error('Failed to load dashboard statistics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-200 dark:bg-navy-800 animate-pulse rounded-lg"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white dark:bg-navy-900 rounded-2xl animate-pulse"></div>)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
           <div className="lg:col-span-2 h-80 bg-white dark:bg-navy-900 rounded-2xl animate-pulse"></div>
           <div className="h-80 bg-white dark:bg-navy-900 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const statusData = Object.entries(stats.statusBreakdown).map(([name, value]) => ({ name, value }));
  
  const statCards = [
    { name: 'Total Leads', value: stats.totalLeads.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { name: 'Qualified', value: (stats.statusBreakdown['Qualified'] || 0).toString(), icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { name: 'In Progress', value: (stats.statusBreakdown['Contacted'] || 0).toString(), icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { name: 'Lost', value: (stats.statusBreakdown['Lost'] || 0).toString(), icon: DollarSign, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  ];

  return (
    <div className="space-y-4 pb-4">
      {/* Page Title & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Executive Overview</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">Real-time performance metrics and sales intelligence.</p>
        </div>
        <div className="flex items-center space-x-3">
           <button 
             onClick={() => toast.success('Selecting date range...')}
             className="flex items-center px-4 py-2.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold hover:bg-gray-50 dark:hover:bg-navy-800 transition-all shadow-sm"
           >
              <Calendar size={16} className="mr-2 text-gray-400" />
              Last 30 Days
           </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white dark:bg-navy-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-800 group hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-navy-950/50 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div className={`p-4 rounded-2xl ${card.bg} ${card.color} transition-colors`}>
                <card.icon size={24} />
              </div>
            </div>
            <div className="mt-6">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">{card.name}</p>
              <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1 tracking-tight">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-navy-900 p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-800 flex flex-col h-full">
           <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Leads by Status</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Current distribution of pipeline stages</p>
           </div>
           <div className="flex-1 h-40 min-h-[160px]">
             {statusData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={statusData}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={8}
                     dataKey="value"
                   >
                     {statusData.map((_, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ 
                       borderRadius: '16px', 
                       border: 'none', 
                       boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
                       backgroundColor: theme === 'dark' ? '#1e293b' : '#ffffff',
                       color: theme === 'dark' ? '#f8fafc' : '#0f172a'
                     }}
                   />
                 </PieChart>
               </ResponsiveContainer>
             ) : (
               <div className="h-full flex items-center justify-center text-gray-400 text-xs font-bold uppercase tracking-widest italic">
                  No status data available
               </div>
             )}
           </div>
           
           <div className="mt-6 space-y-3">
              {statusData.map((item, i) => (
                <div key={item.name} className="flex items-center justify-between">
                   <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{item.name}</span>
                   </div>
                   <span className="text-xs font-black text-gray-900 dark:text-white">{item.value}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Recent Leads Table */}
        <div className="lg:col-span-2 bg-white dark:bg-navy-900 rounded-3xl shadow-sm border border-gray-100 dark:border-navy-800 overflow-hidden flex flex-col">
           <div className="p-5 border-b border-gray-50 dark:border-navy-800 flex items-center justify-between">
              <div>
                 <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">Recent Activity</h2>
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Latest leads added to the system</p>
              </div>
              <Link to="/leads" className="px-4 py-2 bg-gray-50 dark:bg-navy-800 text-gray-600 dark:text-gray-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent-blue hover:text-white transition-all">View All</Link>
           </div>
           <div className="flex-1 overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                     <tr className="bg-gray-50/50 dark:bg-navy-800/50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="px-5 py-3">Lead</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Date</th>
                     </tr>
                  </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-navy-800">
                    {stats.recentLeads.length > 0 ? (
                      stats.recentLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50/50 dark:hover:bg-navy-800/30 transition-colors group">
                           <td className="px-5 py-3">
                              <div className="flex items-center space-x-3">
                                 <div className="h-8 w-8 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-accent-blue flex items-center justify-center font-bold text-xs">
                                    {lead.name.charAt(0)}
                                 </div>
                                 <span className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-accent-blue transition-colors">{lead.name}</span>
                              </div>
                           </td>
                           <td className="px-5 py-3">
                              <span className={`inline-flex px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg ${
                                lead.status === 'Qualified' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' :
                                lead.status === 'Lost' ? 'bg-rose-50 dark:bg-rose-900/20 text-rose-600' :
                                'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'
                              }`}>
                                {lead.status}
                              </span>
                           </td>
                           <td className="px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400">
                              {new Date(lead.createdAt).toLocaleDateString()}
                           </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-gray-400 font-bold uppercase tracking-widest text-xs italic">
                           No recent leads found
                        </td>
                      </tr>
                    )}
                 </tbody>
              </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
