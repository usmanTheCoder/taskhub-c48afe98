'use client';

import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { IconType } from 'react-icons';
import { BsLoader } from 'react-icons/bs';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  icon?: IconType;
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      isLoading = false,
      children,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const colors = {
      primary: {
        base: 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500',
        text: 'text-white',
      },
      secondary: {
        base: 'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500',
        text: 'text-white',
      },
      danger: {
        base: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
        text: 'text-white',
      },
      success: {
        base: 'bg-green-600 hover:bg-green-700 focus:ring-green-500',
        text: 'text-white',
      },
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          'inline-flex items-center justify-center font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
          colors[variant].base,
          colors[variant].text,
          sizes[size],
          className
        )}
        {...rest}
      >
        {isLoading && (
          <BsLoader className="mr-2 animate-spin" aria-label="Loading" />
        )}
        {Icon && <Icon className="mr-2" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
```

This code defines a reusable Button component for the UI. It allows customization through props such as `variant` (primary, secondary, danger, success), `size` (sm, md, lg), `icon` (from react-icons library), `isLoading` (to show a loading spinner), and standard button props like `onClick`, `disabled`, etc.

The component uses Tailwind CSS utilities for styling and animations. It supports different color variants, sizes, and displays an icon or loading spinner if provided. The button is rendered as a `button` HTML element and uses the `forwardRef` pattern for better accessibility and integration with libraries like React Hook Form.

The component is built with TypeScript for type safety and follows best practices like using `clsx` for conditional class names, destructuring props, and providing default values for optional props.