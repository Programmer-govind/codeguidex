import { NextRequest, NextResponse } from 'next/server';
import { EmailService } from '@/services/email.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    let result = false;

    switch (type) {
      case 'welcome':
        result = await EmailService.sendWelcomeEmail(
          data.email,
          data.name,
          data.role
        );
        break;

      case 'booking-confirmation':
        result = await EmailService.sendBookingConfirmation(
          data.studentEmail,
          data.studentName,
          data.mentorName,
          data.bookingDetails
        );
        break;

      case 'mentor-booking-notification':
        result = await EmailService.sendMentorBookingNotification(
          data.mentorEmail,
          data.mentorName,
          data.studentName,
          data.bookingDetails
        );
        break;

      case 'community-creation':
        result = await EmailService.sendCommunityCreationConfirmation(
          data.creatorEmail,
          data.creatorName,
          data.communityDetails
        );
        break;

      case 'password-reset':
        result = await EmailService.sendPasswordResetEmail(
          data.email,
          data.resetLink
        );
        break;

      case 'notification':
        result = await EmailService.sendNotificationEmail(
          data.userEmail,
          data.userName,
          data.notification
        );
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}