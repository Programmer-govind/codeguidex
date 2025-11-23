import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service - CodeGuideX',
  description: 'Terms of Service for CodeGuideX platform',
};

export default function TermsOfServicePage() {
  return (
    <div className="legal-container">
      {/* Header */}
      <div className="legal-header">
        <Link href="/" className="legal-back-link">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to CodeGuideX
        </Link>
        <h1 className="legal-title">Terms of Service</h1>
        <p className="legal-subtitle">Last updated: November 21, 2025</p>
      </div>

      {/* Content */}
      <div className="legal-content">
        <section className="legal-section">
          <h2 className="legal-section-title">1. Acceptance of Terms</h2>
          <p className="legal-text">
            Welcome to CodeGuideX. These Terms of Service ("Terms") govern your use of our platform and services. By accessing or using CodeGuideX, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our platform.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">2. Description of Service</h2>
          <p className="legal-text">
            CodeGuideX is a learning platform that connects students with mentors and facilitates community-driven learning through:
          </p>
          <ul className="legal-list mt-4">
            <li>Question and answer forums</li>
            <li>Community discussions</li>
            <li>One-on-one mentoring sessions</li>
            <li>Live video sessions</li>
            <li>Educational resources and content</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">3. User Accounts</h2>
          <h3 className="legal-subsection-title">3.1 Account Creation</h3>
          <p className="legal-text mb-4">
            To access certain features of our platform, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
          </p>

          <h3 className="legal-subsection-title">3.2 Account Security</h3>
          <p className="legal-text">
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">4. User Conduct</h2>
          <p className="legal-text mb-4">
            You agree to use our platform responsibly and in compliance with applicable laws. You shall not:
          </p>
          <ul className="legal-list">
            <li>Post harmful, offensive, or inappropriate content</li>
            <li>Harass, intimidate, or discriminate against other users</li>
            <li>Share false or misleading information</li>
            <li>Violate intellectual property rights</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Use the platform for commercial purposes without permission</li>
            <li>Spam or flood the platform with excessive content</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">5. Content and Intellectual Property</h2>
          <h3 className="legal-subsection-title">5.1 User Content</h3>
          <p className="legal-text mb-4">
            You retain ownership of content you create and share on our platform. By posting content, you grant us a non-exclusive, royalty-free license to use, display, and distribute your content on our platform.
          </p>

          <h3 className="legal-subsection-title">5.2 Platform Content</h3>
          <p className="legal-text">
            All content provided by CodeGuideX, including but not limited to text, graphics, logos, and software, is owned by us or our licensors and is protected by intellectual property laws.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">6. Privacy</h2>
          <p className="legal-text">
            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your information. By using our platform, you consent to the collection and use of your information as outlined in our Privacy Policy.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">7. Mentorship and Services</h2>
          <h3 className="legal-subsection-title">7.1 Mentorship Sessions</h3>
          <p className="legal-text mb-4">
            Mentorship sessions are arranged between users. We facilitate these connections but are not responsible for the quality or outcome of individual sessions. Users participating in mentorship agree to conduct themselves professionally and respectfully.
          </p>

          <h3 className="legal-subsection-title">7.2 Service Availability</h3>
          <p className="legal-text">
            We strive to maintain platform availability but do not guarantee uninterrupted access. We reserve the right to modify or discontinue services with reasonable notice.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">8. Termination</h2>
          <p className="legal-text">
            We reserve the right to suspend or terminate your account and access to our platform at our discretion, with or without cause, and with or without notice. Upon termination, your right to use our platform will cease immediately.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">9. Disclaimers</h2>
          <p className="legal-text mb-4">
            Our platform is provided "as is" without warranties of any kind. We disclaim all warranties, express or implied, including but not limited to merchantability, fitness for a particular purpose, and non-infringement.
          </p>
          <p className="legal-text mt-4">
            We do not guarantee the accuracy, completeness, or usefulness of any content on our platform. Users are responsible for evaluating the accuracy and reliability of information provided by other users.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">10. Limitation of Liability</h2>
          <p className="legal-text">
            To the maximum extent permitted by law, CodeGuideX shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of our platform.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">11. Indemnification</h2>
          <p className="legal-text">
            You agree to indemnify and hold CodeGuideX harmless from any claims, damages, losses, or expenses arising from your use of our platform or violation of these Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">12. Governing Law</h2>
          <p className="legal-text">
            These Terms shall be governed by and construed in accordance with applicable laws. Any disputes arising from these Terms shall be resolved through binding arbitration.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">13. Changes to Terms</h2>
          <p className="legal-text">
            We reserve the right to modify these Terms at any time. We will notify users of material changes via email or platform notification. Continued use of our platform after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        <section className="legal-section">
          <h2 className="legal-section-title">14. Contact Information</h2>
          <p className="legal-text">
            If you have questions about these Terms, please contact us at:
          </p>
          <div className="legal-contact">
            <p className="legal-text">
              <strong>Email:</strong> legal@codeguidex.com<br />
              <strong>Address:</strong> CodeGuideX Legal Team
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="legal-footer">
        <Link href="/" className="legal-footer-link">
          Return to Home
        </Link>
      </div>
    </div>
  );
}