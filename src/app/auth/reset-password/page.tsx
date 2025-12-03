'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { validateEmail } from '@/utils/validators';
import { useAuth } from '@/hooks/useAuth';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const { resetPassword, confirmPasswordReset, isLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  // Check if we have a reset token in the URL
  const oobCode = searchParams?.get('oobCode');
  const mode = searchParams?.get('mode');

  const isResetMode = mode === 'resetPassword' && oobCode;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'email') {
      setEmail(value);
      if (errors.email) {
        setErrors((prev) => ({
          ...prev,
          email: '',
        }));
      }
    } else if (name === 'newPassword') {
      setNewPassword(value);
      if (errors.newPassword) {
        setErrors((prev) => ({
          ...prev,
          newPassword: '',
        }));
      }
    } else if (name === 'confirmPassword') {
      setConfirmPassword(value);
      if (errors.confirmPassword) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: '',
        }));
      }
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await resetPassword(email);

    if (result.success) {
      setSubmitted(true);
      setEmail('');
    } else {
      setErrors({
        submit: result.error || 'Password reset failed. Please try again.',
      });
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { [key: string]: string } = {};

    if (newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await confirmPasswordReset(oobCode!, newPassword);

    if (result.success) {
      setResetSuccess(true);
    } else {
      setErrors({
        submit: result.error || 'Password reset failed. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-lg p-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary mb-2">CodeGuideX</h1>
          <h2 className="text-2xl font-bold text-gray-900">
            {isResetMode ? 'Set New Password' : 'Reset Password'}
          </h2>
          <p className="mt-2 text-gray-600">
            {isResetMode
              ? 'Enter your new password below'
              : 'Enter your email to receive password reset instructions'
            }
          </p>
        </div>

        {resetSuccess ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Your password has been successfully reset! You can now log in with your new password.
              </p>
            </div>

            <Link href="/auth/login" className="btn-primary w-full text-center block">
              Go to Login
            </Link>
          </div>
        ) : submitted && !isResetMode ? (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 text-sm">
                Check your email for password reset instructions. If you don't see it,
                check your spam folder.
              </p>
            </div>

            <button
              onClick={() => setSubmitted(false)}
              className="btn-secondary w-full"
            >
              Send another email
            </button>

            <div className="text-center">
              <Link href="/auth/login" className="text-primary hover:underline text-sm">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={isResetMode ? handleConfirmReset : handleRequestReset} className="space-y-4">
            {!isResetMode && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange}
                  className="input-field mt-1"
                  placeholder="your@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>
            )}

            {isResetMode && (
              <>
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Enter new password"
                    disabled={isLoading}
                  />
                  {errors.newPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="input-field mt-1"
                    placeholder="Confirm new password"
                    disabled={isLoading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading
                ? (isResetMode ? 'Resetting...' : 'Sending...')
                : (isResetMode ? 'Reset Password' : 'Send Reset Link')
              }
            </button>

            <div className="text-center text-sm text-gray-600 space-y-2">
              <p>
                Remember your password?{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Back to login
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
