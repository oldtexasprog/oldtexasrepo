'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/useAuth';
import { checkPermission, type PermissionAction } from '@/lib/auth/permissions';

interface CanProps {
  action: PermissionAction;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function Can({ action, children, fallback = null }: CanProps) {
  const { userData } = useAuth();
  const allowed = checkPermission(userData, action);
  return <>{allowed ? children : fallback}</>;
}


