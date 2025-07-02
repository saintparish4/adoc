import React from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  asChild?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false,
    icon,
    iconPosition = 'left',
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseClasses = [
      'btn',
      'inline-flex items-center justify-center gap-2',
      'font-medium transition-all duration-150',
      'focus-visible:outline-2 focus-visible:outline-blue-500 focus-visible:outline-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
    ];

    const variantClasses = {
      primary: 'btn-primary bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600',
      secondary: 'btn-secondary bg-gray-100 text-gray-900 border-gray-200 hover:bg-gray-200 hover:border-gray-300',
      ghost: 'btn-ghost bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-gray-900',
      outline: 'bg-transparent text-blue-500 border-blue-500 hover:bg-blue-50',
      destructive: 'bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600',
    };

    const sizeClasses = {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-3 text-sm',
      lg: 'px-6 py-4 text-base',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    return (
      <button
        className={classes}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && icon}
        {children}
        {!loading && icon && iconPosition === 'right' && icon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button }; 