'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function BookingSuccessPage() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [bookingDetails, setBookingDetails] = useState<any>(null);

    useEffect(() => {
        const completeBooking = async () => {
            if (!searchParams) {
                setError('Invalid page access');
                setLoading(false);
                return;
            }

            // Get payment intent from URL
            const paymentIntent = searchParams.get('payment_intent');
            const redirectStatus = searchParams.get('redirect_status');

            if (redirectStatus === 'succeeded' && paymentIntent) {
                try {
                    // Call API to complete booking
                    const response = await fetch('/api/complete-booking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ paymentIntentId: paymentIntent }),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.error || 'Failed to complete booking');
                    }

                    // Store booking details
                    setBookingDetails(data.booking);
                    setLoading(false);
                } catch (err: any) {
                    console.error('Failed to complete booking:', err);
                    setError(err.message || 'Failed to complete booking. Please contact support.');
                    setLoading(false);
                }
            } else if (redirectStatus === 'failed') {
                setError('Payment failed. Please try again.');
                setLoading(false);
            } else {
                // Still processing or unknown status
                setTimeout(() => {
                    setLoading(false);
                }, 2000);
            }
        };

        completeBooking();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="text-center">
                    <LoadingSpinner />
                    <p className="text-gray-600 mt-4">Processing your payment...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="card-lg border-2 border-red-200 bg-red-50 text-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-4xl">❌</span>
                        </div>
                        <h1 className="text-2xl font-bold text-red-900 mb-2">
                            Payment Failed
                        </h1>
                        <p className="text-red-700 mb-8">
                            {error}
                        </p>
                        <div className="space-y-3">
                            <Link
                                href="/mentors"
                                className="button-primary w-full"
                            >
                                Back to Mentors
                            </Link>
                            <Link
                                href="/dashboard"
                                className="button-secondary w-full"
                            >
                                Go to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="card-lg border-2 border-green-200 bg-green-50 text-center shadow-lg">
                    {/* Success Icon */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                        <span className="text-4xl">✅</span>
                    </div>

                    {/* Success Message */}
                    <h1 className="text-3xl font-bold text-green-900 mb-2">
                        Booking Confirmed! 🎉
                    </h1>
                    <p className="text-green-700 mb-8">
                        Your mentor session has been successfully booked. Check your email for confirmation details.
                    </p>

                    {/* Booking Details (if available) */}
                    {bookingDetails && (
                        <div className="bg-white rounded-lg p-4 mb-8 border border-green-200">
                            <div className="grid grid-cols-2 gap-4 text-left">
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Booking ID</p>
                                    <p className="text-sm font-mono text-gray-900">{bookingDetails.id?.slice(0, 12)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-600 font-semibold">Status</p>
                                    <p className="text-sm font-semibold text-green-600">✓ Confirmed</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            href="/dashboard/student/bookings"
                            className="button-primary w-full"
                        >
                            View My Bookings
                        </Link>
                        <Link
                            href="/mentors"
                            className="button-secondary w-full"
                        >
                            Browse More Mentors
                        </Link>
                        <Link
                            href="/dashboard"
                            className="button-tertiary w-full"
                        >
                            Back to Dashboard
                        </Link>
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-gray-600 mt-6">
                        Need help? <a href="#" className="text-blue-600 hover:underline font-semibold">Contact Support</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
