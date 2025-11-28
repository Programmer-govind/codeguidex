import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
    PaymentElement,
    Elements,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface CheckoutFormProps {
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: 'if_required',
            confirmParams: {
                return_url: `${window.location.origin}/booking-success`,
            },
        });

        if (error) {
            setMessage(error.message || 'An unexpected error occurred.');
        } else if (paymentIntent && paymentIntent.status === 'succeeded') {
            onSuccess(paymentIntent.id);
        } else {
            setMessage('Payment failed or was cancelled.');
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-300">Total to pay</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${amount.toFixed(2)}
                    </span>
                </div>
            </div>

            <PaymentElement />

            {message && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                    {message}
                </div>
            )}

            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading || !stripe || !elements}
                    className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Processing...' : 'Pay Now'}
                </button>
            </div>
        </form>
    );
};

interface StripePaymentProps {
    clientSecret: string;
    amount: number;
    onSuccess: (paymentIntentId: string) => void;
    onCancel: () => void;
}

export const StripePayment: React.FC<StripePaymentProps> = ({
    clientSecret,
    amount,
    onSuccess,
    onCancel,
}) => {
    const options = {
        clientSecret,
        appearance: {
            theme: 'stripe' as const,
            variables: {
                colorPrimary: '#2563eb',
            },
        },
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <Elements options={options} stripe={stripePromise}>
                <CheckoutForm amount={amount} onSuccess={onSuccess} onCancel={onCancel} />
            </Elements>
        </div>
    );
};
