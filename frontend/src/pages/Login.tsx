import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LayoutGrid, Mail, Lock } from 'lucide-react';
import { loginSchema, type LoginFormValues } from '../utils/validation';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/auth.api';
import ForgotPasswordModal from '../components/auth/ForgotPasswordModal';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.login(data);
      localStorage.setItem('token', response.data.token);
      setAuth(response.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-navy-950 dark">
      {/* Left Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center space-x-3 mb-12">
            <div className="p-2 bg-accent-blue rounded-xl shadow-lg shadow-accent-blue/20">
              <LayoutGrid className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SmartLeads</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p className="text-gray-400">Enter your credentials to access your command center.</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" fullWidth>Google</Button>
            <Button variant="outline" fullWidth>GitHub</Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-navy-800"></div>
            </div>
            <div className="relative flex justify-center text-sm uppercase">
              <span className="bg-navy-950 px-4 text-gray-500 font-medium">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('email')}
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              error={errors.email?.message}
            />

            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <button 
                  type="button" 
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-xs font-semibold text-accent-blue hover:text-accent-indigo cursor-pointer transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                icon={Lock}
                error={errors.password?.message}
              />
            </div>

            <div className="flex items-center">
              <input type="checkbox" className="w-4 h-4 rounded bg-navy-900 border-navy-700 text-accent-blue focus:ring-accent-blue" />
              <label className="ml-2 text-sm text-gray-400">Keep me logged in for 30 days</label>
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Sign In to Dashboard
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-bold text-accent-blue hover:text-accent-indigo transition-colors">
              Create account
            </Link>
          </p>
        </div>
      </div>

      {/* Right Section - Decorative/Preview */}
      <div className="hidden lg:flex w-1/2 relative bg-navy-900 items-center justify-center p-12 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -ml-48 -mb-48"></div>

        <div className="w-full max-w-lg z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 py-1.5 px-3 bg-navy-800/50 backdrop-blur-md border border-navy-700 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-accent-blue animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-300">Trusted by 500+ enterprise teams</span>
          </div>

          <div className="dark-glass-card p-1 rounded-3xl">
            <div className="bg-navy-950/50 rounded-[1.4rem] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                </div>
                <div className="px-3 py-1 bg-navy-800 rounded-lg text-[10px] text-gray-500 font-mono">app.smartleads.ai/dashboard</div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: 'Active Leads', value: '24,402', color: 'text-white' },
                  { label: 'Conversion', value: '12.4%', color: 'text-green-400' },
                  { label: 'Revenue', value: '$1.2M', color: 'text-white' },
                ].map((s) => (
                  <div key={s.label} className="p-4 bg-navy-900/50 border border-navy-800 rounded-2xl">
                    <p className="text-[10px] text-gray-500 font-semibold mb-1 uppercase tracking-wider">{s.label}</p>
                    <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="h-32 w-full bg-navy-900/50 border border-navy-800 rounded-2xl p-4 flex items-end justify-between space-x-2">
                {[40, 60, 30, 80, 70, 95, 65, 45].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 bg-accent-blue/80 rounded-t-sm"
                    style={{ height: `${h}%`, opacity: 0.5 + (h / 200) }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center space-y-4 pt-8">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em]">Powering Growth for Industry Leaders</p>
            <div className="flex justify-center items-center space-x-8 opacity-40 grayscale contrast-125">
              <span className="text-white font-bold tracking-tighter text-xl">TECHNO</span>
              <span className="text-white font-bold tracking-tighter text-xl">DELTA</span>
              <span className="text-white font-bold tracking-tighter text-xl">ORBIT</span>
            </div>
          </div>
        </div>
      </div>
      
      <ForgotPasswordModal 
        isOpen={isForgotPasswordOpen} 
        onClose={() => setIsForgotPasswordOpen(false)} 
      />
    </div>
  );
};

export default Login;
