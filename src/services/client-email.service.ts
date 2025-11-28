// Client-side email service that calls API routes
export class ClientEmailService {
  /**
   * Send welcome email via API
   */
  static async sendWelcomeEmail(
    email: string,
    name: string,
    role: 'student' | 'mentor' | 'admin'
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'welcome',
          email,
          name,
          role,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return false;
    }
  }

  /**
   * Send booking confirmation via API
   */
  static async sendBookingConfirmation(
    studentEmail: string,
    studentName: string,
    mentorName: string,
    bookingDetails: {
      topic: string;
      date: string;
      time: string;
      duration: number;
      meetingLink?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'booking-confirmation',
          studentEmail,
          studentName,
          mentorName,
          bookingDetails,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send booking confirmation email:', error);
      return false;
    }
  }

  /**
   * Send mentor booking notification via API
   */
  static async sendMentorBookingNotification(
    mentorEmail: string,
    mentorName: string,
    studentName: string,
    bookingDetails: {
      topic: string;
      date: string;
      time: string;
      duration: number;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'mentor-booking-notification',
          mentorEmail,
          mentorName,
          studentName,
          bookingDetails,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send mentor booking notification:', error);
      return false;
    }
  }

  /**
   * Send community creation confirmation via API
   */
  static async sendCommunityCreationConfirmation(
    creatorEmail: string,
    creatorName: string,
    communityDetails: {
      name: string;
      description: string;
      category: string;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'community-creation',
          creatorEmail,
          creatorName,
          communityDetails,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send community creation email:', error);
      return false;
    }
  }

  /**
   * Send password reset email via API
   */
  static async sendPasswordResetEmail(
    email: string,
    resetLink: string
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'password-reset',
          email,
          resetLink,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      return false;
    }
  }

  /**
   * Send notification email via API
   */
  static async sendNotificationEmail(
    userEmail: string,
    userName: string,
    notification: {
      title: string;
      message: string;
      actionUrl?: string;
      actionLabel?: string;
    }
  ): Promise<boolean> {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'notification',
          userEmail,
          userName,
          notification,
        }),
      });

      const result = await response.json();
      return result.success || false;
    } catch (error) {
      console.error('Failed to send notification email:', error);
      return false;
    }
  }
}