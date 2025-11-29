import 'server-only';
import sgMail from '@sendgrid/mail';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
}

export class EmailService {
  private static readonly DEFAULT_FROM = 'aryan291592@gmail.com';
  private static readonly FROM_NAME = 'CodeGuideX';
  private static sendGridInitialized = false;

  /**
   * Initialize SendGrid if not already done
   */
  private static initializeSendGrid(): boolean {
    if (this.sendGridInitialized) return true;

    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.warn('SendGrid API key not configured');
      return false;
    }

    try {
      sgMail.setApiKey(apiKey);
      this.sendGridInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize SendGrid:', error);
      return false;
    }
  }

  /**
   * Send a generic email
   */
  static async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.initializeSendGrid()) {
      return false;
    }

    try {
      const msg = {
        to: options.to,
        from: {
          email: options.from || this.DEFAULT_FROM,
          name: this.FROM_NAME,
        },
        subject: options.subject,
        html: options.html,
        text: options.text || this.stripHtml(options.html),
      };

      const result = await sgMail.send(msg);
      console.log(`Email sent successfully to ${options.to}: ${result[0]?.headers?.['x-message-id']}`);
      return true;
    } catch (error: any) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  /**
   * Send booking confirmation email
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
    const subject = `Booking Confirmed: ${bookingDetails.topic} with ${mentorName}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🎉 Booking Confirmed!</h1>

        <p>Hi ${studentName},</p>

        <p>Your mentoring session has been successfully booked and paid for!</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Session Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Mentor:</strong> ${mentorName}</li>
            <li><strong>Topic:</strong> ${bookingDetails.topic}</li>
            <li><strong>Date:</strong> ${bookingDetails.date}</li>
            <li><strong>Time:</strong> ${bookingDetails.time}</li>
            <li><strong>Duration:</strong> ${bookingDetails.duration} minutes</li>
            ${bookingDetails.meetingLink ? `<li><strong>Meeting Link:</strong> <a href="${bookingDetails.meetingLink}" style="color: #2563eb;">Join Session</a></li>` : ''}
          </ul>
        </div>

        <p><strong>Important:</strong></p>
        <ul>
          <li>Please join the session 5 minutes early</li>
          <li>Make sure your camera and microphone are working</li>
          <li>Have your questions ready!</li>
        </ul>

        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: studentEmail,
      subject,
      html,
    });
  }

  /**
   * Send booking notification to mentor
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
    const subject = `New Booking: ${bookingDetails.topic} with ${studentName}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">📅 New Booking Alert!</h1>

        <p>Hi ${mentorName},</p>

        <p>You have a new mentoring session booked!</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Session Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Student:</strong> ${studentName}</li>
            <li><strong>Topic:</strong> ${bookingDetails.topic}</li>
            <li><strong>Date:</strong> ${bookingDetails.date}</li>
            <li><strong>Time:</strong> ${bookingDetails.time}</li>
            <li><strong>Duration:</strong> ${bookingDetails.duration} minutes</li>
          </ul>
        </div>

        <p>Please prepare for the session and be available at the scheduled time.</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: mentorEmail,
      subject,
      html,
    });
  }

  /**
   * Send community creation confirmation
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
    const subject = `Community "${communityDetails.name}" Created Successfully!`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🎉 Community Created!</h1>

        <p>Hi ${creatorName},</p>

        <p>Congratulations! Your community has been successfully created.</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">Community Details:</h3>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Name:</strong> ${communityDetails.name}</li>
            <li><strong>Category:</strong> ${communityDetails.category}</li>
            <li><strong>Description:</strong> ${communityDetails.description}</li>
          </ul>
        </div>

        <p>You can now:</p>
        <ul>
          <li>Invite members to join your community</li>
          <li>Create posts and start discussions</li>
          <li>Manage community settings</li>
        </ul>

        <p>Welcome to the CodeGuideX community family!</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: creatorEmail,
      subject,
      html,
    });
  }

  /**
   * Send welcome email to new users
   */
  static async sendWelcomeEmail(
    userEmail: string,
    userName: string,
    userRole: 'student' | 'mentor' | 'admin'
  ): Promise<boolean> {
    const subject = `Welcome to CodeGuideX, ${userName}!`;

    const roleSpecificContent = {
      student: {
        title: 'Start Your Learning Journey',
        features: [
          'Browse and join communities',
          'Book mentoring sessions',
          'Ask questions and get help',
          'Track your learning progress'
        ]
      },
      mentor: {
        title: 'Share Your Knowledge',
        features: [
          'Set up your mentor profile',
          'Schedule mentoring sessions',
          'Help students learn and grow',
          'Earn from your expertise'
        ]
      },
      admin: {
        title: 'Manage the Platform',
        features: [
          'Access admin dashboard',
          'Manage users and communities',
          'Monitor platform activity',
          'Handle reports and issues'
        ]
      }
    };

    const content = roleSpecificContent[userRole];

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🚀 Welcome to CodeGuideX!</h1>

        <p>Hi ${userName},</p>

        <p>Thank you for joining CodeGuideX! We're excited to have you as part of our community.</p>

        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1f2937;">${content.title}</h3>
          <p>As a ${userRole}, you can:</p>
          <ul>
            ${content.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
        </div>

        <p>Get started by exploring the platform and connecting with others!</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="https://codeguidex.vercel.app/dashboard"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Go to Dashboard
          </a>
        </div>

        <p>If you have any questions, feel free to reach out to our support team.</p>

        <p>Happy coding! 👨‍💻👩‍💻</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send password reset email (using Firebase Auth)
   */
  static async sendPasswordResetEmail(
    userEmail: string,
    resetLink: string
  ): Promise<boolean> {
    const subject = 'Reset Your CodeGuideX Password';

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🔐 Password Reset</h1>

        <p>Hi there,</p>

        <p>We received a request to reset your password for your CodeGuideX account.</p>

        <p>If you made this request, click the button below to reset your password:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}"
             style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reset Password
          </a>
        </div>

        <p><strong>This link will expire in 1 hour.</strong></p>

        <p>If you didn't request a password reset, you can safely ignore this email.</p>

        <p>For security reasons, please don't share this email with anyone.</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Send notification email for important updates
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
    const subject = `CodeGuideX: ${notification.title}`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">🔔 ${notification.title}</h1>

        <p>Hi ${userName},</p>

        <p>${notification.message}</p>

        ${notification.actionUrl && notification.actionLabel ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${notification.actionUrl}"
               style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              ${notification.actionLabel}
            </a>
          </div>
        ` : ''}

        <p>You can always check your notifications in your dashboard.</p>

        <p>Best regards,<br>The CodeGuideX Team</p>
      </div>
    `;

    return this.sendEmail({
      to: userEmail,
      subject,
      html,
    });
  }

  /**
   * Strip HTML tags for text version
   */
  private static stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }
}