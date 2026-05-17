export const APP_ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  LEADS: '/leads',
  LEAD_DETAILS: '/leads/:id',
  PROFILE: '/profile',
} as const;

export const LEAD_STATUS_OPTIONS = [
  { label: 'New', value: 'New', color: 'bg-blue-100 text-blue-800' },
  { label: 'Contacted', value: 'Contacted', color: 'bg-yellow-100 text-yellow-800' },
  { label: 'Qualified', value: 'Qualified', color: 'bg-green-100 text-green-800' },
  { label: 'Lost', value: 'Lost', color: 'bg-red-100 text-red-800' },
] as const;

export const LEAD_SOURCE_OPTIONS = [
  { label: 'Website', value: 'Website' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Referral', value: 'Referral' },
] as const;
