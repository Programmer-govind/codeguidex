import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';

export const metadata = {
  title: 'Login - CodeGuideX',
  description: 'Login to your CodeGuideX account',
};

export default function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">CodeGuideX</h1>
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
          <p className="auth-subtitle">
            Login to continue to your dashboard
          </p>
        </div>

        {/* Form */}
        <LoginForm />

        {/* Additional Links */}
        <div className="text-center text-sm text-gray-600 space-y-2 pt-4">
          <div>
            <Link href="/auth/reset-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 mt-6 pt-6 border-t">
          <p>
            Protected by reCAPTCHA and subject to the{' '}
            <Link href="/privacy" className="hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/terms" className="hover:underline">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
