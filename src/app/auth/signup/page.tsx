import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';

export const metadata = {
  title: 'Sign Up - CodeGuideX',
  description: 'Create a new CodeGuideX account',
};

export default function SignupPage() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <h1 className="auth-title">CodeGuideX</h1>
          <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
          <p className="auth-subtitle">
            Join our community and start learning today
          </p>
        </div>

        {/* Form */}
        <SignupForm />

        {/* Alternative */}
        <div className="text-center text-sm text-gray-600 mt-6 pt-6 border-t">
          <p>
            By signing up, you agree to our{' '}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
