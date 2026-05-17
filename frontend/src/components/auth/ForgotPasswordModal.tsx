import React, { useState } from 'react';
import { Mail, Loader2, X, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authApi } from '../../api/auth.api';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
      toast.success('Reset link sent!');
    } catch (err) {
      console.error('Forgot Password Error:', err);
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const message = e.response?.data?.message || e.message || 'Something went wrong';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-navy-900 border border-navy-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-8 sm:p-10">
          {!isSuccess ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Forgot Password?</h2>
                <p className="text-sm text-gray-400">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
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
                      Sending Link...
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </div>
          ) : (
            <div className="text-center space-y-6 py-4">
              <div className="inline-flex items-center justify-center p-4 bg-emerald-500/10 text-emerald-500 rounded-full mb-2">
                <CheckCircle2 size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white tracking-tight">Check Your Email</h2>
                <p className="text-sm text-gray-400">
                  We've sent a password reset link to <span className="text-white font-medium">{email}</span>.
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-xl transition-all"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
