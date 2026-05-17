import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LayoutGrid, Mail, Lock, User, Shield } from 'lucide-react';
import { registerSchema, type RegisterFormValues } from '../utils/validation';
import { useAuthStore } from '../store/useAuthStore';
import { authApi } from '../api/auth.api';
import { Controller } from 'react-hook-form';
import Select from '../components/common/Select';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Sales User',
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await authApi.register(data);
      localStorage.setItem('token', response.data.token);
      setAuth(response.data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-navy-950 dark">
      {/* Left Section - Preview */}
      <div className="hidden lg:flex w-1/2 relative bg-navy-900 items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent-blue/10 rounded-full blur-3xl -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl -mr-48 -mb-48"></div>

        <div className="w-full max-w-lg z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 py-1.5 px-3 bg-navy-800/50 backdrop-blur-md border border-navy-700 rounded-full">
            <span className="flex h-2 w-2 rounded-full bg-accent-blue animate-pulse"></span>
            <span className="text-xs font-semibold text-blue-300">Join 500+ enterprise teams today</span>
          </div>

          <h1 className="text-5xl font-extrabold text-white tracking-tight leading-tight">
            Accelerate your <span className="text-accent-blue">Sales Pipeline</span> with Intelligence.
          </h1>
          <p className="text-lg text-gray-400">
            The most powerful CRM for modern sales teams. Scale faster with automated lead tracking and advanced analytics.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">99%</p>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Customer Satisfaction</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold text-white">2.4x</p>
              <p className="text-sm text-gray-500 font-bold uppercase tracking-wider">Revenue Growth</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 z-10 bg-navy-950">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center space-x-3 mb-12 lg:hidden">
            <div className="p-2 bg-accent-blue rounded-xl shadow-lg shadow-accent-blue/20">
              <LayoutGrid className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">SmartLeads</span>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
            <p className="text-gray-400">Join the next generation of sales management.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              {...register('name')}
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={User}
              error={errors.name?.message}
            />

            <Input
              {...register('email')}
              label="Email Address"
              type="email"
              placeholder="name@company.com"
              icon={Mail}
              error={errors.email?.message}
            />

            <Input
              {...register('password')}
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              error={errors.password?.message}
            />

            <div className="space-y-0">
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Role"
                    options={[
                      { label: 'Sales User', value: 'Sales User' },
                      { label: 'Admin', value: 'Admin' },
                    ]}
                    value={field.value}
                    onChange={field.onChange}
                    icon={<Shield size={18} />}
                    error={errors.role?.message}
                    triggerClassName="!bg-navy-950/50 !border-navy-800 !text-white"
                  />
                )}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-accent-blue hover:text-accent-indigo transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>

    </div>
  );
};

export default Register;
