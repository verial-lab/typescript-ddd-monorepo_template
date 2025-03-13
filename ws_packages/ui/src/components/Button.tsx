import type React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

/**
 * Button component for user interaction
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  disabled,
  className,
  ...props
}) => {
  // In a real component library, this would include proper styling based on variant and size
  const baseStyles = 'rounded font-medium inline-flex items-center justify-center';
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizeStyles = {
    small: 'py-1 px-3 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  const loadingStyles = isLoading ? 'opacity-70 cursor-not-allowed' : '';
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const buttonStyles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    loadingStyles,
    disabledStyles,
    className,
  ].join(' ');

  return (
    <button className={buttonStyles} disabled={disabled || isLoading} {...props}>
      {isLoading && <span className="mr-2">Loading...</span>}
      {children}
    </button>
  );
};

export default Button;
