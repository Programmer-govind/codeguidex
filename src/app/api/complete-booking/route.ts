import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { MentorService } from '@/services/mentor.service';
import { EmailService } from '@/services/email.service';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-11-17.clover',
});

export async function POST(request: Request) {
    try {
        const { paymentIntentId } = await request.json();

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: 'Payment Intent ID is required' },
                { status: 400 }
            );
        }

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
                { error: 'Payment not successful' },
                { status: 400 }
            );
        }

        // Extract booking data from metadata
        const metadata = paymentIntent.metadata;

        if (!metadata.userId || !metadata.mentorId) {
            return NextResponse.json(
                { error: 'Invalid booking data' },
                { status: 400 }
            );
        }

        // Create booking
        const booking = await MentorService.createBooking(
            metadata.userId,
            metadata.userName,
            metadata.userEmail,
            metadata.mentorId,
            {
                mentorId: metadata.mentorId,
                topic: metadata.topic,
                description: metadata.description,
                preferredDate: metadata.preferredDate,
                preferredTime: metadata.preferredTime,
                duration: parseInt(metadata.duration),
            }
        );

        // Update booking with payment info
        await MentorService.updateBooking(booking.id, {
            paymentId: paymentIntentId,
            paymentStatus: 'paid',
        });

        // Create session (generates video link)
        await MentorService.createSession(booking.id);

        // Send confirmation emails
        try {
            // Send email to student
            await EmailService.sendBookingConfirmation(
                metadata.userEmail,
                metadata.userName,
                metadata.mentorName,
                {
                    topic: metadata.topic,
                    date: metadata.preferredDate,
                    time: metadata.preferredTime,
                    duration: parseInt(metadata.duration),
                }
            );

            // Send notification to mentor
            const mentor = await MentorService.getMentorProfile(metadata.mentorId);
            if (mentor) {
                await EmailService.sendMentorBookingNotification(
                    mentor.email,
                    mentor.displayName,
                    metadata.userName,
                    {
                        topic: metadata.topic,
                        date: metadata.preferredDate,
                        time: metadata.preferredTime,
                        duration: parseInt(metadata.duration),
                    }
                );
            }
        } catch (emailError) {
            console.error('Error sending booking emails:', emailError);
            // Don't fail the booking if email fails
        }

        return NextResponse.json({
            success: true,
            bookingId: booking.id
        });
    } catch (error: any) {
        console.error('Error completing booking:', error);
        return NextResponse.json(
            { error: `Failed to complete booking: ${error.message}` },
            { status: 500 }
        );
    }
}
