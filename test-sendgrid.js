import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function testSendGrid() {
  try {
    // Check if API key exists
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('❌ ERROR: SENDGRID_API_KEY not found in .env.local');
      process.exit(1);
    }

    console.log('✓ SENDGRID_API_KEY found');

    // Initialize SendGrid
    sgMail.setApiKey(apiKey);
    console.log('✓ SendGrid client initialized');

    // Prepare test email
    const msg = {
      to: 'pramandkumarpappu@gmail.com',
      from: 'aryan291592@gmail.com', // Change this to your verified sender email
      subject: 'CodeGuideX - SendGrid Test Email',
      html: `
        <h1>SendGrid Integration Test</h1>
        <p>Hello! 👋</p>
        <p>This is a test email from <strong>CodeGuideX</strong> to verify that SendGrid is working correctly.</p>
        <p><strong>Test Details:</strong></p>
        <ul>
          <li>Sent at: ${new Date().toISOString()}</li>
          <li>Project: CodeGuideX</li>
          <li>Status: ✓ Integration is working</li>
        </ul>
        <p>If you received this email, SendGrid is configured and working perfectly!</p>
        <hr>
        <p><em>This is an automated test email. Please ignore if you did not request this test.</em></p>
      `,
      text: 'This is a test email from CodeGuideX. If you received this, SendGrid is working correctly.'
    };

    console.log('📧 Sending test email to: pramandkumarpappu@gmail.com');
    const response = await sgMail.send(msg);
    
    console.log('\n✅ SUCCESS! SendGrid is working perfectly!');
    console.log(`📨 Email sent successfully`);
    console.log(`   Response Status: ${response[0].statusCode}`);
    console.log(`   Message ID: ${response[0].headers['x-message-id']}`);
    console.log(`\n📬 Check your inbox at pramandkumarpappu@gmail.com`);

  } catch (error) {
    console.error('\n❌ ERROR: SendGrid test failed!');
    
    if (error.response) {
      console.error(`Status Code: ${error.response.statusCode}`);
      console.error(`Error Body:`, error.response.body);
      
      // Provide helpful troubleshooting
      if (error.response.statusCode === 401 || error.response.body?.errors?.[0]?.message?.includes('authorization grant')) {
        console.error('\n⚠️  AUTHENTICATION FAILED: Invalid or Expired API Key');
        console.error('   Reason: The provided authorization grant is invalid, expired, or revoked');
        console.error('\n   🔧 How to Fix:');
        console.error('   1. Go to https://app.sendgrid.com/settings/api_keys');
        console.error('   2. Generate a NEW API key');
        console.error('   3. Copy the entire key (you can only see it once!)');
        console.error('   4. Update SENDGRID_API_KEY in .env.local with the new key');
        console.error('   5. Run this test again');
      } else if (error.response.statusCode === 403) {
        console.error('\n⚠️  Permission denied: Check API key permissions');
      } else if (error.response.statusCode === 400) {
        console.error('\n⚠️  Bad request: Check email format or sender address');
        console.error('   - Verify "from" email is authorized in SendGrid');
      }
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

testSendGrid();
