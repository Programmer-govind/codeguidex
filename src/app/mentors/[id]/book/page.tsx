'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MentorService } from '@/services/mentor.service';
import { MentorProfile, CreateBookingData } from '@/types/mentor.types';
import { BookingForm } from '@/components/mentor/BookingForm';
import { StripePayment } from '@/components/mentor/StripePayment';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

interface BookingPageProps {
    params: {
        id: string;
    };
}

export default function BookingPage({ params }: BookingPageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [mentor, setMentor] = useState<MentorProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Booking State
    const [step, setStep] = useState<'details' | 'payment'>('details');
    const [bookingData, setBookingData] = useState<CreateBookingData | null>(null);
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const data = await MentorService.getMentorProfile(params.id);
                setMentor(data);
            } catch (err) {
                console.error('Failed to fetch mentor:', err);
                setError('Failed to load mentor details');
            } finally {
                setLoading(false);
            }
        };

        fetchMentor();
    }, [params.id]);

    const handleBookingSubmit = async (data: CreateBookingData) => {
        if (!user || !mentor) return;

        setBookingData(data);

        try {
            // Calculate amount
            const amount = (mentor.hourlyRate * data.duration) / 60;

            // Create Payment Intent
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            const { clientSecret, error } = await response.json();

            if (error) throw new Error(error);

            setClientSecret(clientSecret);
            setStep('payment');
        } catch (err: any) {
            console.error('Payment setup failed:', err);
            alert('Failed to initialize payment. Please try again.');
        }
    };

    const handlePaymentSuccess = async (paymentIntentId: string) => {
        if (!user || !mentor || !bookingData) return;

        try {
            // 1. Create Booking
            const booking = await MentorService.createBooking(
                user.id,
                user.displayName || 'Student',
                user.email || '',
                mentor.id,
                bookingData
            );

            // 2. Update Booking with Payment Info
            await MentorService.updateBooking(booking.id, {
                paymentId: paymentIntentId,
                paymentStatus: 'paid',
            });

            // 3. Create Session (Generates Video Link)
            await MentorService.createSession(booking.id);

            // 4. Redirect to Success Page
            router.push('/dashboard/student/bookings');
        } catch (err) {
            console.error('Failed to finalize booking:', err);
            alert('Payment successful but booking creation failed. Please contact support.');
        }
    };

    if (loading) return <LoadingSpinner fullPage message="Loading..." />;

    if (error || !mentor) {
        return (
            <div className="container mx-auto px-4 py-8">
                <ErrorMessage message={error || 'Mentor not found'} type="error" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        Please Log In
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        You need to be logged in to book a mentor session.
                    </p>
                    <button
                        onClick={() => router.push(`/auth/login?redirect=/mentors/${params.id}/book`)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-colors"
                    >
                        Log In / Sign Up
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="p-8 border-b border-gray-200 dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Book a Session with {mentor.displayName}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            {step === 'details' ? 'Fill in the session details below.' : 'Complete your payment to confirm the booking.'}
                        </p>
                    </div>

                    <div className="p-8">
                        {step === 'details' ? (
                            <BookingForm
                                mentor={mentor}
                                onSubmit={handleBookingSubmit}
                                isSubmitting={false}
                            />
                        ) : (
                            clientSecret && bookingData && (
                                <StripePayment
                                    clientSecret={clientSecret}
                                    amount={(mentor.hourlyRate * bookingData.duration) / 60}
                                    onSuccess={handlePaymentSuccess}
                                    onCancel={() => setStep('details')}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
