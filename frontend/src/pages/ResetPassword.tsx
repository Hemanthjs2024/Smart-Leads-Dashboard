import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Lock, Loader2, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authApi } from '../api/auth.api';

const ResetPassword: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return toast.error('Please enter a new password');
    if (password.length < 6) return toast.error('Password must be at least 6 characters');
    if (password !== confirmPassword) return toast.error('Passwords do not match');

    setIsLoading(true);
    try {
      await authApi.resetPassword(token as string, password);
      setIsSuccess(true);
      toast.success('Password reset successful!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Invalid or expired token');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-navy-950 items-center justify-center p-8">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="flex items-center space-x-3 mb-12 justify-center">
          <div className="p-2 bg-accent-blue rounded-xl shadow-lg shadow-accent-blue/20">
            <LayoutGrid className="text-white" size={24} />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">SmartLeads</span>
        </div>

        {!isSuccess ? (
          <div className="bg-navy-900 border border-navy-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-white tracking-tight">Reset Password</h1>
              <p className="text-sm text-gray-400">Choose a new secure password for your account.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-white focus:outline-none focus:border-accent-blue transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-navy-950 border border-navy-800 rounded-xl text-white focus:outline-none focus:border-accent-blue transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-accent-blue hover:bg-accent-indigo text-white font-bold rounded-xl shadow-lg shadow-accent-blue/20 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin mr-2" size={20} />
                    Resetting...
                  </>
                ) : (
                  'Update Password'
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-navy-900 border border-navy-800 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full">
              <CheckCircle2 size={48} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white tracking-tight">All Set!</h2>
              <p className="text-sm text-gray-400">
                Your password has been successfully reset. Redirecting you to login...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
