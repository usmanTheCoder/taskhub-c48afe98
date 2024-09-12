'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { IconType } from 'react-icons';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  icon?: IconType;
  iconPosition?: 'left' | 'right';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      errorMessage,
      icon: Icon,
      iconPosition = 'left',
      className,
      ...props
    },
    ref
  ) => {
    const inputClassName = `${className} w-full px-4 py-2 border rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500`;

    return (
      <div className="flex flex-col">
        {label && (
          <label className="mb-1 text-sm font-medium text-gray-700" htmlFor={props.id || props.name}>
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && iconPosition === 'left' && (
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
          )}
          <input
            ref={ref}
            {...props}
            className={`${inputClassName} ${
              Icon && iconPosition === 'left' ? 'pl-10' : 'pl-4'
            } ${Icon && iconPosition === 'right' ? 'pr-10' : 'pr-4'} ${
              errorMessage ? 'border-red-500' : ''
            }`}
          />
          {Icon && iconPosition === 'right' && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Icon className="w-5 h-5 text-gray-500" />
            </div>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-red-500">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
```

This is a highly reusable and customizable Input component built with React and Tailwind CSS. It implements advanced features like icon support, error messaging, and focus styles. The component is built using the `forwardRef` pattern to allow for seamless integration with other libraries or components that require direct access to the input element's ref.











This Input component can be easily integrated into the larger project and used throughout the application, promoting code reusability and consistency. It can be further extended or customized as needed to meet additional requirements or design considerations.