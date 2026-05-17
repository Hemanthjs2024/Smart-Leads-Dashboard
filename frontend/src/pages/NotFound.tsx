import React from 'react';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-950 p-6 transition-colors duration-300">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
           <div className="text-[12rem] font-black text-gray-100 dark:text-navy-900 leading-none select-none">404</div>
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-5 bg-rose-50 dark:bg-rose-900/20 rounded-[2.5rem] text-rose-600 shadow-2xl shadow-rose-600/10">
                 <AlertCircle size={64} strokeWidth={1.5} />
              </div>
           </div>
        </div>

        <div className="space-y-4">
           <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Lost in the Pipeline?</h1>
           <p className="text-gray-500 dark:text-gray-400 text-lg font-medium leading-relaxed">
             The page you're looking for has either moved or never existed in our database.
           </p>
        </div>

        <div className="pt-8">
           <Link 
             to="/" 
             className="inline-flex items-center px-8 py-4 bg-accent-blue hover:bg-accent-indigo text-white font-bold rounded-2xl shadow-lg shadow-accent-blue/20 transition-all group"
           >
             <Home size={20} className="mr-3 group-hover:-translate-y-0.5 transition-transform" />
             Return to Dashboard
           </Link>
        </div>

        <div className="pt-12 flex items-center justify-center space-x-6">
           <div className="h-[1px] flex-1 bg-gray-100 dark:bg-navy-800"></div>
           <span className="text-[10px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-[0.2em]">Smart Leads Enterprise</span>
           <div className="h-[1px] flex-1 bg-gray-100 dark:bg-navy-800"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
