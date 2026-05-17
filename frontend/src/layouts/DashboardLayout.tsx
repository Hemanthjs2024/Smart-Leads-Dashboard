import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, 
  Users, 
  BarChart3, 
  Layers, 
  LogOut, 
  ChevronRight,
  Sun,
  Moon,
  X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useThemeStore } from '../store/useThemeStore';

const DashboardLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false); // eslint-disable-line react-hooks/set-state-in-effect
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutGrid },
    { name: 'Leads', path: '/leads', icon: Users },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Pipeline', path: '/pipeline', icon: Layers },
    { name: 'Teams', path: '/teams', icon: Users },
  ];

  const renderSidebarContent = () => (
    <>
      {/* Mobile Close Button */}
      <div className="md:hidden flex justify-end p-4">
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-4">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isDashboard = item.name === 'Dashboard';
          
          const content = (
            <>
              <item.icon size={20} className="mr-3" />
              <span className="font-semibold text-sm">{item.name}</span>
              {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
            </>
          );

          const className = `flex items-center w-full h-12 px-3 rounded-xl transition-all group ${
            isActive 
              ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20' 
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-navy-800 hover:text-gray-900 dark:hover:text-white'
          }`;

          if (isDashboard) {
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (!isActive) navigate('/');
                  // Only close menu if on mobile
                  if (window.innerWidth < 768) setIsMobileMenuOpen(false);
                }}
                className={className}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              to={item.path}
              className={className}
            >
              {content}
            </Link>
          );
        })}
      </nav>



      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 dark:border-navy-800">
        <button 
          onClick={handleLogout}
          className="flex items-center justify-center w-full h-12 px-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20 group"
        >
           <LogOut size={20} className="mr-3" />
           <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-navy-950 flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside 
        className="hidden md:flex w-64 bg-white dark:bg-navy-900 border-r border-gray-200 dark:border-navy-800 flex flex-col z-30"
      >
        {renderSidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <aside 
            className="w-64 h-full bg-white dark:bg-navy-900 flex flex-col animate-in slide-in-from-left duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {renderSidebarContent()}
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden">
        {/* Floating Topbar */}
        <header className="sticky top-0 z-20 h-20 px-4 md:px-8 flex items-center justify-between">
           <div className="flex items-center space-x-4">
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 rounded-xl md:hidden text-gray-500 shadow-sm"
              >
                 <LayoutGrid size={20} />
              </button>

              <div className="flex items-center space-x-3">
                 <div className="flex-shrink-0 p-2 bg-accent-blue rounded-xl shadow-lg shadow-accent-blue/10">
                    <LayoutGrid className="text-white" size={22} />
                 </div>
                 <div>
                   <h1 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight leading-tight">SmartLeads</h1>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Enterprise CRM</p>
                 </div>
              </div>
           </div>

           <div className="flex items-center space-x-3 md:space-x-6">
              <div className="flex items-center space-x-1 md:space-x-2">
                 <button 
                   onClick={toggleTheme}
                   className="p-2.5 bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-800 text-gray-500 hover:text-accent-blue hover:shadow-sm rounded-xl transition-all"
                   title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
                 >
                    {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                 </button>
              </div>
              
              <div className="h-8 w-[1px] bg-gray-200 dark:bg-navy-800 hidden sm:block"></div>

              <Link to="/profile" className="flex items-center space-x-3 pl-0 md:pl-2 group">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-900 dark:text-white leading-none group-hover:text-accent-blue transition-colors">{user?.name}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{user?.role}</p>
                 </div>
                 <div className="h-10 w-10 rounded-xl bg-accent-blue p-0.5 shadow-lg shadow-accent-blue/20 group-hover:scale-110 transition-transform">
                    <div className="h-full w-full rounded-[10px] bg-white dark:bg-navy-900 flex items-center justify-center font-bold text-accent-blue">
                       {user?.name.charAt(0)}
                    </div>
                 </div>
              </Link>
           </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 md:px-8 pb-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
