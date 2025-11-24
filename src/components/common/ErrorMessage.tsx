import React from 'react';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  type?: 'error' | 'warning' | 'info' | 'success';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onDismiss,
  type = 'error',
}) => {
  const variants = {
    error: {
      bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
      border: 'border-red-200/60 dark:border-red-700/50',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-800 dark:text-red-200',
      iconPath: 'M6 18L18 6M6 6l12 12', // X icon
    },
    warning: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-900/20 dark:to-amber-800/20',
      border: 'border-yellow-200/60 dark:border-yellow-700/50',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-800 dark:text-yellow-200',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z', // Warning triangle
    },
    info: {
      bg: 'bg-gradient-to-br from-blue-50 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-800/20',
      border: 'border-blue-200/60 dark:border-blue-700/50',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-800 dark:text-blue-200',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', // Info circle
    },
    success: {
      bg: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-800/20',
      border: 'border-green-200/60 dark:border-green-700/50',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-800 dark:text-green-200',
      iconPath: 'M5 13l4 4L19 7', // Check icon
    },
  };

  const variant = variants[type];

  return (
    <div
      className={`border-2 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm animate-fade-in ${variant.bg} ${variant.border}`}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Icon */}
        <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-white/50 dark:bg-black/20 shadow-sm ${variant.icon}`}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={variant.iconPath}
            />
          </svg>
        </div>

        {/* Message */}
        <div className="flex-1 pt-1">
          <p className={`font-medium leading-relaxed ${variant.text}`}>{message}</p>
        </div>
      </div>

      {/* Dismiss Button */}
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/50 dark:hover:bg-black/20 transition-all duration-200 hover:scale-110 active:scale-95 ${variant.icon}`}
          aria-label="Dismiss"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

