import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadSchema, type LeadFormValues } from '../../utils/validation';
import { LEAD_STATUS_OPTIONS, LEAD_SOURCE_OPTIONS } from '../../constants';
import { 
  User, 
  Mail, 
  Shield, 
  Zap, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Globe, 
  Camera, 
  Users 
} from 'lucide-react';
import { Controller } from 'react-hook-form';
import Select from '../common/Select';
import Input from '../common/Input';
import Button from '../common/Button';

const STATUS_OPTIONS_WITH_ICONS = LEAD_STATUS_OPTIONS.map(opt => ({
  ...opt,
  icon: opt.value === 'New' ? <Shield size={18} />
      : opt.value === 'Contacted' ? <Phone size={18} />
      : opt.value === 'Qualified' ? <CheckCircle2 size={18} />
      : <XCircle size={18} />
}));

const SOURCE_OPTIONS_WITH_ICONS = LEAD_SOURCE_OPTIONS.map(opt => ({
  ...opt,
  icon: opt.value === 'Website' ? <Globe size={18} />
      : opt.value === 'Instagram' ? <Camera size={18} />
      : <Users size={18} />
}));

interface LeadFormProps {
  initialData?: Partial<LeadFormValues>;
  onSubmit: (data: LeadFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isSubmitting 
}) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      status: 'New',
      source: 'Website',
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Input
        {...register('name')}
        label="Full Name"
        type="text"
        placeholder="e.g. Alex Morgan"
        icon={User}
        error={errors.name?.message}
      />

      <Input
        {...register('email')}
        label="Email Address"
        type="email"
        placeholder="e.g. alex@company.com"
        icon={Mail}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select
              label="Status"
              options={STATUS_OPTIONS_WITH_ICONS}
              value={field.value}
              onChange={field.onChange}
              icon={<Shield size={18} />}
              error={errors.status?.message}
            />
          )}
        />

        <Controller
          name="source"
          control={control}
          render={({ field }) => (
            <Select
              label="Source"
              options={SOURCE_OPTIONS_WITH_ICONS}
              value={field.value}
              onChange={field.onChange}
              icon={<Zap size={18} />}
              error={errors.source?.message}
            />
          )}
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          {initialData ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  );
};

export default LeadForm;
