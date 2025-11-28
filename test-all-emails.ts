import { EmailService } from './src/services/email.service.ts';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testAllEmails() {
  console.log('🧪 Testing all CodeGuideX email functionality...\n');

  try {
    // Test 1: Welcome Email
    console.log('📧 Test 1: Welcome Email');
    const welcomeResult = await EmailService.sendWelcomeEmail(
      'pramandkumarpappu@gmail.com',
      'Test User',
      'student'
    );
    console.log(`   Welcome Email: ${welcomeResult ? '✅ Sent' : '❌ Failed'}\n`);

    // Test 2: Booking Confirmation
    console.log('📧 Test 2: Booking Confirmation Email');
    const bookingResult = await EmailService.sendBookingConfirmation(
      'pramandkumarpappu@gmail.com',
      'John Student',
      'Sarah Mentor',
      {
        topic: 'React Development',
        date: 'December 15, 2025',
        time: '2:00 PM EST',
        duration: 60,
        meetingLink: 'https://meet.jit.si/test-room'
      }
    );
    console.log(`   Booking Confirmation: ${bookingResult ? '✅ Sent' : '❌ Failed'}\n`);

    // Test 3: Mentor Booking Notification
    console.log('📧 Test 3: Mentor Booking Notification');
    const mentorResult = await EmailService.sendMentorBookingNotification(
      'pramandkumarpappu@gmail.com',
      'Sarah Mentor',
      'John Student',
      {
        topic: 'React Development',
        date: 'December 15, 2025',
        time: '2:00 PM EST',
        duration: 60
      }
    );
    console.log(`   Mentor Notification: ${mentorResult ? '✅ Sent' : '❌ Failed'}\n`);

    // Test 4: Community Creation Confirmation
    console.log('📧 Test 4: Community Creation Confirmation');
    const communityResult = await EmailService.sendCommunityCreationConfirmation(
      'pramandkumarpappu@gmail.com',
      'Alice Creator',
      {
        name: 'React Developers Hub',
        description: 'A community for React developers to share knowledge and help each other grow.',
        category: 'Web Development'
      }
    );
    console.log(`   Community Confirmation: ${communityResult ? '✅ Sent' : '❌ Failed'}\n`);

    // Test 5: Password Reset Email
    console.log('📧 Test 5: Password Reset Email');
    const resetResult = await EmailService.sendPasswordResetEmail(
      'pramandkumarpappu@gmail.com',
      'https://codeguidex.com/auth/reset-password?token=test-token'
    );
    console.log(`   Password Reset: ${resetResult ? '✅ Sent' : '❌ Failed'}\n`);

    // Test 6: Notification Email
    console.log('📧 Test 6: Notification Email');
    const notificationResult = await EmailService.sendNotificationEmail(
      'pramandkumarpappu@gmail.com',
      'Test User',
      {
        title: 'New Comment on Your Post',
        message: 'Someone commented on your post "Getting Started with React". Check it out!',
        actionUrl: 'https://codeguidex.com/posts/123',
        actionLabel: 'View Comment'
      }
    );
    console.log(`   Notification Email: ${notificationResult ? '✅ Sent' : '❌ Failed'}\n`);

    console.log('🎉 All email tests completed!');
    console.log('📬 Check your inbox at pramandkumarpappu@gmail.com for all test emails');

  } catch (error) {
    console.error('❌ Error during email testing:', error);
    process.exit(1);
  }
}

testAllEmails();