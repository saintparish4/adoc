import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'gray';
  size?: 'sm' | 'md' | 'lg';
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md',
    children, 
    ...props 
  }, ref) => {
    const baseClasses = [
      'badge',
      'inline-flex items-center justify-center',
      'font-medium rounded-full',
      'transition-colors duration-150',
    ];

    const variantClasses = {
      primary: 'bg-blue-100 text-blue-700',
      secondary: 'bg-purple-100 text-purple-700',
      success: 'bg-green-50 text-green-600',
      warning: 'bg-yellow-50 text-yellow-600',
      error: 'bg-red-50 text-red-600',
      gray: 'bg-gray-100 text-gray-700',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-sm',
      lg: 'px-3 py-1.5 text-base',
    };

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge }; 