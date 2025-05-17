import React from 'react';
import { cn } from '../utils';

const Avatar = ({ src, name = '', size = 'md', status, className }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : '?';

  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColorClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  const finalSize = sizeClasses[size] ? size : 'md';

  return (
    <div className={cn('relative inline-block', className)}>
      {src ? (
        <img
          className={cn(
            sizeClasses[finalSize],
            'rounded-full object-cover border border-gray-200'
          )}
          src={src}
          alt={name}
        />
      ) : (
        <div
          className={cn(
            sizeClasses[finalSize],
            'rounded-full flex items-center justify-center bg-indigo-100 text-indigo-700 font-medium'
          )}
        >
          {initials}
        </div>
      )}
      {status && (
        <span
          className={cn(
            'absolute right-0 bottom-0 rounded-full ring-2 ring-white',
            statusColorClasses[status],
            statusSizeClasses[finalSize]
          )}
        />
      )}
    </div>
  );
};

export default Avatar;
