import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import type { UserRole } from '../../types';

interface HasPermissionProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const HasPermission: React.FC<HasPermissionProps> = ({ 
  roles, 
  children, 
  fallback = null 
}) => {
  const user = useAuthStore((state) => state.user);

  if (!user || !roles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default HasPermission;
