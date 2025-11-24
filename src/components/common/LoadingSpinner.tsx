import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullPage?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Loading...',
  fullPage = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-12 h-12 border-3',
    lg: 'w-16 h-16 border-4',
  }[size];

  const spinner = (
    <div className="relative">
      {/* Main gradient spinner */}
      <div
        className={`${sizeClasses} border-transparent border-t-blue-500 border-r-purple-500 border-b-indigo-500 rounded-full animate-spin`}
        style={{
          background: 'conic-gradient(from 0deg, transparent, rgba(99, 102, 241, 0.3))',
        }}
      />
      {/* Inner glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 blur-sm animate-pulse" />
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/50 backdrop-blur-sm z-50">
        <div className="glass-card p-8 rounded-2xl flex flex-col items-center animate-scale-up">
          {spinner}
          {message && (
            <p className="mt-6 text-gray-700 dark:text-gray-200 font-medium text-lg animate-pulse">
              {message}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      {spinner}
      {message && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 font-medium animate-fade-in-delay">
          {message}
        </p>
      )}
    </div>
  );
};


