import React from 'react';
import { ApprovalStatus } from '@/types/phone';

interface StatusBadgeProps {
  status: ApprovalStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles = {
    Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 ring-emerald-500/20',
    Rejected: 'bg-rose-50 text-rose-700 border-rose-200/80 ring-rose-500/20',
    Pending: 'bg-amber-50 text-amber-700 border-amber-200/80 ring-amber-500/20',
  };

  const dotStyles = {
    Approved: 'bg-emerald-500 animate-pulse',
    Rejected: 'bg-rose-500',
    Pending: 'bg-amber-500 animate-pulse',
  };

  const labels = {
    Approved: 'Approved',
    Rejected: 'Rejected',
    Pending: 'Pending',
  };

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1.5 font-medium',
    md: 'px-3 py-1 text-xs sm:text-sm gap-2 font-medium',
    lg: 'px-4 py-1.5 text-sm gap-2.5 font-semibold',
  };

  const currentStyle = styles[status] || styles.Pending;
  const currentDot = dotStyles[status] || dotStyles.Pending;
  const currentLabel = labels[status] || status;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-2xs transition-all ${currentStyle} ${sizeClasses[size]}`}
    >
      <span className={`h-2 w-2 rounded-full ${currentDot}`} />
      <span>{currentLabel}</span>
    </span>
  );
};
